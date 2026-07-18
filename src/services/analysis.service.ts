import { createServerFn } from "@tanstack/react-start";
import { AnalyticsAgent } from "@/agents/analytics-agent";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const analyticsAgent = new AnalyticsAgent();

export const analyzeDataFn = createServerFn({ method: "POST" })
  .validator((data: { sampleData: any[]; headers: string[]; fileName: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { sampleData, headers, fileName } = data;

      const result = await analyticsAgent.execute({
        messages: [],
        data: {
          fileName,
          headers,
          sampleData,
          rowCount: sampleData.length,
        },
      });

      if (!result.success) {
        return { success: false, error: result.error || "Analysis failed" };
      }

      return { success: true, data: result.structured || { widgets: [] } };
    } catch (error: any) {
      console.error("Analysis Error:", error);
      return { success: false, error: error.message };
    }
  });

export const AnalysisService = {
  async processAndAnalyze(file: File) {
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
            data: { sampleData, headers, fileName: file.name },
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

