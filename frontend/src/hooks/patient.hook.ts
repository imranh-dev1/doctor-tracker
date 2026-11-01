import { createPatient } from "@/api";
import { useMutation } from "@tanstack/react-query";

export function useCreatePatient() {
  return useMutation({
    mutationFn: createPatient,
  });
}
