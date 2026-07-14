import { createServerFn } from "@tanstack/react-start";
import { GoogleGenAI, Type } from "@google/genai";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase/client";

const getGenAI = () => {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

export const analyzeDataFn = createServerFn({ method: "POST" })
  .validator(
    (data: { sampleData: any[]; headers: string[]; fileName: string; accessToken?: string }) =>
      data,
  )
  .handler(async ({ data }) => {
    try {
      const { sampleData, headers, fileName, accessToken } = data;

      // If we received an access token, set it on the server-side supabase client
      if (accessToken) {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: "" });
      }

      const prompt = `
Analyze the following data sample from file "${fileName}" and generate a dashboard JSON configuration.
The dashboard should include an array of widgets.
Each widget can be of type: "kpi", "chart", or "insight".

Data headers: ${headers.join(", ")}
Sample data:
${JSON.stringify(sampleData, null, 2)}
`;

      const ai = getGenAI();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              widgets: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING, description: "kpi, chart, or insight" },
                    title: { type: Type.STRING },
                    value: { type: Type.STRING, description: "For kpi type" },
                    chartType: {
                      type: Type.STRING,
                      description: "For chart type. e.g., line, bar, pie",
                    },
                    data: {
                      type: Type.ARRAY,
                      description: "For chart type",
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          value: { type: Type.NUMBER },
                        },
                      },
                    },
                    text: { type: Type.STRING, description: "For insight type" },
                    delta: { type: Type.STRING, description: "For kpi type, optional" },
                    icon: {
                      type: Type.STRING,
                      description: "For kpi type, Material icon name, optional",
                    },
                    tone: {
                      type: Type.STRING,
                      description:
                        "For insight type, e.g., success, warn, info, or danger, optional",
                    },
                  },
                  required: ["type", "title"],
                },
              },
            },
            required: ["widgets"],
          },
        },
      });

      const jsonStr = response.text?.trim() || "{}";
      const dashboardJson = JSON.parse(jsonStr);

      return { success: true, data: dashboardJson };
    } catch (error: any) {
      console.error("Analysis Error:", error);
      return { success: false, error: error.message };
    }
  });

export const AnalysisService = {
  /**
   * Reads a file (CSV or Excel) on the client, extracts a sample,
   * and sends it to the server function for analysis.
   */
  async processAndAnalyze(file: File, accessToken?: string) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const content = e.target?.result;
          let sampleData: any[] = [];
          let headers: string[] = [];

          if (file.name.endsWith(".csv")) {
            const text = content as string;
            const result = Papa.parse(text, { header: true, skipEmptyLines: true });
            sampleData = result.data.slice(0, 20);
            headers = result.meta.fields || [];
          } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
            const data = new Uint8Array(content as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const result = XLSX.utils.sheet_to_json(worksheet);
            sampleData = result.slice(0, 20);
            if (sampleData.length > 0) {
              headers = Object.keys(sampleData[0] as object);
            }
          } else {
            throw new Error("Unsupported file format. Please upload CSV or Excel.");
          }

          const response = await analyzeDataFn({
            data: {
              sampleData,
              headers,
              fileName: file.name,
              accessToken,
            },
          });

          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response.error));
          }
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));

      if (file.name.endsWith(".csv")) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  },
};
