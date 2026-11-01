import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/api";

export function useGetDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
    staleTime: 60 * 1000,
  });
}
