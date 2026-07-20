import { supabase } from "@/lib/supabase/client";

const BASE_URL = import.meta.env.VITE_PYTHON_BACKEND_URL || "/api/v1";

const DEMO_ORG_ID = "novapay_demo_2024";

async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return null;
  return data.session.access_token;
}

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };
  return fetch(`${BASE_URL}${path}`, { ...options, headers });
}

export interface DemoProblem {
  area: string;
  problem: string;
  impact: string;
}

export interface DemoAnalysis {
  step: string;
  company: string;
  metrics?: Record<string, string>;
  context: string;
}

export interface DemoExecutive {
  step: string;
  ceo?: { strategic_vision?: string };
  cfo?: { financial_health_assessment?: string };
  coo?: { operational_efficiency?: string };
  risk?: { overall_risk_score?: number; key_risks?: string[] };
  status?: string;
}

export interface DemoRecommendation {
  type: string;
  severity: string;
  title: string;
  description: string;
}

export interface DemoImpact {
  step: string;
  analytics: Record<string, unknown>;
  message: string;
}

export type DemoStepResult =
  | { step: "problem"; company: string; problems: DemoProblem[] }
  | DemoAnalysis
  | DemoExecutive
  | { step: "recommendations"; insights: DemoRecommendation[]; total: number }
  | DemoImpact;

export interface DemoRunAllResponse {
  org_id: string;
  steps: Record<string, DemoStepResult>;
}

export const EnterpriseDemoService = {
  async seedDemo(): Promise<{ status: string; org_id: string }> {
    const resp = await apiFetch("/enterprise/demo/seed", {
      method: "POST",
      body: `org_id=${encodeURIComponent(DEMO_ORG_ID)}`,
    });
    if (!resp.ok) throw new Error(`Demo seed failed: ${resp.status}`);
    return resp.json();
  },

  async runStep(step: string): Promise<DemoStepResult> {
    const resp = await apiFetch("/enterprise/demo/scenario", {
      method: "POST",
      body: `step=${encodeURIComponent(step)}&org_id=${encodeURIComponent(DEMO_ORG_ID)}`,
    });
    if (!resp.ok) throw new Error(`Step ${step} failed: ${resp.status}`);
    return resp.json();
  },

  async runAll(): Promise<DemoRunAllResponse> {
    const resp = await apiFetch("/enterprise/demo/run-all", {
      method: "POST",
      body: `org_id=${encodeURIComponent(DEMO_ORG_ID)}`,
    });
    if (!resp.ok) throw new Error(`Demo run-all failed: ${resp.status}`);
    return resp.json();
  },

  async getStatus(): Promise<{
    org_id: string;
    is_seeded: boolean;
    company_name: string;
    nodes_count: number;
    vector_count: number;
  }> {
    const resp = await apiFetch(`/enterprise/demo/status/${DEMO_ORG_ID}`);
    if (!resp.ok) throw new Error(`Status check failed: ${resp.status}`);
    return resp.json();
  },
};
