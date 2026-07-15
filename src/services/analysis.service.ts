import { createServerFn } from "@tanstack/react-start";
import { GoogleGenAI, Type } from "@google/genai";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase/client";

// ── Security: Allowed file types (extension + MIME) ───────────────────────────
const ALLOWED_EXTENSIONS = [".csv", ".xlsx", ".xls"];
const ALLOWED_MIME_TYPES = [
  "text/csv",
  "text/plain", // some browsers send CSV as text/plain
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/octet-stream", // fallback for some OS
];

// ── Security: Fail fast if API key is missing ─────────────────────────────────
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

// ── Security: Sanitize errors — never leak internals to clients ───────────────
function safeErrorMessage(error: unknown): string {
  if (import.meta.env.DEV && error instanceof Error) return error.message;
  return "An internal error occurred. Please try again.";
}

export const analyzeDataFn = createServerFn({ method: "POST" })
  .validator(
    (data: { sampleData: Record<string, unknown>[]; headers: string[]; fileName: string }) =>
      data,
  )
  .handler(async ({ data }) => {
    try {
      const { sampleData, headers, fileName } = data;

      // ── Security: Read auth token from HTTP Authorization header only ─────────
      const { getWebRequest } = await import("vinxi/http");
      const request = getWebRequest();
      const authHeader = request.headers.get("authorization");
      const token = authHeader?.replace(/^Bearer\s+/i, "").trim();

      if (token) {
        await supabase.auth.setSession({ access_token: token, refresh_token: "" });
      }

      // ── Security: Validate file name extension server-side as well ────────────
      const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return { success: false, error: "Unsupported file type." };
      }

      // ── Security: Limit sample size to prevent prompt injection via large data ─
      const safeSample = sampleData.slice(0, 20);
      const safeHeaders = headers.slice(0, 50); // cap header count

      const prompt = `Analyze the following data sample and generate a dashboard JSON configuration.
Each widget can be of type: "kpi", "chart", or "insight".

Data headers: ${safeHeaders.join(", ")}
Sample data (up to 20 rows):
${JSON.stringify(safeSample, null, 2)}`;

      const ai = getGenAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
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
                    chartType: { type: Type.STRING, description: "line, bar, pie" },
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
                    icon: { type: Type.STRING, description: "Material icon name, optional" },
                    tone: {
                      type: Type.STRING,
                      description: "success, warn, info, or danger, optional",
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
    } catch (error: unknown) {
      if (import.meta.env.DEV) console.error("Analysis Error:", error);
      return { success: false, error: safeErrorMessage(error) };
    }
  });

export const AnalysisService = {
  /**
   * Validates, reads, and sends file data to the server function for AI analysis.
   */
  async processAndAnalyze(file: File, accessToken?: string): Promise<unknown> {
    // ── Security: Validate file type BEFORE reading (extension + MIME) ─────────
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new Error("Unsupported file format. Please upload CSV or Excel (.xlsx/.xls).");
    }
    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error("Invalid file type detected. Please upload a valid CSV or Excel file.");
    }

    // ── Security: Cap file size at 10 MB ──────────────────────────────────────
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error("File is too large. Maximum allowed size is 10 MB.");
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const content = e.target?.result;
          let sampleData: Record<string, unknown>[] = [];
          let headers: string[] = [];

          if (ext === ".csv") {
            const result = Papa.parse(content as string, {
              header: true,
              skipEmptyLines: true,
            });
            sampleData = (result.data as Record<string, unknown>[]).slice(0, 20);
            headers = result.meta.fields || [];
          } else {
            const data = new Uint8Array(content as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const result = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];
            sampleData = result.slice(0, 20);
            if (sampleData.length > 0) {
              headers = Object.keys(sampleData[0]);
            }
          }

          // Pass auth token via custom header (set by TanStack Start's fetch)
          const response = await analyzeDataFn({
            data: { sampleData, headers, fileName: file.name },
            headers: accessToken
              ? { Authorization: `Bearer ${accessToken}` }
              : undefined,
          } as any);

          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response.error));
          }
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file."));

      if (ext === ".csv") {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  },
};
