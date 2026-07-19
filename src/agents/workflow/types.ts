export type NodeName = "supervisor" | "planner" | "researcher" | "coder";

export interface NodeMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  metadata?: Record<string, unknown>;
}

export interface WorkflowState {
  request: string;
  plan: string | null;
  planSteps: string[];
  currentStep: number;
  research: string | null;
  code: string | null;
  messages: NodeMessage[];
  history: { node: NodeName; output: string; durationMs: number }[];
  status: "running" | "completed" | "error";
  error?: string;
  metadata: Record<string, unknown>;
}

export type NodeHandler = (state: WorkflowState) => Promise<Partial<WorkflowState>>;

export interface GraphEdge {
  from: NodeName;
  to: NodeName;
  condition?: (state: WorkflowState) => boolean;
}

export interface NodeConfig {
  name: NodeName;
  description: string;
  systemPrompt: string;
  model?: string;
  temperature?: number;
}

export interface WorkflowGraphConfig {
  maxIterations?: number;
  model?: string;
  temperature?: number;
}
