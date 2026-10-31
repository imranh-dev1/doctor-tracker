import { createDoctor, deleteDoctor, getAllDoctor } from "@/api";
import { GetAllDoctorsQuery } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

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
