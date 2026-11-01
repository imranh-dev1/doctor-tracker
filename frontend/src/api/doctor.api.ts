import apiClint from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateDoctorPayload,
  Doctor,
  GetAllDoctorsQuery,
  ListResult,
} from "@/types";

export function createDoctor(payload: CreateDoctorPayload) {
  return apiClint<ApiResponse<Doctor>>("/doctor", {
    method: "POST",
    body: payload,
  });
}

export function getAllDoctor(query?: GetAllDoctorsQuery) {
  return apiClint<ApiResponse<ListResult<Doctor>>>("/doctor", {
    method: "GET",
    query,
  });
}

export function deleteDoctor(id: string) {
  return apiClint<ApiResponse<Doctor>>(`/doctor/${id}`, {
    method: "DELETE",
  });
}
