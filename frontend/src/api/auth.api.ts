import apiClint from "@/lib/apiClient";

export function userLogin(payload: { email: string; password: string }) {
  return apiClint("/auth/login", { method: "POST", body: payload });
}
