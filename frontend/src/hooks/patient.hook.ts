import { createPatient, getPatients } from "@/api";
import { PatientQuery } from "@/types/patient.types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCreatePatient() {
  return useMutation({
    mutationFn: createPatient,
  });
}

export function useGetPatients(query?: PatientQuery) {
  return useQuery({
    queryKey: ["patients", query],
    queryFn: () => getPatients(query),
  });
}
