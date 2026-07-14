import { WidgetConfig } from "./DynamicDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InsightWidget({ widget }: { widget: WidgetConfig }) {
  const getIcon = () => {
    switch (widget.tone) {
      case "success":
        return "check_circle";
      case "danger":
        return "error";
      case "warn":
        return "warning";
      case "info":
      default:
        return "info";
    }
  };

  const getColor = () => {
    switch (widget.tone) {
      case "success":
        return "text-green-500 border-green-500/20 bg-green-500/5";
      case "danger":
        return "text-red-500 border-red-500/20 bg-red-500/5";
      case "warn":
        return "text-yellow-500 border-yellow-500/20 bg-yellow-500/5";
      case "info":
      default:
        return "text-blue-500 border-blue-500/20 bg-blue-500/5";
    }
  };

  return (
    <Card className={`border overflow-hidden ${getColor()} lg:col-span-2`}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <span className="material-symbols-outlined h-5 w-5">{getIcon()}</span>
        <CardTitle className="text-sm font-medium uppercase tracking-wider">
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-eye-white/80">{widget.text}</p>
      </CardContent>
    </Card>
  );
}
