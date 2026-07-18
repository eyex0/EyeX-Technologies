import { BaseAgent } from "./base";
import type { AgentContext, AgentResult } from "./types";

const RCA_PROMPT = `You are a Root Cause Analysis Agent. Investigate anomalies, drops, and failures in business data.
Identify the primary cause, contributing factors, and recommended actions.
Be thorough and data-driven.
Return valid JSON only.`;

const RCA_SCHEMA = {
  type: "object",
  properties: {
    rootCause: { type: "string", description: "The primary root cause" },
    confidence: { type: "number", description: "Confidence 0-100" },
    contributingFactors: {
      type: "array",
      items: { type: "string" },
    },
    impact: { type: "string", description: "Business impact assessment" },
    recommendations: {
      type: "array",
      items: { type: "string" },
    },
    summary: { type: "string" },
  },
  required: ["rootCause", "confidence", "contributingFactors", "impact", "recommendations", "summary"],
};

export class RootCauseAgent extends BaseAgent {
  constructor() {
    super({
      name: "RootCauseAgent",
      description: "Performs root cause analysis on anomalies and failures",
      systemPrompt: RCA_PROMPT,
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    try {
      const prompt = `${this.formatContext(context)}
Perform a root cause analysis on the reported anomaly or issue. Be specific and actionable.`;
      const result = await this.generateStructured<Record<string, unknown>>(prompt, RCA_SCHEMA);
      return this.success(result.summary as string, result);
    } catch (err: any) {
      return this.error(`Root cause analysis failed: ${err.message}`);
    }
  }
}
