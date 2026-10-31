import { Skeleton } from "../ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-80 max-w-full" />
        <Skeleton className="h-4 w-105 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {["metric-a", "metric-b", "metric-c", "metric-d"].map((metric) => (
          <Skeleton key={metric} className="h-33" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-95 lg:col-span-2" />
        <Skeleton className="h-95" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-90 lg:col-span-2" />
        <Skeleton className="h-90" />
      </div>
    </div>
  );
}
