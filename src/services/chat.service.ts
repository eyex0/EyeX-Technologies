import { createServerFn } from "@tanstack/react-start";
import { OrchestratorAgent } from "@/agents/orchestrator";

const orchestrator = new OrchestratorAgent();

export const chatWithCopilotFn = createServerFn({ method: "POST" })
  .validator((data: { message: string; history: { role: string; text: string }[] }) => data)
  .handler(async ({ data }) => {
    try {
      const { message, history } = data;

      const result = await orchestrator.orchestrate({
        messages: [
          ...history.map((h) => ({
            role: h.role as "user" | "assistant" | "system",
            text: h.text,
          })),
          { role: "user" as const, text: message },
        ],
      });

      return {
        success: true,
        text: result.final,
        steps: result.steps.map((s) => ({
          agent: s.agent,
          duration: s.duration,
          result: s.result.output,
        })),
        structured: result.structured,
      };
    } catch (error) {
      console.error("Chat Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  });

export const ChatService = {
  async sendMessage(message: string, history: { role: string; text: string }[]) {
    const response = await chatWithCopilotFn({
      data: { message, history },
    });

    if (!response.success) {
      throw new Error(response.error);
    }

    return response;
  },
};
