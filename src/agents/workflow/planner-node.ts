import { generateText } from "../llm";
import type { NodeConfig, NodeHandler, WorkflowState } from "./types";

const PLANNER_SYSTEM = `You are the QORX Planner Agent. You break complex requests into clear, actionable steps.

For each request, produce:
1. A high-level plan describing the approach
2. A numbered list of concrete steps (3-6 steps)
3. For each step, specify which agent type should handle it: "research" or "coder"

Format your response as JSON:
{
  "plan": "High-level approach description",
  "steps": ["Step 1 description", "Step 2 description", ...],
  "stepAssignments": ["research" | "coder", ...]
}`;

const PLANNER_CONFIG: NodeConfig = {
  name: "planner",
  description: "Decomposes complex requests into actionable steps",
  systemPrompt: PLANNER_SYSTEM,
  temperature: 0.3,
};

const PLAN_SCHEMA = {
  type: "object",
  properties: {
    plan: { type: "string", description: "High-level approach" },
    steps: {
      type: "array",
      items: { type: "string" },
      description: "Numbered list of concrete steps",
    },
    stepAssignments: {
      type: "array",
      items: { type: "string", enum: ["research", "coder"] },
      description: "Agent type for each step",
    },
  },
  required: ["plan", "steps", "stepAssignments"],
};

const FALLBACK_PLAN = {
  plan: "Direct execution",
  steps: ["Complete the request"],
  stepAssignments: ["coder"],
};

export const plannerNode: NodeHandler = async (state: WorkflowState) => {
  const lastMessage = state.messages[state.messages.length - 1]?.content || state.request;

  const result = await generateText(
    `Create a plan for: "${lastMessage}"
Previous plan (if any): ${state.plan || "none"}
Already completed steps: ${state.currentStep}`,
    {
      systemInstruction: PLANNER_SYSTEM,
      responseSchema: PLAN_SCHEMA,
      temperature: 0.3,
    },
  );

  let parsed: { plan: string; steps: string[]; stepAssignments: string[] };
  try {
    parsed = JSON.parse(result);
    if (!Array.isArray(parsed.steps) || parsed.steps.length === 0) {
      parsed = FALLBACK_PLAN;
    }
  } catch {
    parsed = FALLBACK_PLAN;
  }

  const newMessage = {
    role: "assistant" as const,
    content: `**Plan:** ${parsed.plan}\n\n**Steps:**\n${parsed.steps.map((s: string, i: number) => `${i + 1}. ${s} (${parsed.stepAssignments[i] || "coder"})`).join("\n")}`,
  };

  return {
    plan: parsed.plan,
    planSteps: parsed.steps,
    currentStep: 0,
    messages: [...state.messages, newMessage],
    history: [
      ...state.history,
      {
        node: "planner",
        output: parsed.plan,
        durationMs: 0,
      },
    ],
    status: "running",
  };
};

export function getPlannerConfig(): NodeConfig {
  return PLANNER_CONFIG;
}
