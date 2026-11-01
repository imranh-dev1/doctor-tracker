"use client";

import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeletePatient } from "@/hooks";

interface DeletePatientDialogProps {
  patientId: string | null;
  patientName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePatientDialog({
  patientId,
  patientName,
  open,
  onOpenChange,
}: DeletePatientDialogProps) {
  const { mutate: deletePatient, isPending } = useDeletePatient();

  const handleDelete = () => {
    if (!patientId) {
      return;
    }

    deletePatient(patientId, {
      onSuccess: () => {
        toast.success("Patient deleted successfully.");
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete patient.",
        );
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete patient?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {patientName ?? "this patient"}
            </span>
            ? This action cannot be undone and will remove all of their records.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 size-4" />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
