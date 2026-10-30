import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-600/20">
        <Activity className="h-5 w-5" strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight">
            Doctor Tracker
          </span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Care Operations
          </span>
        </span>
      )}
    </div>
  );
}
