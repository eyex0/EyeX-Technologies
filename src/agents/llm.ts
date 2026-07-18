import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
      httpOptions: { headers: { "User-Agent": "eyex-agents" } },
    });
  }
  return client;
}

export interface LLMConfig {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  systemInstruction?: string;
  responseSchema?: Record<string, unknown>;
}

export async function generateText(
  prompt: string,
  config: LLMConfig = {},
): Promise<string> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: config.model || "gemini-3.5-flash",
    contents: prompt,
    config: {
      temperature: config.temperature ?? 0.3,
      maxOutputTokens: config.maxOutputTokens ?? 4096,
      systemInstruction: config.systemInstruction,
      responseMimeType: config.responseSchema ? "application/json" : undefined,
      responseSchema: config.responseSchema,
    },
  });
  return response.text?.trim() || "";
}

export async function generateStructured<T>(
  prompt: string,
  schema: Record<string, unknown>,
  config: LLMConfig = {},
): Promise<T> {
  const text = await generateText(prompt, { ...config, responseSchema: schema });
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Failed to parse structured output: ${text.slice(0, 200)}`);
  }
}
