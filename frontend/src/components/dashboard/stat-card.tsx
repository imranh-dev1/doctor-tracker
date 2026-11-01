import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon: ComponentType<{ className?: string }>;
  trend?: number;
  trendLabel?: string;
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  trendLabel = "vs last month",
}: StatCardProps) {
  const hasTrend = typeof trend === "number";
  const positive = (trend ?? 0) >= 0;
  const TrendIcon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="gap-3">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
            {value}
          </p>
        </div>

        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4.5" />
        </span>
      </CardHeader>

      <CardContent className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        {hasTrend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              positive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-destructive",
            )}
          >
            <TrendIcon className="size-3.5" />
            {Math.abs(trend ?? 0)}%
          </span>
        )}

        <span>{hasTrend ? trendLabel : hint}</span>
      </CardContent>
    </Card>
  );
}
