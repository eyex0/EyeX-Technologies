import { generateText, generateStructured, type LLMConfig } from "./llm";
import type { AgentConfig, AgentContext, AgentResult } from "./types";

export abstract class BaseAgent {
  public readonly config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  abstract execute(context: AgentContext): Promise<AgentResult>;

  protected getLLMConfig(overrides?: Partial<LLMConfig>): LLMConfig {
    return {
      model: this.config.model || "gemini-3.5-flash",
      temperature: this.config.temperature ?? 0.3,
      systemInstruction: this.config.systemPrompt,
      ...overrides,
    };
  }

  protected async generate(prompt: string, config?: Partial<LLMConfig>): Promise<string> {
    return generateText(prompt, this.getLLMConfig(config));
  }

  protected async generateStructured<T>(
    prompt: string,
    schema: Record<string, unknown>,
    config?: Partial<LLMConfig>,
  ): Promise<T> {
    return generateStructured<T>(prompt, schema, this.getLLMConfig(config));
  }

  protected formatContext(context: AgentContext): string {
    const parts: string[] = [];
    if (context.data && Object.keys(context.data).length > 0) {
      parts.push(`Context data:\n${JSON.stringify(context.data, null, 2)}`);
    }
    if (context.messages.length > 0) {
      const history = context.messages
        .map((m) => `[${m.role.toUpperCase()}]: ${m.text}`)
        .join("\n");
      parts.push(`Conversation history:\n${history}`);
    }
    return parts.join("\n\n");
  }

  protected success(output: string, structured?: Record<string, unknown>): AgentResult {
    return { success: true, output, structured, agentName: this.config.name };
  }

  protected error(message: string): AgentResult {
    return { success: false, output: message, error: message, agentName: this.config.name };
  }
}
