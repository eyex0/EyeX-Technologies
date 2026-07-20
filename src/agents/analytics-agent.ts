import { BaseAgent } from "./base";
import type { AgentContext, AgentResult } from "./types";

const ANALYTICS_PROMPT = `You are an Analytics Agent. Given a data sample, generate a dashboard configuration with widgets.
Each widget is one of: "kpi" (key metric with value+delta), "chart" (visualization with data series), or "insight" (textual finding).
Return valid JSON only.`;

const ANALYTICS_SCHEMA = {
  type: "object",
  properties: {
    widgets: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string", description: "kpi, chart, or insight" },
          title: { type: "string" },
          value: { type: "string", description: "For kpi type" },
          chartType: { type: "string", description: "For chart type: line, bar, pie" },
          data: {
            type: "array",
            description: "For chart type",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                value: { type: "number" },
              },
            },
          },
          text: { type: "string", description: "For insight type" },
          delta: { type: "string", description: "For kpi type" },
          tone: { type: "string", description: "For insight: success, warn, info, danger" },
        },
        required: ["type", "title"],
      },
    },
  },
  required: ["widgets"],
};

export class AnalyticsAgent extends BaseAgent {
  constructor() {
    super({
      name: "AnalyticsAgent",
      description: "Analyzes data samples and generates dashboard widget configurations",
      systemPrompt: ANALYTICS_PROMPT,
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    try {
      const prompt = `${this.formatContext(context)}
Generate a dashboard configuration from the provided data.`;
      const result = await this.generateStructured<{ widgets: unknown[] }>(
        prompt,
        ANALYTICS_SCHEMA,
      );
      return this.success(
        `Generated ${result.widgets.length} dashboard widgets`,
        result as unknown as Record<string, unknown>,
      );
    } catch (err) {
      return this.error(`Analytics failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
