import { generateText } from "../llm";
import type { NodeConfig, NodeHandler, NodeMessage, WorkflowState } from "./types";

const SUPERVISOR_SYSTEM = `You are the QORX Supervisor Agent. Your role is to:
1. Classify incoming requests into categories: "planning", "research", "coding", "general"
2. Decide which agent should handle the next step
3. Determine when the workflow is complete

Categories:
- "planning": Requests that need decomposition, task breakdown, strategy
- "research": Requests that need information gathering, analysis, investigation
- "coding": Requests that need code generation, implementation, debugging
- "general": Simple conversations that don't need multi-step processing

If the request is a simple greeting or general chat, respond with "general".
If the request needs complex work, respond with the appropriate category.`;

const SUPERVISOR_CONFIG: NodeConfig = {
  name: "supervisor",
  description: "Classifies requests and routes to appropriate agents",
  systemPrompt: SUPERVISOR_SYSTEM,
  temperature: 0.1,
};

export const supervisorNode: NodeHandler = async (state: WorkflowState) => {
  const lastMessage = state.messages[state.messages.length - 1]?.content || state.request;

  const result = await generateText(
    `Classify this request: "${lastMessage}"
History: ${state.history.map((h) => `[${h.node}]: ${h.output.slice(0, 100)}`).join("\n")}
Current status: ${state.status}
Plan steps remaining: ${state.planSteps.length - state.currentStep}

Which category should handle this next? Respond with one word: planning, research, coding, or general.`,
    {
      systemInstruction: SUPERVISOR_SYSTEM,
      temperature: 0.1,
      maxOutputTokens: 100,
    },
  );

  const category = result.trim().toLowerCase();
  const isGeneral = category.includes("general");

  const nextMessage: NodeMessage = {
    role: "assistant",
    content: `Supervisor classified as: ${isGeneral ? "general" : category}`,
    metadata: { category, isGeneral },
  };

  return {
    messages: [...state.messages, nextMessage],
    metadata: { ...state.metadata, lastCategory: category },
    status: isGeneral ? "completed" : state.status,
  };
};

export function getSupervisorConfig(): NodeConfig {
  return SUPERVISOR_CONFIG;
}
