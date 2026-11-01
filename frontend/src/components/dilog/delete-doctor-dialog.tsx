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
import { useDeleteDoctor } from "@/hooks";

interface DeleteDoctorDialogProps {
  doctorId: string | null;
  doctorName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteDoctorDialog({
  doctorId,
  doctorName,
  open,
  onOpenChange,
}: DeleteDoctorDialogProps) {
  const { mutate: deleteDoctor, isPending } = useDeleteDoctor();

  const handleDelete = () => {
    if (!doctorId) {
      return;
    }

    deleteDoctor(doctorId, {
      onSuccess: () => {
        toast.success("Doctor deleted successfully.");
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete doctor.",
        );
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete doctor?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {doctorName ?? "this doctor"}
            </span>
            ? Their patient records will also be removed. This action cannot be
            undone.
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
