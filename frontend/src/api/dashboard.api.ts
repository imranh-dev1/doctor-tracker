import apiClint from "@/lib/apiClient";
import type { ApiResponse, DashboardStats } from "@/types";

export function getDashboardStats() {
  return apiClint<ApiResponse<DashboardStats>>("/dashboard/stats", {
    method: "GET",
  });
}
