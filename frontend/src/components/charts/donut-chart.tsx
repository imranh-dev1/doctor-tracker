import type { DistributionPoint } from "@/types";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "oklch(0.72 0.16 160)",
  "oklch(0.78 0.15 70)",
  "oklch(0.68 0.18 20)",
];

const RADIUS = 62;
const STROKE = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface DonutChartProps {
  data: DistributionPoint[];
  centerLabel?: string;
  emptyLabel?: string;
}

export function DonutChart({
  data,
  centerLabel = "Total",
  emptyLabel = "No data yet",
}: DonutChartProps) {
  const total = data.reduce((sum, point) => sum + point.value, 0);

  if (total === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }

  let offset = 0;

  const segments = data.map((point, index) => {
    const fraction = point.value / total;
    const length = fraction * CIRCUMFERENCE;
    const segment = {
      ...point,
      color: COLORS[index % COLORS.length],
      dashArray: `${Math.max(length - 2, 0)} ${CIRCUMFERENCE - Math.max(length - 2, 0)}`,
      dashOffset: -offset,
      percent: Math.round(fraction * 100),
    };

    offset += length;

    return segment;
  });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <div className="relative shrink-0">
        <svg
          viewBox="0 0 160 160"
          className="size-40 -rotate-90"
          role="img"
          aria-label={`${centerLabel} distribution`}
        >
          <circle
            cx="80"
            cy="80"
            r={RADIUS}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={STROKE}
          />

          {segments.map((segment) => (
            <circle
              key={segment.label}
              cx="80"
              cy="80"
              r={RADIUS}
              fill="none"
              stroke={segment.color}
              strokeWidth={STROKE}
              strokeDasharray={segment.dashArray}
              strokeDashoffset={segment.dashOffset}
              className="transition-all duration-500"
            >
              <title>{`${segment.label}: ${segment.value} (${segment.percent}%)`}</title>
            </circle>
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums">{total}</span>
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {centerLabel}
          </span>
        </div>
      </div>

      <ul className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center gap-2 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="min-w-0 flex-1 truncate text-muted-foreground">
              {segment.label}
            </span>
            <span className="font-medium tabular-nums">{segment.value}</span>
            <span className="w-9 text-right text-xs text-muted-foreground tabular-nums">
              {segment.percent}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
