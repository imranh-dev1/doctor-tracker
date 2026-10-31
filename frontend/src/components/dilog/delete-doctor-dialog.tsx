"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

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
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteDoctor } from "@/hooks";
import { toast } from "sonner";

interface DeleteDoctorDialogProps {
  doctorId: string;
  doctorName: string;
}

export function DeleteDoctorDialog({
  doctorId,
  doctorName,
}: DeleteDoctorDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: deleteDoctor, isPending } = useDeleteDoctor();

  const handleDelete = () => {
    deleteDoctor(doctorId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["doctors"],
        });
        setOpen(false);

        toast.success("Doctor deleted successfully.");
      },

      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete doctor.",
        );
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-destructive hover:text-destructive"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="mr-2 size-4" />
        Delete
      </Button>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete doctor?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{doctorName}</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
