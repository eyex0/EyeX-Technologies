import { BaseAgent } from "./base";
import type { AgentContext, AgentResult } from "./types";

const ACTION_PROMPT = `You are an Action Agent. Based on analysis findings, recommend concrete business actions.
Each action has a description, priority level, expected impact, and effort estimate.
Return valid JSON only.`;

const ACTION_SCHEMA = {
  type: "object",
  properties: {
    actions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          action: { type: "string", description: "Concrete action to take" },
          priority: { type: "string", enum: ["critical", "high", "medium", "low"] },
          impact: { type: "string", description: "Expected business impact" },
          effort: { type: "string", description: "Estimated effort: low, medium, high" },
          owner: { type: "string", description: "Suggested owner/team" },
          timeline: { type: "string", description: "Suggested timeline" },
        },
        required: ["action", "priority", "impact", "effort"],
      },
    },
    summary: { type: "string" },
  },
  required: ["actions", "summary"],
};

export class ActionAgent extends BaseAgent {
  constructor() {
    super({
      name: "ActionAgent",
      description: "Recommends business actions based on analysis",
      systemPrompt: ACTION_PROMPT,
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    try {
      const prompt = `${this.formatContext(context)}
Based on the analysis findings, recommend concrete business actions with priorities.`;
      const result = await this.generateStructured<Record<string, unknown>>(prompt, ACTION_SCHEMA);
      return this.success(result.summary as string, result);
    } catch (err: any) {
      return this.error(`Action recommendation failed: ${err.message}`);
    }
  }
}
