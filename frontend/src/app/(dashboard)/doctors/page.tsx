"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DoctorFormDialog } from "@/components/form/doctor-create-form-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { DoctorTable } from "@/components/table/doctor-table";
import { Button } from "@/components/ui/button";

export default function DoctorsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Directory"
        title="Doctors"
        description="Manage specialists, their hospitals and patient assignments across the network."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Add doctor
          </Button>
        }
      />

      <DoctorTable />
      <DoctorFormDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

// export const instant = false;
