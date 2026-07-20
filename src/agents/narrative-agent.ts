import { BaseAgent } from "./base";
import type { AgentContext, AgentResult } from "./types";

const NARRATIVE_PROMPT = `You are a Narrative Agent. Generate executive summaries and business narratives from data.
Write in a professional, concise style suitable for C-level stakeholders.
Focus on key metrics, trends, and strategic recommendations.`;

export class NarrativeAgent extends BaseAgent {
  constructor() {
    super({
      name: "NarrativeAgent",
      description: "Generates executive summaries and business narratives",
      systemPrompt: NARRATIVE_PROMPT,
      temperature: 0.5,
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    try {
      const prompt = `${this.formatContext(context)}
Generate an executive summary or business narrative based on the data.
Structure it with: Overview, Key Findings, Recommendations.`;
      const output = await this.generate(prompt);
      return this.success(output);
    } catch (err) {
      return this.error(
        `Narrative generation failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}
