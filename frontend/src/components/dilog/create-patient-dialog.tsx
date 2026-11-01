"use client";

import { Plus } from "lucide-react";
import type { ReactElement } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PatientForm } from "../form/patient-form";

interface CreatePatientDialogProps {
  defaultDoctorId?: string;
  trigger?: ReactElement;
}

export function CreatePatientDialog({
  defaultDoctorId,
  trigger,
}: CreatePatientDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button type="button">
              <Plus className="size-4" />
              Add patient
            </Button>
          )
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Add new patient</DialogTitle>

          <DialogDescription>
            Enter the patient&apos;s information and assign a doctor.
          </DialogDescription>
        </DialogHeader>

        <PatientForm
          defaultDoctorId={defaultDoctorId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
