import apiClint from "@/lib/apiClient";
import { CreatePatientPayload } from "@/types/patient.types";

export function createPatient(payload: CreatePatientPayload) {
  return apiClint("/patient", {
    method: "POST",
    body: payload,
  });
}
