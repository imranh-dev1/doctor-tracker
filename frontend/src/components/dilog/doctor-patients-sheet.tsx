"use client";

import {
  Building2,
  Mail,
  Phone,
  Plus,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPatients } from "@/hooks";
import { initials } from "@/lib/format";
import type { Doctor, Patient } from "@/types";
import { CreatePatientDialog } from "./create-patient-dialog";
import { DeletePatientDialog } from "./delete-patient-dialog";

interface DoctorPatientsSheetProps {
  doctor: Doctor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DoctorPatientsContentProps {
  doctor: Doctor;
}

function DoctorPatientsContent({ doctor }: DoctorPatientsContentProps) {
  const { data, isPending } = useGetPatients({
    doctorId: doctor._id,
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null);

  const patients = data?.data.result ?? [];
  const total = data?.data.meta.total ?? 0;

  return (
    <>
      <div className="space-y-4 border-b p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserRound className="size-5" />
          </span>

          <div className="min-w-0">
            <p className="truncate text-base font-semibold">{doctor.name}</p>
            <Badge variant="secondary" className="mt-1">
              {doctor.specialization}
            </Badge>
          </div>
        </div>

        <div className="grid gap-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Building2 className="size-4 shrink-0" />
            <span className="truncate">{doctor.hospital}</span>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="size-4 shrink-0" />
            <span className="truncate">{doctor.phone}</span>
          </p>
          <p className="flex items-center gap-2">
            <Mail className="size-4 shrink-0" />
            <span className="truncate">{doctor.email}</span>
          </p>
        </div>

        <Separator />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Users className="size-4" />
            {total} {total === 1 ? "patient" : "patients"}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              render={
                <Link
                  href={`/patients?doctorId=${doctor._id}`}
                  scroll={false}
                />
              }
            >
              Open in patients
            </Button>

            <CreatePatientDialog
              defaultDoctorId={doctor._id}
              trigger={
                <Button size="sm">
                  <Plus className="size-4" />
                  Add patient
                </Button>
              }
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {isPending ? (
          <div className="space-y-3">
            {["one", "two", "three", "four", "five"].map((row) => (
              <div
                key={`doctor-patient-skeleton-${row}`}
                className="flex items-center gap-3"
              >
                <Skeleton className="size-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="size-7 rounded-md" />
              </div>
            ))}
          </div>
        ) : patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <div className="rounded-full bg-muted p-3">
              <Users className="size-5 text-muted-foreground" />
            </div>
            <p className="font-medium">No patients yet</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Add the first patient for {doctor.name} using the button above.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {patients.map((patient) => (
              <li
                key={patient._id}
                className="flex items-center gap-3 rounded-lg border border-border/70 p-3"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {initials(patient.name)}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{patient.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {patient.age} years · {patient.condition}
                  </p>
                </div>

                <Badge variant="outline" className="hidden sm:inline-flex">
                  {patient.phone}
                </Badge>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:text-destructive"
                  aria-label={`Delete ${patient.name}`}
                  onClick={() => setDeleteTarget(patient)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <DeletePatientDialog
        patientId={deleteTarget?._id ?? null}
        patientName={deleteTarget?.name}
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      />
    </>
  );
}

export function DoctorPatientsSheet({
  doctor,
  open,
  onOpenChange,
}: DoctorPatientsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="sr-only">
          <SheetTitle>{doctor?.name ?? "Doctor"} patients</SheetTitle>
          <SheetDescription>Patients assigned to this doctor.</SheetDescription>
        </SheetHeader>

        {doctor && <DoctorPatientsContent doctor={doctor} />}
      </SheetContent>
    </Sheet>
  );
}
