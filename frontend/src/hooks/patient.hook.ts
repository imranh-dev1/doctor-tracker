import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPatient,
  deletePatient,
  getPatientConditions,
  getPatients,
  updatePatient,
} from "@/api";
import type {
  CreatePatientPayload,
  PatientQuery,
  UpdatePatientPayload,
} from "@/types";

function useInvalidatePatients() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["patients"] });
    queryClient.invalidateQueries({ queryKey: ["doctors"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };
}

export function useGetPatients(query?: PatientQuery) {
  return useQuery({
    queryKey: ["patients", query],
    queryFn: () => getPatients(query),
    placeholderData: (previous) => previous,
  });
}

export function useGetPatientConditions() {
  return useQuery({
    queryKey: ["patients", "conditions"],
    queryFn: getPatientConditions,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePatient() {
  const invalidate = useInvalidatePatients();

  return useMutation({
    mutationFn: (payload: CreatePatientPayload) => createPatient(payload),
    onSuccess: invalidate,
  });
}

export function useUpdatePatient() {
  const invalidate = useInvalidatePatients();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePatientPayload;
    }) => updatePatient(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeletePatient() {
  const invalidate = useInvalidatePatients();

  return useMutation({
    mutationFn: (id: string) => deletePatient(id),
    onSuccess: invalidate,
  });
}
