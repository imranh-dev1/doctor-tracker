import apiClint from "@/lib/apiClient";
import type {
  ApiResponse,
  CreatePatientPayload,
  ListResult,
  Patient,
  PatientQuery,
  UpdatePatientPayload,
} from "@/types";

export function createPatient(payload: CreatePatientPayload) {
  return apiClint<ApiResponse<Patient>>("/patient", {
    method: "POST",
    body: payload,
  });
}

export function getPatients(query?: PatientQuery) {
  return apiClint<ApiResponse<ListResult<Patient>>>("/patient", {
    method: "GET",
    query,
  });
}

export function getPatient(id: string) {
  return apiClint<ApiResponse<Patient>>(`/patient/${id}`, {
    method: "GET",
  });
}

export function updatePatient(id: string, payload: UpdatePatientPayload) {
  return apiClint<ApiResponse<Patient>>(`/patient/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deletePatient(id: string) {
  return apiClint<ApiResponse<Patient>>(`/patient/${id}`, {
    method: "DELETE",
  });
}

export function getPatientConditions() {
  return apiClint<ApiResponse<string[]>>("/patient/conditions", {
    method: "GET",
  });
}
