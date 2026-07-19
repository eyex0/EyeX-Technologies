import { generateText } from "../llm";
import type { NodeConfig, NodeHandler, WorkflowState } from "./types";

const CODER_SYSTEM = `You are the QORX Coder Agent. You generate production-quality code based on research and plans.

Guidelines:
- Write clean, well-typed TypeScript/React code
- Use the existing project conventions (TanStack Start, Tailwind v4, lucide-react)
- Follow the existing architecture patterns
- Include proper error handling
- Generate complete, runnable code
- Match the existing Pro design system

Format your response as JSON:
{
  "code": "The complete generated code",
  "explanation": "Explanation of what the code does and how to use it",
  "files": [{"path": "src/file.ts", "description": "What this file does"}],
  "dependencies": ["Any new dependencies needed"],
  "breakingChanges": false
}`;

const CODER_CONFIG: NodeConfig = {
  name: "coder",
  description: "Generates production-quality code from plans and research",
  systemPrompt: CODER_SYSTEM,
  temperature: 0.3,
};

const CODE_SCHEMA = {
  type: "object",
  properties: {
    code: { type: "string", description: "The complete generated code" },
    explanation: { type: "string", description: "Explanation of the code" },
    files: {
      type: "array",
      items: {
        type: "object",
        properties: {
          path: { type: "string" },
          description: { type: "string" },
        },
        required: ["path", "description"],
      },
    },
    dependencies: {
      type: "array",
      items: { type: "string" },
    },
    breakingChanges: { type: "boolean" },
  },
  required: ["code", "explanation", "files", "dependencies", "breakingChanges"],
};

export const coderNode: NodeHandler = async (state: WorkflowState) => {
  const currentStep = state.planSteps[state.currentStep] || state.request;
  const research = state.research || "No research available";

  const result = await generateText(
    `Task: "${currentStep}"

Research context:
${research}

Full plan:
${state.plan || "Direct implementation"}

Generate complete, production-ready code following the existing project conventions.`,
    {
      systemInstruction: CODER_SYSTEM,
      responseSchema: CODE_SCHEMA,
      temperature: 0.3,
      maxOutputTokens: 8192,
    },
  );

  let parsed: {
    code: string;
    explanation: string;
    files: { path: string; description: string }[];
    dependencies: string[];
    breakingChanges: boolean;
  };
  try {
    parsed = JSON.parse(result);
  } catch {
    parsed = {
      code: result,
      explanation: "Generated code based on research and requirements",
      files: [{ path: "generated", description: "Generated output" }],
      dependencies: [],
      breakingChanges: false,
    };
  }

  const codeMessage = {
    role: "assistant" as const,
    content: `**Generated Code**\n\n${parsed.explanation}\n\n\`\`\`typescript\n${parsed.code.slice(0, 1500)}\n\`\`\`\n\n**Files:**\n${parsed.files.map((f: { path: string; description: string }) => `- \`${f.path}\`: ${f.description}`).join("\n")}`,
    metadata: { files: parsed.files, breakingChanges: parsed.breakingChanges },
  };

  return {
    code: parsed.code,
    currentStep: state.currentStep + 1,
    messages: [...state.messages, codeMessage],
    status: state.currentStep + 1 >= state.planSteps.length ? "completed" : "running",
    metadata: {
      ...state.metadata,
      generatedFiles: parsed.files,
      hasBreakingChanges: parsed.breakingChanges,
    },
  };
};

export function getCoderConfig(): NodeConfig {
  return CODER_CONFIG;
}
