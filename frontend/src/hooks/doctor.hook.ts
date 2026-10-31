import { createDoctor } from "@/api";
import { useMutation } from "@tanstack/react-query";

export function useCreateDoctor() {
  return useMutation({
    mutationFn: createDoctor,
  });
}
