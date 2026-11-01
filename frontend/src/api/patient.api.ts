import apiClint from "@/lib/apiClient";
import { CreatePatientPayload, PatientQuery } from "@/types/patient.types";

export function createPatient(payload: CreatePatientPayload) {
  return apiClint("/patient", {
    method: "POST",
    body: payload,
  });
}

export function getPatients(query?: PatientQuery) {
  return apiClint("/patient", {
    method: "GET",
    params: query,
  });
}
