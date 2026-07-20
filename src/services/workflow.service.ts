import { createServerFn } from "@tanstack/react-start";
import { createDefaultWorkflow } from "@/agents/workflow/graph";

export const executeWorkflowFn = createServerFn({ method: "POST" })
  .validator((data: { request: string; messages?: { role: string; content: string }[] }) => data)
  .handler(async ({ data }) => {
    try {
      const { request } = data;

      const graph = createDefaultWorkflow();
      const result = await graph.execute(request);

      return {
        success: true,
        request: result.request,
        plan: result.plan,
        planSteps: result.planSteps,
        research: result.research,
        code: result.code,
        messages: result.messages,
        history: result.history,
        status: result.status,
        error: result.error,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return { success: false, error: message };
    }
  });

export const WorkflowService = {
  async execute(request: string) {
    const response = await executeWorkflowFn({ data: { request } });
    if (!response.success) {
      throw new Error(response.error || "Workflow execution failed");
    }
    return response;
  },
};
