import { useMutation, useQuery } from "@tanstack/react-query";
import { createDoctor, deleteDoctor, getAllDoctor } from "@/api";
import type { GetAllDoctorsQuery } from "@/types";

export function useCreateDoctor() {
  return useMutation({
    mutationFn: createDoctor,
  });
}

export function useGetAllDoctors(params?: GetAllDoctorsQuery) {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: () => getAllDoctor(params),
  });
}

export function useDeleteDoctor() {
  return useMutation({
    mutationFn: deleteDoctor,
  });
}
