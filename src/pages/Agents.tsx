import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BackendApi, type AgentConfigRead } from "@/services/backend-api.service";
import { AppShell } from "@/components/layout/AppShell";
import { Card, Badge } from "@/components/common/primitives";
import { toast } from "sonner";
import { Cpu, Play, Pause } from "lucide-react";

function AgentCard({ agent, workspaceId, onToggle }: { agent: AgentConfigRead; workspaceId: string; onToggle: (id: string, enabled: boolean) => void }) {
  return (
    <div className="bento-card rounded-lg p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${agent.is_enabled ? "bg-emerald-500/10" : "bg-white/5"}`}>
            <Cpu size={20} className={agent.is_enabled ? "text-emerald-400" : "text-muted-foreground"} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{agent.display_name}</h3>
            <p className="text-[10px] font-mono text-muted-foreground">{agent.agent_role}</p>
          </div>
        </div>
        <button
          onClick={() => onToggle(agent.id, !agent.is_enabled)}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
            agent.is_enabled ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-muted-foreground"
          }`}
        >
          {agent.is_enabled ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <Badge tone={agent.is_enabled ? "success" : "neutral"}>{agent.is_enabled ? "Active" : "Disabled"}</Badge>
        {agent.model && <span className="text-muted-foreground font-mono text-[10px]">{agent.model}</span>}
      </div>
      {agent.description && <p className="text-xs text-muted-foreground">{agent.description}</p>}
    </div>
  );
}

export function AgentsPage() {
  const queryClient = useQueryClient();
  const { data: workspaces } = useQuery({ queryKey: ["workspaces"], queryFn: () => BackendApi.listWorkspaces() });
  const workspaceId = workspaces?.workspaces?.[0]?.id ?? "";

  const { data: agents, isLoading } = useQuery({
    queryKey: ["agent-configs", workspaceId],
    queryFn: () => BackendApi.listAgentConfigs(workspaceId),
    enabled: !!workspaceId,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ configId, enabled }: { configId: string; enabled: boolean }) =>
      BackendApi.updateAgentConfig(workspaceId, configId, { is_enabled: enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-configs", workspaceId] });
      toast.success("Agent config updated");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to update agent"),
  });

  const handleToggle = (configId: string, enabled: boolean) => {
    toggleMutation.mutate({ configId, enabled });
  };

  return (
    <AppShell title="Agent Management" subtitle="Configure and monitor AI agents">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bento-card rounded-lg p-5 animate-pulse">
              <div className="h-10 w-10 bg-white/5 rounded-lg mb-3" />
              <div className="h-4 w-24 bg-white/5 rounded mb-2" />
              <div className="h-3 w-16 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : agents && agents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} workspaceId={workspaceId} onToggle={handleToggle} />
          ))}
        </div>
      ) : (
        <Card title="No Agents">
          <div className="p-8 text-center text-muted-foreground text-sm">
            No agent configurations found. Create a workspace first.
          </div>
        </Card>
      )}
    </AppShell>
  );
}
