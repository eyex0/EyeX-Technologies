import { generateText } from "../llm";
import type { NodeConfig, NodeHandler, WorkflowState } from "./types";

const RESEARCHER_SYSTEM = `You are the QORX Researcher Agent. You gather information, analyze data, and provide detailed findings.

For each research task:
1. Analyze the request deeply
2. Consider multiple perspectives and approaches
3. Provide concrete, actionable findings
4. Reference relevant patterns, best practices, and technologies

Format your response as JSON:
{
  "findings": "Detailed research findings with analysis",
  "sources": ["Source or reasoning point 1", "Source or reasoning point 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "confidence": 0.95
}`;

const RESEARCHER_CONFIG: NodeConfig = {
  name: "researcher",
  description: "Gathers information and provides detailed analysis",
  systemPrompt: RESEARCHER_SYSTEM,
  temperature: 0.4,
};

const RESEARCH_SCHEMA = {
  type: "object",
  properties: {
    findings: { type: "string", description: "Detailed research findings" },
    sources: {
      type: "array",
      items: { type: "string" },
      description: "Key sources or reasoning points",
    },
    recommendations: {
      type: "array",
      items: { type: "string" },
      description: "Actionable recommendations",
    },
    confidence: {
      type: "number",
      description: "Confidence in findings (0-1)",
    },
  },
  required: ["findings", "sources", "recommendations", "confidence"],
};

export const researcherNode: NodeHandler = async (state: WorkflowState) => {
  const currentStepIndex = state.currentStep;
  const currentStep = state.planSteps[currentStepIndex] || state.request;
  const completedSteps = state.planSteps.slice(0, currentStepIndex);

  const result = await generateText(
    `Research task: "${currentStep}"
Overall context: "${state.plan || state.request}"
Already completed: ${completedSteps.join(", ") || "none"}
Provide thorough research findings.`,
    {
      systemInstruction: RESEARCHER_SYSTEM,
      responseSchema: RESEARCH_SCHEMA,
      temperature: 0.4,
    },
  );

  let parsed: {
    findings: string;
    sources: string[];
    recommendations: string[];
    confidence: number;
  };
  try {
    parsed = JSON.parse(result);
  } catch {
    parsed = {
      findings: result,
      sources: ["Direct analysis"],
      recommendations: ["Review findings and proceed with implementation"],
      confidence: 0.7,
    };
  }

  const researchText = `**Research Findings:**\n${parsed.findings}\n\n**Sources:**\n${parsed.sources.map((s: string) => `- ${s}`).join("\n")}\n\n**Recommendations:**\n${parsed.recommendations.map((r: string) => `- ${r}`).join("\n")}`;

  const newMessage = {
    role: "assistant" as const,
    content: researchText,
    metadata: { confidence: parsed.confidence, step: currentStep },
  };

  return {
    research: parsed.findings,
    currentStep: currentStepIndex + 1,
    messages: [...state.messages, newMessage],
    metadata: {
      ...state.metadata,
      lastResearchConfidence: parsed.confidence,
    },
  };
};

export function getResearcherConfig(): NodeConfig {
  return RESEARCHER_CONFIG;
}
