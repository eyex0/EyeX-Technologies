import { generateText } from "../llm";
import { supervisorNode } from "./supervisor-node";
import { plannerNode } from "./planner-node";
import { researcherNode } from "./researcher-node";
import { coderNode } from "./coder-node";
import type { GraphEdge, NodeHandler, NodeMessage, WorkflowGraphConfig, WorkflowState } from "./types";

export type NodeName = "supervisor" | "planner" | "researcher" | "coder";

const DEFAULT_CONFIG: WorkflowGraphConfig = {
  maxIterations: 10,
  temperature: 0.3,
};

export class WorkflowGraph {
  private nodes: Map<NodeName, NodeHandler> = new Map();
  private edges: GraphEdge[] = [];
  private config: WorkflowGraphConfig;

  constructor(config?: WorkflowGraphConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  register(name: NodeName, handler: NodeHandler): this {
    this.nodes.set(name, handler);
    return this;
  }

  addEdge(from: NodeName, to: NodeName, condition?: (state: WorkflowState) => boolean): this {
    this.edges.push({ from, to, condition });
    return this;
  }

  async execute(
    request: string,
    initialState?: Partial<WorkflowState>,
  ): Promise<WorkflowState> {
    const state: WorkflowState = {
      request,
      plan: null,
      planSteps: [],
      currentStep: 0,
      research: null,
      code: null,
      messages: [{ role: "user", content: request }],
      history: [],
      status: "running",
      metadata: {},
      ...initialState,
    };

    let currentNode: NodeName = "supervisor";
    let iterations = 0;

    while (state.status === "running" && iterations < (this.config.maxIterations ?? 10)) {
      iterations++;
      const handler = this.nodes.get(currentNode);
      if (!handler) {
        state.status = "error";
        state.error = `No handler registered for node: ${currentNode}`;
        break;
      }

      const startTime = Date.now();
      try {
        const updates = await handler(state);
        Object.assign(state, updates);
        const duration = Date.now() - startTime;
        const lastHistory = state.history[state.history.length - 1];
        if (lastHistory) {
          lastHistory.durationMs = (lastHistory.durationMs || 0) + duration;
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        state.status = "error";
        state.error = `Node ${currentNode} failed: ${message}`;
        state.messages.push({
          role: "system",
          content: `Error in ${currentNode}: ${message}`,
        });
        break;
      }

      const nextNode = this.determineNext(currentNode, state);

      if (nextNode === "supervisor" && currentNode === "supervisor" && iterations > 1) {
        continue;
      }

      if (nextNode === currentNode && state.status === "running") {
        if (currentNode !== "supervisor") {
          const reclassify = await this.reclassifyAfterNode(currentNode, state);
          if (reclassify) {
            currentNode = reclassify;
            continue;
          }
        }
      }

      currentNode = nextNode;

      if (currentNode === "supervisor" && iterations > 1) {
        const isComplete = await this.checkCompletion(state);
        if (isComplete || state.planSteps.length === 0) {
          state.status = "completed";
        }
      }
    }

    if (iterations >= (this.config.maxIterations ?? 10)) {
      state.status = "completed";
      state.messages.push({
        role: "system",
        content: "Workflow completed maximum iterations. Summarizing results.",
      });
    }

    return state;
  }

  private determineNext(current: NodeName, state: WorkflowState): NodeName {
    const candidates = this.edges.filter((e) => e.from === current);
    if (candidates.length === 0) return "supervisor";

    for (const edge of candidates) {
      if (!edge.condition || edge.condition(state)) {
        return edge.to;
      }
    }
    return candidates[0].to;
  }

  private async reclassifyAfterNode(
    completedNode: NodeName,
    state: WorkflowState,
  ): Promise<NodeName | null> {
    if (completedNode === "researcher") {
      return "coder";
    }
    if (completedNode === "coder") {
      if (state.currentStep < state.planSteps.length) {
        const nextStepType = "researcher";
        return nextStepType as NodeName;
      }
      return "supervisor";
    }
    return null;
  }

  private async checkCompletion(state: WorkflowState): Promise<boolean> {
    if (state.currentStep >= state.planSteps.length && state.planSteps.length > 0) {
      return true;
    }
    if (state.code && state.research) {
      return true;
    }
    return false;
  }
}

export function createDefaultWorkflow(config?: WorkflowGraphConfig): WorkflowGraph {
  const graph = new WorkflowGraph(config);

  graph.register("supervisor", supervisorNode);
  graph.register("planner", plannerNode);
  graph.register("researcher", researcherNode);
  graph.register("coder", coderNode);

  graph.addEdge("supervisor", "planner", (s) => {
    const cat = s.metadata?.lastCategory as string;
    return cat === "planning" || cat === "research" || cat === "coding";
  });
  graph.addEdge("supervisor", "supervisor", (s) => {
    const cat = s.metadata?.lastCategory as string;
    return cat === "general" || !cat;
  });

  graph.addEdge("planner", "researcher");

  graph.addEdge("researcher", "coder");

  graph.addEdge("coder", "researcher", (s) => s.currentStep < s.planSteps.length);
  graph.addEdge("coder", "supervisor", (s) => s.currentStep >= s.planSteps.length);

  return graph;
}
