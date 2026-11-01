// "use client";

// import { useQueryClient } from "@tanstack/react-query";
// import { Pencil } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// export function UpdateDoctorDialog( doctorId: string) {
//   const [open, setOpen] = useState(false);

//   const queryClient = useQueryClient();

//   const { mutate: updateDoctor, isPending } = useUpdateDoctor();

//   const handleSubmit = (values: UpdateDoctorFormValues) => {
//     updateDoctor(
//       {
//         id: doctor._id,
//         payload: values,
//       },
//       {
//         onSuccess: () => {
//           queryClient.invalidateQueries({
//             queryKey: ["doctors"],
//           });

//           toast.success("Doctor updated successfully.");

//           setOpen(false);
//         },

//         onError: (error) => {
//           toast.error(
//             error instanceof Error
//               ? error.message
//               : "Failed to update doctor.",
//           );
//         },
//       },
//     );
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           type="button"
//           variant="outline"
//           size="sm"
//         >
//           <Pencil className="size-4" />
//           Edit
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-[600px]">
//         <DialogHeader>
//           <DialogTitle>Update doctor</DialogTitle>

//           <DialogDescription>
//             Update the information for {doctor.name}.
//           </DialogDescription>
//         </DialogHeader>

//         <UpdateDoctorForm
//           doctor={doctor}
//           onSubmit={handleSubmit}
//           isPending={isPending}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// }
