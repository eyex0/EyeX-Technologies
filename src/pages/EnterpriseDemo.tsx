import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, Badge } from "@/components/common/primitives";
import { toast } from "sonner";
import {
  Loader2,
  Play,
  Building2,
  TrendingUp,
  Shield,
  Lightbulb,
  Activity,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
} from "lucide-react";

const DEMO_STEPS = [
  {
    key: "problem",
    label: "1. Problem",
    icon: AlertTriangle,
    description: "Detect business problems",
  },
  {
    key: "analysis",
    label: "2. Analysis",
    icon: BarChart3,
    description: "AI analyzes company data",
  },
  {
    key: "executive",
    label: "3. Exec Team",
    icon: Building2,
    description: "CEO → CFO → COO → Risk",
  },
  {
    key: "recommendations",
    label: "4. Recommendations",
    icon: Lightbulb,
    description: "Actionable insights",
  },
  { key: "impact", label: "5. Impact", icon: TrendingUp, description: "Business value delivered" },
];

type StepData = Record<string, unknown>;

export function EnterpriseDemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [stepData, setStepData] = useState<StepData>({});
  const [orgId] = useState("novapay_demo_" + Date.now());
  const [demoStarted, setDemoStarted] = useState(false);

  useEffect(() => {
    if (seeded) return;
    fetch("http://eyex-api:8000/api/v1/enterprise/demo/seed", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `org_id=${orgId}`,
    })
      .then((r) => (r.ok ? setSeeded(true) : null))
      .catch(() => {});
  }, [orgId, seeded]);

  const runStep = async (step: string) => {
    setLoading(true);
    try {
      const resp = await fetch("http://eyex-api:8000/api/v1/enterprise/demo/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `step=${step}&org_id=${orgId}`,
      });
      if (!resp.ok) throw new Error(`Step ${step} failed`);
      const data = await resp.json();
      setStepData((prev) => ({ ...prev, [step]: data }));
      toast.success(`Step ${DEMO_STEPS.find((s) => s.key === step)?.label} completed`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Demo step failed");
    } finally {
      setLoading(false);
    }
  };

  const startDemo = async () => {
    setDemoStarted(true);
    for (let i = 0; i < DEMO_STEPS.length; i++) {
      setCurrentStep(i);
      await runStep(DEMO_STEPS[i].key);
      await new Promise((r) => setTimeout(r, 500));
    }
  };

  const renderStepContent = () => {
    if (!demoStarted) return null;
    const step = DEMO_STEPS[currentStep];
    const data = stepData[step?.key || ""];
    if (!data)
      return (
        <div className="p-8 text-center text-muted-foreground text-sm">Waiting for step...</div>
      );

    switch (step?.key) {
      case "problem":
        return (
          <div className="space-y-4">
            {data.problems?.map(
              (p: { area?: string; problem?: string; impact?: string }, i: number) => (
                <div key={i} className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge tone="danger">{p.area}</Badge>
                    <span className="text-xs font-medium text-white">{p.problem}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{p.impact}</p>
                </div>
              ),
            )}
          </div>
        );
      case "analysis":
        return (
          <div className="space-y-2">
            {data.metrics &&
              Object.entries(data.metrics)
                .slice(0, 12)
                .map(([k, v]: [string, unknown]) => (
                  <div
                    key={k}
                    className="flex justify-between border-b border-border/50 py-1.5 text-xs"
                  >
                    <span className="text-muted-foreground">{k.replace(/_/g, " ")}</span>
                    <span className="text-white font-mono">{v}</span>
                  </div>
                ))}
          </div>
        );
      case "executive":
        return (
          <div className="space-y-4">
            {["ceo", "cfo", "coo", "risk"].map((agent) => {
              const result = data[agent];
              if (!result) return null;
              return (
                <div key={agent} className="border border-border rounded-lg p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary-brand mb-2">
                    {agent.toUpperCase()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {result.strategic_vision ||
                      result.financial_health_assessment ||
                      result.operational_efficiency ||
                      `Risk Score: ${(result.overall_risk_score * 100).toFixed(0)}%`}
                  </div>
                </div>
              );
            })}
          </div>
        );
      case "recommendations":
        return (
          <div className="space-y-3">
            {data.insights?.map(
              (ins: { title?: string; severity?: string; description?: string }, i: number) => (
                <div key={i} className="flex items-start gap-3 border border-border rounded-lg p-4">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 ${
                      ins.severity === "critical" || ins.severity === "high"
                        ? "bg-red-400"
                        : ins.severity === "medium"
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                    }`}
                  />
                  <div>
                    <div className="text-xs font-medium text-white">{ins.title}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {ins.description}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        );
      case "impact": {
        const a = (data.analytics as Record<string, number | undefined>) || {};
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{a.problems_detected?.total || 0}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                Problems Detected
              </div>
            </div>
            <div className="border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {a.recommendations_generated?.total || 0}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                Recommendations
              </div>
            </div>
            <div className="border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {a.estimated_time_saved_hours || 0}h
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                Time Saved
              </div>
            </div>
            <div className="border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{a.business_impact_score || 0}%</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                Impact Score
              </div>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <AppShell
      title="Enterprise Demo"
      subtitle="See EyeX in action with a realistic company scenario"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demo Steps */}
        <div className="lg:col-span-1">
          <Card title="Demo Flow">
            <div className="p-5 space-y-2">
              {!demoStarted ? (
                <button
                  onClick={startDemo}
                  disabled={loading}
                  className="w-full bg-white text-black text-xs font-bold uppercase tracking-widest py-3 rounded-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={14} /> : <Play size={14} />}
                  Start 5-Minute Demo
                </button>
              ) : (
                <div className="space-y-2">
                  {DEMO_STEPS.map((step, i) => {
                    const completed = !!stepData[step.key];
                    const active = currentStep === i;
                    return (
                      <div
                        key={step.key}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs transition-colors ${
                          active ? "bg-white/5 border border-white/10" : ""
                        } ${completed ? "opacity-100" : "opacity-50"}`}
                      >
                        {completed ? (
                          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        ) : active && loading ? (
                          <Loader2 size={16} className="animate-spin text-white shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-muted-foreground shrink-0" />
                        )}
                        <div>
                          <div className="text-white font-medium">{step.label}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {step.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-[10px] text-muted-foreground font-mono">
                  Company: NovaPay Technologies
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">Industry: Fintech</div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  Stage: Series A ($8.5M raised)
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Step Output */}
        <div className="lg:col-span-2">
          <Card title={demoStarted ? DEMO_STEPS[currentStep]?.label || "Demo" : "Ready to Start"}>
            <div className="p-6">
              {demoStarted ? (
                renderStepContent()
              ) : (
                <div className="text-center py-12">
                  <Play size={48} className="mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Experience the full EyeX platform with NovaPay — a realistic fintech company
                    scenario
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Watch as EyeX detects problems, analyzes data, runs the AI executive team,
                    generates recommendations, and measures business impact
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
