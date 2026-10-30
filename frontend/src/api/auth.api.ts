import apiClint from "@/lib/apiClient";

export function userLogin(payload: { email: string; password: string }) {
  return apiClint("/auth/login", { method: "POST", body: payload });
}

export function getMe() {
  return apiClint("/auth/me", { method: "GET" });
}

export function logout() {
  return apiClint("/auth/logout", { method: "POST" });
}
