import { BaseAgent } from "./base";
import type { AgentContext, AgentResult } from "./types";

const SQL_PROMPT = `You are a SQL Agent. Generate and explain SQL queries for business analysis.
Given a natural language question and table schema, produce a correct SQL query.
Explain what the query does in plain language.
Return valid JSON only.`;

const SQL_SCHEMA = {
  type: "object",
  properties: {
    query: { type: "string", description: "The SQL query" },
    explanation: { type: "string", description: "Plain language explanation" },
    risk: { type: "string", description: "low, medium, high — query performance risk" },
    estimatedRows: { type: "string", description: "Estimated result set size" },
  },
  required: ["query", "explanation", "risk"],
};

export class SQLAgent extends BaseAgent {
  constructor() {
    super({
      name: "SQLAgent",
      description: "Generates and explains SQL queries",
      systemPrompt: SQL_PROMPT,
    });
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    try {
      const prompt = `${this.formatContext(context)}
Generate a SQL query for the user's question. Include explanation and risk assessment.`;
      const result = await this.generateStructured<Record<string, unknown>>(prompt, SQL_SCHEMA);
      return this.success(result.explanation as string, result);
    } catch (err) {
      return this.error(
        `SQL generation failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}
