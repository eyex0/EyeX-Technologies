import { WidgetRenderer } from "./WidgetRenderer";

export interface WidgetConfig {
  type: "kpi" | "chart" | "insight";
  title: string;
  value?: string;
  chartType?: "line" | "bar" | "pie";
  data?: any[];
  text?: string;
  delta?: string;
  icon?: string;
  tone?: "success" | "warn" | "info" | "danger";
}

export interface DashboardConfig {
  widgets: WidgetConfig[];
}

export function DynamicDashboard({ config }: { config: DashboardConfig }) {
  if (!config || !config.widgets || config.widgets.length === 0) {
    return <div className="text-eye-text">No widgets to display.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {config.widgets.map((widget, index) => (
        <WidgetRenderer key={index} widget={widget} />
      ))}
    </div>
  );
}
