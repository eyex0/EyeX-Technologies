import { BaseAgent } from "./base";
import type { AgentContext, AgentResult } from "./types";

const DQ_PROMPT = `You are a Data Quality Agent. Assess data for completeness, accuracy, consistency, and validity.
Flag missing values, outliers, duplicates, and format issues.
Return valid JSON only.`;

const DQ_SCHEMA = {
  type: "object",
  properties: {
    score: { type: "number", description: "Overall data quality score 0-100" },
    issues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          severity: { type: "string", enum: ["critical", "high", "medium", "low"] },
          field: { type: "string" },
          description: { type: "string" },
          suggestion: { type: "string" },
        },
        required: ["severity", "field", "description"],
      },
    },
    summary: { type: "string" },
  },
  required: ["score", "issues", "summary"],
};

export class DataQualityAgent extends BaseAgent {
  constructor() {
    super({
      name: "DataQualityAgent",
      description: "Assesses and validates data quality",
      systemPrompt: DQ_PROMPT,
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    try {
      const prompt = `${this.formatContext(context)}
Assess the quality of the provided data. Score 0-100 and list all issues found.`;
      const result = await this.generateStructured<Record<string, unknown>>(prompt, DQ_SCHEMA);
      return this.success(
        `Data quality score: ${result.score}/100 — ${(result.issues as unknown[]).length} issues found`,
        result,
      );
    } catch (err) {
      return this.error(
        `Data quality check failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}
