import { WidgetConfig } from "./DynamicDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KpiWidget({ widget }: { widget: WidgetConfig }) {
  const isPositive = widget.delta?.startsWith("+");
  const isNegative = widget.delta?.startsWith("-");

  return (
    <Card className="bg-surface border-border overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-eye-text uppercase tracking-wider">
          {widget.title}
        </CardTitle>
        {widget.icon && (
          <span className="material-symbols-outlined h-4 w-4 text-eye-text">{widget.icon}</span>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-display font-bold text-eye-white">
          {widget.value}
        </div>
        {widget.delta && (
          <p
            className={`text-xs mt-1 font-mono ${
              isPositive
                ? "text-green-500"
                : isNegative
                ? "text-red-500"
                : "text-eye-text"
            }`}
          >
            {widget.delta}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

