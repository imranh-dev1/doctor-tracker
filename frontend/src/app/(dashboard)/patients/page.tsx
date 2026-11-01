import { CreatePatientDialog } from "@/components/dilog/create-patient-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { PatientTable } from "@/components/table/patient-table";

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          eyebrow="Directory"
          title="Patients"
          description="Monitor patient admission, clinical records, and assigned care teams across network hospitals."
        />
        <CreatePatientDialog />
      </div>
      <PatientTable />
    </div>
  );
}

export const instant = false;
