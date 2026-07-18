export interface AgentMessage {
  role: "user" | "assistant" | "system";
  text: string;
  metadata?: Record<string, unknown>;
}

export interface AgentContext {
  messages: AgentMessage[];
  userId?: string;
  sessionId?: string;
  data?: Record<string, unknown>;
}

export interface AgentResult {
  success: boolean;
  output: string;
  structured?: Record<string, unknown>;
  error?: string;
  agentName: string;
  confidence?: number;
}

export interface AgentConfig {
  name: string;
  description: string;
  systemPrompt: string;
  model?: string;
  temperature?: number;
}

export type AgentTone = "success" | "warn" | "info" | "danger" | "neutral";

export interface InsightResult {
  title: string;
  body: string;
  tone: AgentTone;
  metric?: string;
  delta?: string;
}

export interface ForecastResult {
  period: string;
  value: number;
  confidence: number;
  trend: "up" | "down" | "stable";
}

export interface ActionRecommendation {
  action: string;
  priority: "critical" | "high" | "medium" | "low";
  impact: string;
  effort: string;
}
