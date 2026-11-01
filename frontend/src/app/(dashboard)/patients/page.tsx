import { CreatePatientDialog } from "@/components/dilog/create-patient-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { PatientTable } from "@/components/table/patient-table";

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Directory"
        title="Patients"
        description="Monitor patient admissions, clinical records, and assigned care teams across network hospitals."
        actions={<CreatePatientDialog />}
      />

      <PatientTable />
    </div>
  );
}

export const instant = false;
