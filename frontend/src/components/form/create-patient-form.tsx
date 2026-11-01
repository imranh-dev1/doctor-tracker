"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { useCreatePatient, useGetAllDoctors } from "@/hooks";
import AuthLoading from "../auth/auth-loading";
import { Doctor } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const createPatientSchema = z.object({
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

export type CreatePatientFormValues = z.infer<typeof createPatientSchema>;

export function CreatePatientForm(setOpen: (open: boolean) => void) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetAllDoctors();
  const { mutate: createPatient, isPending } = useCreatePatient();

  const doctors = data?.data.result ?? [];

  if (isLoading) {
    <AuthLoading key={data} label="Loading...." />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePatientFormValues>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      name: "",
      age: "",
      gender: "MALE",
      phone: "",
      email: "",
      condition: "",
      doctorId: "",
    },
  });

  const onSubmit = (values: CreatePatientFormValues) => {
    const payload = {
      name: values.name,
      age: Number(values.age),
      gender: values.gender,
      phone: values.phone,
      email: values.email,
      condition: values.condition,
      doctorId: values.doctorId,
    };

    createPatient(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["patients"],
        });
        toast.success("Patient added successfully.");
        setOpen(false);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to add patient.",
        );
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Patient Name */}
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

        {/* Age */}
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

        {/* Gender */}
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

        {/* Phone */}
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

        {/* Email */}
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

        {/* Condition */}
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

        {/* Assigned Doctor */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="patient-doctor">Assigned doctor</Label>

          <NativeSelect
            id="patient-doctor"
            className="w-full"
            {...register("doctorId")}
            aria-invalid={Boolean(errors.doctorId)}
          >
            <option value="">Select a doctor</option>

            {doctors.map((doctor: Doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name} — {doctor.specialization}
              </option>
            ))}
          </NativeSelect>

          {errors.doctorId && (
            <p className="text-xs text-destructive">
              {errors.doctorId.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}

          {isPending ? "Adding patient..." : "Add patient"}
        </Button>
      </div>
    </form>
  );
}
