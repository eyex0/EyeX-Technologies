import { createServerFn } from "@tanstack/react-start";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase/client";

// ── Security: Fail fast if API key is missing at startup ──────────────────────
function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Server misconfiguration: GEMINI_API_KEY is not set.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } },
  });
}

// ── Security: Sanitize errors — never leak internal stack traces to clients ───
function safeErrorMessage(error: unknown): string {
  if (import.meta.env.DEV && error instanceof Error) return error.message;
  if (error instanceof Error && error.message?.includes("API_KEY_INVALID"))
    return "Invalid API key configuration.";
  if (error instanceof Error && error.message?.includes("quota"))
    return "API quota exceeded. Please try again later.";
  return "An internal error occurred. Please try again.";
}

export const chatWithCopilotFn = createServerFn({ method: "POST" })
  .validator((data: { message: string; history: { role: string; text: string }[] }) => data)
  .handler(async ({ data }) => {
    try {
      const { message, history } = data;

      // ── Security: Read auth token from the incoming HTTP Authorization header ──
      // Never accept auth tokens from the request body (prevents token injection).
      const { getWebRequest } = await import("vinxi/http");
      const request = getWebRequest();
      const authHeader = request.headers.get("authorization");
      const token = authHeader?.replace(/^Bearer\s+/i, "").trim();

      if (token) {
        await supabase.auth.setSession({ access_token: token, refresh_token: "" });
      }

      // Fetch dashboards as AI context (fails gracefully if not authed)
      let dashboards: { title: string; layout: unknown }[] = [];
      try {
        const { data: dbData } = await supabase
          .from("dashboards")
          .select("title, layout")
          .order("created_at", { ascending: false })
          .limit(5);
        if (dbData) dashboards = dbData;
      } catch {
        // Non-fatal — AI can still answer without context
      }

      const context =
        dashboards.length > 0
          ? `Here is the data from the user's recent dashboards:\n${JSON.stringify(dashboards, null, 2)}`
          : `The user hasn't uploaded any datasets recently. Answer general business questions.`;

      const systemInstruction = `You are an AI Business Copilot named EyeX Copilot.
You help the user understand their data, answer questions about revenue, customer growth, and generate insights.
Base your answers primarily on the provided context from their datasets.
Keep your answers professional, analytical, and concise.\n\n${context}`;

      const ai = getGenAI();
      const chat = ai.chats.create({
        model: "gemini-2.0-flash-001",
        config: { systemInstruction },
      });

      const formattedHistory = history
        .map((h) => `${h.role === "user" ? "User" : "Copilot"}: ${h.text}`)
        .join("\n");

      const prompt = `Recent conversation:\n${formattedHistory}\n\nUser's new message:\n${message}`;

      const response = await chat.sendMessage({ message: prompt });
      return { success: true, text: response.text || "I couldn't generate a response." };
    } catch (error: unknown) {
      if (import.meta.env.DEV) console.error("Chat Error:", error);
      return { success: false, error: safeErrorMessage(error) };
    }
  });

export const ChatService = {
  async sendMessage(message: string, history: { role: string; text: string }[]) {
    // ── Security: Pass the auth token via Authorization header, NOT request body ──
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await chatWithCopilotFn({
      data: { message, history },
      headers: session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : undefined,
    } as any);

    if (!response.success) {
      throw new Error(response.error ?? "Chat failed");
    }
    return response.text;
  },
};
