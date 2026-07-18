import { WidgetConfig } from "./DynamicDashboard";
import { KpiWidget } from "./KpiWidget";
import { ChartWidget } from "./ChartWidget";
import { InsightWidget } from "./InsightWidget";

export function WidgetRenderer({ widget }: { widget: WidgetConfig }) {
  switch (widget.type) {
    case "kpi":
      return <KpiWidget widget={widget} />;
    case "chart":
      return <ChartWidget widget={widget} />;
    case "insight":
      return <InsightWidget widget={widget} />;
    default:
      return null;
  }
}
