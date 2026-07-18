import { BaseAgent } from "./base";
import type { AgentContext, AgentResult } from "./types";

const FORECAST_PROMPT = `You are a Forecasting Agent. Analyze historical data and generate forecasts.
Identify trends, seasonality, and provide confidence intervals.
Return valid JSON only.`;

const FORECAST_SCHEMA = {
  type: "object",
  properties: {
    forecasts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          period: { type: "string" },
          value: { type: "number" },
          confidence: { type: "number" },
          trend: { type: "string", enum: ["up", "down", "stable"] },
        },
        required: ["period", "value", "confidence", "trend"],
      },
    },
    summary: { type: "string" },
    riskFactors: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["forecasts", "summary"],
};

export class ForecastAgent extends BaseAgent {
  constructor() {
    super({
      name: "ForecastAgent",
      description: "Generates business forecasts from historical data",
      systemPrompt: FORECAST_PROMPT,
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    try {
      const prompt = `${this.formatContext(context)}
Generate a forecast based on the provided historical data. Include projected values with confidence levels.`;
      const result = await this.generateStructured<Record<string, unknown>>(prompt, FORECAST_SCHEMA);
      return this.success(result.summary as string || "Forecast generated", result);
    } catch (err: any) {
      return this.error(`Forecast failed: ${err.message}`);
    }
  }
}
