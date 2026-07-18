import { BaseAgent } from "./base";
import type { AgentContext, AgentResult } from "./types";

const INSIGHT_PROMPT = `You are an Insight Agent. Analyze business data and generate actionable insights.
Focus on anomalies, trends, correlations, and opportunities.
Each insight has a title, body text, tone (success/warn/info/danger), and optional metric.
Return valid JSON only.`;

const INSIGHT_SCHEMA = {
  type: "object",
  properties: {
    insights: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          body: { type: "string" },
          tone: { type: "string", enum: ["success", "warn", "info", "danger"] },
          metric: { type: "string" },
          delta: { type: "string" },
        },
        required: ["title", "body", "tone"],
      },
    },
    summary: { type: "string" },
  },
  required: ["insights", "summary"],
};

export class InsightAgent extends BaseAgent {
  constructor() {
    super({
      name: "InsightAgent",
      description: "Extracts actionable business insights from data",
      systemPrompt: INSIGHT_PROMPT,
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    try {
      const prompt = `${this.formatContext(context)}
Generate business insights from the data. Highlight what matters most.`;
      const result = await this.generateStructured<Record<string, unknown>>(prompt, INSIGHT_SCHEMA);
      return this.success(result.summary as string || "Insights generated", result);
    } catch (err: any) {
      return this.error(`Insight generation failed: ${err.message}`);
    }
  }
}
