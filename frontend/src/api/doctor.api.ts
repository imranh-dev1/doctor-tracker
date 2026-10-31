import apiClint from "@/lib/apiClient";
import { CreateDoctorPayload, GetAllDoctorsQuery } from "@/types";

export function createDoctor(payload: CreateDoctorPayload) {
  return apiClint("/doctor", { method: "POST", body: payload });
}

export function getAllDoctor(params?: GetAllDoctorsQuery) {
  return apiClint("/doctor", {
    method: "GET",
    query: params,
  });
}

export function deleteDoctor(id: string) {
  return apiClint(`/doctor/${id}`, {
    method: "DELETE",
  });
}
