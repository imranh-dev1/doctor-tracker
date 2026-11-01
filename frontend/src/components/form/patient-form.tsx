"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreatePatient, useGetAllDoctors, useUpdatePatient } from "@/hooks";
import type { Patient } from "@/types";

export const patientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter the patient's full name")
    .max(120, "Name must be 120 characters or fewer"),

  age: z
    .string()
    .min(1, "Enter the patient's age")
    .refine(
      (value) =>
        Number.isInteger(Number(value)) &&
        Number(value) >= 0 &&
        Number(value) <= 120,
      "Enter a valid age between 0 and 120",
    ),

  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    error: "Please select a gender",
  }),

  phone: z
    .string()
    .trim()
    .regex(
      /^(?:\+8801[3-9]\d{8}|8801[3-9]\d{8}|01[3-9]\d{8})$/,
      "Enter a valid Bangladeshi phone number",
    ),

  email: z.string().trim().email("Enter a valid email address"),

  condition: z
    .string()
    .trim()
    .min(2, "Enter the patient's condition")
    .max(200, "Condition must be 200 characters or fewer"),

  doctorId: z.string().min(1, "Please select a doctor"),
});

export type PatientFormValues = z.infer<typeof patientSchema>;

interface PatientFormProps {
  patient?: Patient;
  defaultDoctorId?: string;
  onSuccess?: () => void;
}

export function PatientForm({
  patient,
  defaultDoctorId,
  onSuccess,
}: PatientFormProps) {
  const { data: doctorsResponse, isPending: doctorsLoading } = useGetAllDoctors(
    { limit: 100 },
  );
  const { mutate: createPatient, isPending: isCreating } = useCreatePatient();
  const { mutate: updatePatient, isPending: isUpdating } = useUpdatePatient();

  const isEdit = Boolean(patient);
  const isPending = isCreating || isUpdating;

  const doctors = doctorsResponse?.data.result ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: patient?.name ?? "",
      age: patient ? String(patient.age) : "",
      gender: patient?.gender ?? "MALE",
      phone: patient?.phone ?? "",
      email: patient?.email ?? "",
      condition: patient?.condition ?? "",
      doctorId: patient?.doctorId ?? defaultDoctorId ?? "",
    },
  });

  const onSubmit = (values: PatientFormValues) => {
    const payload = {
      name: values.name.trim(),
      age: Number(values.age),
      gender: values.gender,
      phone: values.phone.trim(),
      email: values.email.trim().toLowerCase(),
      condition: values.condition.trim(),
      doctorId: values.doctorId,
    };

    const callbacks = {
      onSuccess: () => {
        toast.success(
          isEdit
            ? "Patient updated successfully."
            : "Patient added successfully.",
        );
        onSuccess?.();
      },
      onError: (error: unknown) => {
        toast.error(
          error instanceof Error
            ? error.message
            : isEdit
              ? "Failed to update patient."
              : "Failed to add patient.",
        );
      },
    };

    if (patient) {
      updatePatient({ id: patient._id, payload }, callbacks);
    } else {
      createPatient(payload, callbacks);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="patient-name">Patient name</Label>

          <Input
            id="patient-name"
            placeholder="Enter full name"
            {...register("name")}
            aria-invalid={Boolean(errors.name)}
          />

          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="patient-age">Age</Label>

          <Input
            id="patient-age"
            type="number"
            min={0}
            max={120}
            placeholder="Enter age"
            {...register("age")}
            aria-invalid={Boolean(errors.age)}
          />

          {errors.age && (
            <p className="text-xs text-destructive">{errors.age.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="patient-gender">Gender</Label>

          <NativeSelect
            id="patient-gender"
            className="w-full"
            {...register("gender")}
            aria-invalid={Boolean(errors.gender)}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </NativeSelect>

          {errors.gender && (
            <p className="text-xs text-destructive">{errors.gender.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="patient-phone">Phone number</Label>

          <Input
            id="patient-phone"
            type="tel"
            placeholder="01XXXXXXXXX"
            {...register("phone")}
            aria-invalid={Boolean(errors.phone)}
          />

          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="patient-email">Email address</Label>

          <Input
            id="patient-email"
            type="email"
            placeholder="patient@example.com"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
          />

          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="patient-condition">Condition</Label>

          <Input
            id="patient-condition"
            placeholder="e.g. Diabetes, Hypertension"
            {...register("condition")}
            aria-invalid={Boolean(errors.condition)}
          />

          {errors.condition && (
            <p className="text-xs text-destructive">
              {errors.condition.message}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="patient-doctor">Assigned doctor</Label>

          {doctorsLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <NativeSelect
              id="patient-doctor"
              className="w-full"
              {...register("doctorId")}
              aria-invalid={Boolean(errors.doctorId)}
            >
              <option value="">Select a doctor</option>

              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} — {doctor.specialization}
                </option>
              ))}
            </NativeSelect>
          )}

          {errors.doctorId && (
            <p className="text-xs text-destructive">
              {errors.doctorId.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}

          {isPending
            ? isEdit
              ? "Saving changes..."
              : "Adding patient..."
            : isEdit
              ? "Save changes"
              : "Add patient"}
        </Button>
      </div>
    </form>
  );
}
