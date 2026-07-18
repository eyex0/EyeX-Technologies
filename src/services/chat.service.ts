import { createServerFn } from "@tanstack/react-start";
import { GoogleGenAI } from "@google/genai";
import { DatabaseService } from "./database.service";
import { supabase } from "@/lib/supabase/client";

const getGenAI = () => {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

export const chatWithCopilotFn = createServerFn({ method: "POST" })
  .validator((data: { message: string, history: any[] }) => data)
  .handler(async ({ data }) => {
    try {
      const { message, history } = data;
      
      // Get auth to check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      // We will skip user specific data retrieval for demo if not logged in, 
      // but let's try to get dashboards to give context
      let dashboards: any[] = [];
      try {
        const { data: dbData } = await supabase.from("dashboards").select("*").order("created_at", { ascending: false }).limit(5);
        if (dbData) {
            dashboards = dbData;
        }
      } catch (e) {
          console.warn("Could not fetch dashboards for context", e);
      }
      
      let context = "";
      if (dashboards.length > 0) {
        context = `
Here is the data from the user's recent uploaded datasets (parsed as dashboard configs):
${JSON.stringify(dashboards.map(d => ({ title: d.title, layout: d.layout })), null, 2)}
`;
      } else {
        context = `The user hasn't uploaded any datasets recently. You can answer general business questions.`;
      }

      const systemInstruction = `
You are an AI Business Copilot named EyeX Copilot.
You help the user understand their data, answer questions about revenue, customer growth, and generate insights.
Base your answers primarily on the provided context from their datasets. If the data isn't sufficient, you can provide a reasonable business perspective or ask for more data.
Keep your answers professional, analytical, and concise.

${context}
`;

      const ai = getGenAI();
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
            systemInstruction: systemInstruction,
        }
      });
      
      // replay history
      if (history && history.length > 0) {
         // skip for now or we can implement history if needed. 
         // since GenAI SDK doesn't let us seed history easily like this without passing it in create,
         // let's just pass the history as part of the prompt for simplicity.
      }

      const formattedHistory = history.map(h => `${h.role === 'user' ? 'User' : 'Copilot'}: ${h.text}`).join('\n');
      
      const prompt = `
Recent conversation history:
${formattedHistory}

User's new message:
${message}
`;

      const response = await chat.sendMessage({
        message: prompt
      });

      return { success: true, text: response.text || "I'm sorry, I couldn't generate a response." };
    } catch (error: any) {
      console.error("Chat Error:", error);
      return { success: false, error: error.message };
    }
  });

export const ChatService = {
  async sendMessage(message: string, history: any[]) {
    const response = await chatWithCopilotFn({
      data: {
        message,
        history
      }
    });

    if (!response.success) {
      throw new Error(response.error);
    }

    return response.text;
  }
};
