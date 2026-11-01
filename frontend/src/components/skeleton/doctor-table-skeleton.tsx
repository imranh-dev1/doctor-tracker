import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DoctorTableSkeleton() {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {[
              "Doctor",
              "Email",
              "Phone",
              "Specialization",
              "Hospital",
              "Date added",
              "Actions",
            ].map((heading) => (
              <TableHead key={heading}>{heading}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {[
            "row-1",
            "row-2",
            "row-3",
            "row-4",
            "row-5",
            "row-6",
            "row-7",
            "row-8",
            "row-9",
            "row-10",
          ].map((rowKey) => (
            <TableRow key={rowKey}>
              {[
                { key: "doctor", className: "h-10 w-36" },
                { key: "email", className: "h-4 w-28" },
                { key: "phone", className: "h-4 w-28" },
                { key: "specialization", className: "h-4 w-28" },
                { key: "hospital", className: "h-4 w-28" },
                { key: "date-added", className: "h-4 w-28" },
                { key: "actions", className: "ml-auto size-8 rounded-md" },
              ].map(({ key, className }) => (
                <TableCell key={key}>
                  <Skeleton className={className} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
