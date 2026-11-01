"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { specializations } from "@/types";

export const updateDoctorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter the doctor's full name")
    .max(120, "Name must be 120 characters or fewer"),

  specialization: z.string().min(2, "Please select a specialization"),

  hospital: z
    .string()
    .trim()
    .min(2, "Enter the hospital name")
    .max(160, "Hospital name must be 160 characters or fewer"),

  phone: z
    .string()
    .trim()
    .regex(
      /^(?:\+8801[3-9]\d{8}|8801[3-9]\d{8}|01[3-9]\d{8})$/,
      "Enter a valid Bangladeshi phone number",
    ),

  email: z.string().trim().email("Enter a valid email address"),
});

export type UpdateDoctorFormValues = z.infer<typeof updateDoctorSchema>;

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

interface UpdateDoctorFormProps {
  doctor: Doctor;
  onSubmit: (values: UpdateDoctorFormValues) => void;
  isPending: boolean;
}

export function UpdateDoctorForm({
  doctor,
  onSubmit,
  isPending,
}: UpdateDoctorFormProps) {
  const form = useForm<UpdateDoctorFormValues>({
    resolver: zodResolver(updateDoctorSchema),
    defaultValues: {
      name: doctor.name,
      specialization: doctor.specialization,
      hospital: doctor.hospital,
      phone: doctor.phone,
      email: doctor.email,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  // Reset form when the selected doctor changes.
  useEffect(() => {
    reset({
      name: doctor.name,
      specialization: doctor.specialization,
      hospital: doctor.hospital,
      phone: doctor.phone,
      email: doctor.email,
    });
  }, [doctor, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="update-doctor-name">Full name</Label>

          <Input
            id="update-doctor-name"
            placeholder="Dr. Jane Doe"
            {...register("name")}
            aria-invalid={Boolean(errors.name)}
          />

          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Specialization */}
        <div className="space-y-2">
          <Label htmlFor="update-doctor-specialization">Specialization</Label>

          <NativeSelect
            id="update-doctor-specialization"
            className="w-full"
            {...register("specialization")}
            aria-invalid={Boolean(errors.specialization)}
          >
            <option value="">Select specialization</option>

            {specializations.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </NativeSelect>

          {errors.specialization && (
            <p className="text-xs text-destructive">
              {errors.specialization.message}
            </p>
          )}
        </div>

        {/* Hospital */}
        <div className="space-y-2">
          <Label htmlFor="update-doctor-hospital">Hospital / Clinic</Label>

          <Input
            id="update-doctor-hospital"
            placeholder="City Medical Center"
            {...register("hospital")}
            aria-invalid={Boolean(errors.hospital)}
          />

          {errors.hospital && (
            <p className="text-xs text-destructive">
              {errors.hospital.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="update-doctor-phone">Phone number</Label>

          <Input
            id="update-doctor-phone"
            type="tel"
            placeholder="+880 1712 345678"
            {...register("phone")}
            aria-invalid={Boolean(errors.phone)}
          />

          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="update-doctor-email">Email address</Label>

          <Input
            id="update-doctor-email"
            type="email"
            placeholder="jane@example.com"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
          />

          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}

          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
