import apiClint from "@/lib/apiClient";
import { CreateDoctorPayload } from "@/types";

export function createDoctor(payload: CreateDoctorPayload) {
  return apiClint("/doctor", { method: "POST", body: payload });
}
