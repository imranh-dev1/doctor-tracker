"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { DoctorFormDialog } from "@/components/doctors/doctor-create-form-dialog";
import { Plus } from "lucide-react";

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

      <DoctorFormDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

// export const instant = false;
