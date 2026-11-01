"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreatePatientForm } from "../form/create-patient-form";

export function CreatePatientDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button type="button">
          <Plus className="size-4" />
          Add patient
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Add new patient</DialogTitle>

          <DialogDescription>
            Enter the patient's information and assign a doctor.
          </DialogDescription>
        </DialogHeader>

        {CreatePatientForm(setOpen)}
      </DialogContent>
    </Dialog>
  );
}
