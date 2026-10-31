"use client";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Save, Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { specializations } from "@/types";
import { useCreateDoctor } from "@/hooks/doctor.hook";
import { toast } from "sonner";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter the doctor's full name")
    .max(120, "Name must be 120 characters or fewer"),

  specialization: z.string().min(2, "Please select a specialization"),

  hospital: z
    .string()
    .trim()
    .min(2, "Enter the hospital or clinic name")
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

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  name: "",
  specialization: "",
  hospital: "",
  phone: "",
  email: "",
};

interface DoctorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hospitals?: string[];
}

export function DoctorFormDialog({
  open,
  onOpenChange,
  hospitals = [],
}: DoctorFormDialogProps) {
  const { mutate: createDoctor, isPending } = useCreateDoctor();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  const errors = form.formState.errors;

  useEffect(() => {
    if (open) {
      form.reset(EMPTY);
    }
  }, [open, form]);

  const onSubmit = (values: FormValues) => {
    const payload = {
      name: values.name.trim(),
      specialization: values.specialization,
      hospital: values.hospital.trim(),
      phone: values.phone.trim(),
      email: values.email.trim().toLowerCase(),
    };

    createDoctor(payload, {
      onSuccess: () => {
        toast.success("Doctor Created Successfully", {
          description: "The new doctor has been added successfully.",
        });

        form.reset(EMPTY);
        onOpenChange(false);
      },
      onError: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to create doctor. Please try again.";

        toast.error("Doctor Creation Failed", {
          description: message,
        });
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Stethoscope className="size-5" />
          </div>

          <DialogTitle className="text-xl">Add a new doctor</DialogTitle>

          <DialogDescription>
            Create a doctor profile by entering their professional and contact
            information.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Full name */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="doctor-name">Full name</Label>

              <Input
                id="doctor-name"
                placeholder="Dr. Jane Doe"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                {...form.register("name")}
              />

              {errors.name && (
                <p className="text-xs font-medium text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Specialization */}
            <div className="space-y-2">
              <Label htmlFor="doctor-specialization">Specialization</Label>

              <NativeSelect
                id="doctor-specialization"
                aria-invalid={Boolean(errors.specialization)}
                {...form.register("specialization")}
              >
                <option value="">Select specialization</option>

                {specializations.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </NativeSelect>

              {errors.specialization && (
                <p className="text-xs font-medium text-destructive">
                  {errors.specialization.message}
                </p>
              )}
            </div>

            {/* Hospital */}
            <div className="space-y-2">
              <Label htmlFor="doctor-hospital">Hospital / Clinic</Label>

              <Input
                id="doctor-hospital"
                list="hospital-options"
                placeholder="City Medical Center"
                autoComplete="organization"
                aria-invalid={Boolean(errors.hospital)}
                {...form.register("hospital")}
              />

              <datalist id="hospital-options">
                {hospitals.map((hospital) => (
                  <option key={hospital} value={hospital} />
                ))}
              </datalist>

              {errors.hospital && (
                <p className="text-xs font-medium text-destructive">
                  {errors.hospital.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="doctor-phone">Phone number</Label>

              <Input
                id="doctor-phone"
                type="tel"
                placeholder="+880 1712 345678"
                autoComplete="tel"
                aria-invalid={Boolean(errors.phone)}
                {...form.register("phone")}
              />

              {errors.phone && (
                <p className="text-xs font-medium text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="doctor-email">Email address</Label>

              <Input
                id="doctor-email"
                type="email"
                placeholder="jane@example.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...form.register("email")}
              />

              {errors.email && (
                <p className="text-xs font-medium text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}

              {isPending ? "Creating doctor..." : "Create doctor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
