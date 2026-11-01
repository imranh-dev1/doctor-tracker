import { cn } from "@/lib/utils";

interface BarListItem {
  label: string;
  sublabel?: string | null;
  value: number;
}

interface BarListProps {
  items: BarListItem[];
  emptyLabel?: string;
}

export function BarList({ items, emptyLabel = "No data yet" }: BarListProps) {
  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }

  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`} className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.label}</p>
              {item.sublabel && (
                <p className="truncate text-xs text-muted-foreground">
                  {item.sublabel}
                </p>
              )}
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums">
              {item.value}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full bg-primary transition-[width] duration-500",
              )}
              style={{ width: `${Math.max(4, (item.value / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
