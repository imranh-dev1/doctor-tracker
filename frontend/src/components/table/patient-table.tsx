"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Search,
  Eye,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PatientQuery } from "@/types/patient.types";
import { useGetPatients } from "@/hooks";
import { PatientTableSkeleton } from "../skeleton/patient-table-skeleton";

export function PatientTable() {
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("all");
  const [page, setPage] = useState(1);

  const limit = 10;

  const query: PatientQuery = {
    page,
    limit,
    ...(search && { search }),
    ...(condition !== "all" && { condition }),
  };

  const { data, isPending, isError } = useGetPatients(query);

  const patients = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  console.log(patients);
  

  return (
    <div className="space-y-5">
      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search patients..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>

        <Select
          value={condition}
          onValueChange={(value) => {
            setCondition(value ?? "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by condition" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All conditions</SelectItem>
            <SelectItem value="Diabetes">Diabetes</SelectItem>
            <SelectItem value="Hypertension">Hypertension</SelectItem>
            <SelectItem value="Asthma">Asthma</SelectItem>
            <SelectItem value="Routine checkup">Routine checkup</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-hidden border">
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
            {isPending ? (
              <PatientTableSkeleton />
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  Failed to load patients. Please try again.
                </TableCell>
              </TableRow>
            ) : patients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  No patients found.
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient: any) => (
                <TableRow key={patient._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        {patient.name
                          .split(" ")
                          .map((part: string) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {patient.age} years · {patient.gender}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{patient.phone}</p>
                      <p className="text-xs text-muted-foreground">
                        {patient.email}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">{patient.condition}</Badge>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm">
                      {patient.doctor?.name ?? "Unassigned"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        patient.status === "ACTIVE" ? "default" : "destructive"
                      }
                    >
                      {patient.status ?? "ACTIVE"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger >
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Open actions</span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            // Navigate to patient details page.
                            window.location.href = `/admin/patients/${patient._id}`;
                          }}
                        >
                          <Eye className="mr-2 size-4" />
                          View details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            // Connect your edit dialog here.
                            window.location.href = `/admin/patients/${patient._id}/edit`;
                          }}
                        >
                          <Pencil className="mr-2 size-4" />
                          Edit patient
                        </DropdownMenuItem>

                        {/* <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          disabled={deleteMutation.isPending}
                          onClick={() => handleDelete(patient._id)}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete patient
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {patients.length} of {meta?.total ?? patients.length} patients
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isPending}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </Button>

          <span className="text-sm">
            Page {page}
            {meta?.totalPages ? ` of ${meta.totalPages}` : ""}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={
              isPending ||
              (meta?.totalPages
                ? page >= meta.totalPages
                : patients.length < limit)
            }
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
