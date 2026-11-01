import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; 

export function PatientTableSkeleton( ) {
  return (
    <div className="w-full space-y-4">
      {/* Table toolbar skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:max-w-sm" />
        <Skeleton className="h-10 w-full sm:w-36" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Assigned Doctor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 10 }, (_, index) => `patient-skeleton-${index}`).map((rowKey) => (
              <TableRow key={rowKey}>
                {/* Patient */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 shrink-0 rounded-full" />

                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </TableCell>

                {/* Contact */}
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </TableCell>

                {/* Condition */}
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>

                {/* Assigned doctor */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-8 shrink-0 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Skeleton className="size-8 rounded-md" />
                    <Skeleton className="size-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-4 w-40" />

        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="size-9 rounded-md" />
          <Skeleton className="size-9 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
} 