"use client";

import { MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { DeletePatientDialog } from "@/components/dilog/delete-patient-dialog";
import { EditPatientDialog } from "@/components/dilog/edit-patient-dialog";
import DataPagination from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { PatientTableSkeleton } from "@/components/skeleton/patient-table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetPatientConditions, useGetPatients } from "@/hooks";
import { formatDate, initials } from "@/lib/format";
import type { Patient, PatientQuery } from "@/types";

const limit = 10;

const GENDERS = ["MALE", "FEMALE", "OTHER"] as const;

function usePatientFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawSortOrder = searchParams.get("sortOrder");
  const rawSortBy = searchParams.get("sortBy");
  const rawGender = searchParams.get("gender");

  const filters: PatientQuery = {
    page: Math.max(1, Number(searchParams.get("page")) || 1),
    limit,
    search: searchParams.get("search") ?? "",
    condition: searchParams.get("condition") ?? "",
    doctorId: searchParams.get("doctorId") ?? "",
    gender: GENDERS.includes(rawGender as (typeof GENDERS)[number])
      ? (rawGender as PatientQuery["gender"])
      : undefined,
    fromDate: searchParams.get("fromDate") ?? "",
    toDate: searchParams.get("toDate") ?? "",
    sortBy: ["name", "age", "condition", "createdAt"].includes(rawSortBy ?? "")
      ? (rawSortBy as PatientQuery["sortBy"])
      : undefined,
    sortOrder:
      rawSortOrder === "asc" || rawSortOrder === "desc"
        ? rawSortOrder
        : undefined,
  };

  const setFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!("page" in updates)) {
        params.delete("page");
      }

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      const query = params.toString();

      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  return { filters, setFilters };
}

function StateMessage({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-16 text-center">
      <div className="rounded-full bg-muted p-3">
        <Users className="size-5 text-muted-foreground" />
      </div>

      <p className="font-medium">{title}</p>

      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>

      {action}
    </div>
  );
}

export function PatientTable() {
  const { filters, setFilters } = usePatientFilters();

  const {
    page,
    search,
    condition,
    gender,
    fromDate,
    toDate,
    sortBy,
    sortOrder,
    doctorId,
  } = filters;

  const [searchInput, setSearchInput] = useState(search ?? "");
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null);

  const { data: conditionsResponse } = useGetPatientConditions();

  useEffect(() => {
    setSearchInput(search ?? "");
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = searchInput.trim();

      if (value !== search) {
        setFilters({ search: value || null });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput, search, setFilters]);

  const query: PatientQuery = {
    page,
    limit,
    search: search || undefined,
    condition: condition || undefined,
    gender,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    sortBy,
    sortOrder,
    doctorId: doctorId || undefined,
  };

  const { data, isPending, isError, refetch } = useGetPatients(query);

  const patients = data?.data.result ?? [];
  const meta = data?.data.meta;
  const conditions = conditionsResponse?.data ?? [];

  const hasFilters = Boolean(
    search || condition || gender || fromDate || toDate || sortBy || doctorId,
  );

  const clearFilters = () => {
    setSearchInput("");

    setFilters({
      search: null,
      condition: null,
      gender: null,
      fromDate: null,
      toDate: null,
      sortBy: null,
      sortOrder: null,
      doctorId: null,
    });
  };

  const clearButton = hasFilters ? (
    <Button variant="outline" size="sm" onClick={clearFilters}>
      Clear filters
    </Button>
  ) : null;

  return (
    <Card className="overflow-hidden border-border/70 shadow-sm">
      <CardHeader className="gap-4 border-b bg-muted/20 px-4 py-5 sm:px-6">
        {doctorId && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm">
            <span className="text-muted-foreground">
              Showing patients assigned to the selected doctor.
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ doctorId: null })}
            >
              Show all patients
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search name, email, phone or condition..."
              className="lg:max-w-sm"
            />

            <Select
              value={condition || "all"}
              onValueChange={(value) =>
                setFilters({
                  condition: value === "all" ? null : value,
                })
              }
            >
              <SelectTrigger className="h-10 w-full lg:w-[190px]">
                <SelectValue placeholder="All conditions" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All conditions</SelectItem>

                {conditions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={gender ?? "all"}
              onValueChange={(value) =>
                setFilters({ gender: value === "all" ? null : value })
              }
            >
              <SelectTrigger className="h-10 w-full lg:w-[150px]">
                <SelectValue placeholder="All genders" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All genders</SelectItem>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy ?? "none"}
              onValueChange={(value) =>
                setFilters({ sortBy: value === "none" ? null : value })
              }
            >
              <SelectTrigger className="h-10 w-full lg:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="none">Sorting</SelectItem>
                <SelectItem value="createdAt">Date added</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="age">Age</SelectItem>
                <SelectItem value="condition">Condition</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortOrder ?? "desc"}
              onValueChange={(value) => setFilters({ sortOrder: value })}
            >
              <SelectTrigger className="h-10 w-full lg:w-[130px]">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="patient-from-date"
                  className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Registered from
                </label>

                <Input
                  id="patient-from-date"
                  type="date"
                  value={fromDate ?? ""}
                  max={toDate || undefined}
                  onChange={(event) =>
                    setFilters({ fromDate: event.target.value || null })
                  }
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="patient-to-date"
                  className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Registered until
                </label>

                <Input
                  id="patient-to-date"
                  type="date"
                  value={toDate ?? ""}
                  min={fromDate || undefined}
                  onChange={(event) =>
                    setFilters({ toDate: event.target.value || null })
                  }
                  className="h-9"
                />
              </div>
            </div>

            {clearButton && <div className="sm:pb-1">{clearButton}</div>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isPending ? (
          <PatientTableSkeleton />
        ) : isError ? (
          <StateMessage
            title="Unable to load patients"
            description="Something went wrong while fetching the patient list."
            action={
              <Button variant="outline" onClick={() => refetch()}>
                Try again
              </Button>
            }
          />
        ) : patients.length === 0 ? (
          <StateMessage
            title="No patients found"
            description="Try changing your search or filters."
            action={clearButton}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="min-w-[220px] pl-4 sm:pl-6">
                      Patient
                    </TableHead>
                    <TableHead className="min-w-[190px]">Contact</TableHead>
                    <TableHead className="min-w-[140px]">Condition</TableHead>
                    <TableHead className="min-w-[180px]">
                      Assigned doctor
                    </TableHead>
                    <TableHead className="min-w-[120px]">Registered</TableHead>
                    <TableHead className="w-[70px] pr-4 text-right sm:pr-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient._id}>
                      <TableCell className="pl-4 sm:pl-6">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {initials(patient.name)}
                          </span>

                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {patient.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {patient.age} years · {patient.gender}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="min-w-0 space-y-0.5">
                          <p className="truncate text-sm">{patient.phone}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {patient.email}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="whitespace-nowrap"
                        >
                          {patient.condition}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="min-w-0">
                          <p className="truncate text-sm">
                            {patient.doctor?.name ?? "Unassigned"}
                          </p>
                          {patient.doctor?.specialization && (
                            <p className="truncate text-xs text-muted-foreground">
                              {patient.doctor.specialization}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(patient.createdAt)}
                      </TableCell>

                      <TableCell className="pr-4 text-right sm:pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Open actions</span>
                              </Button>
                            }
                          />

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setEditPatient(patient)}
                            >
                              <Pencil className="mr-2 size-4" />
                              Edit patient
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDeleteTarget(patient)}
                            >
                              <Trash2 className="mr-2 size-4" />
                              Delete patient
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="border-t px-4 py-4">
              <DataPagination
                content="patients"
                page={page ?? 1}
                totalPages={meta?.totalPages ?? 1}
                total={meta?.total ?? 0}
                limit={limit}
                isPending={isPending}
                onPageChange={(nextPage) =>
                  setFilters({ page: String(nextPage) })
                }
              />
            </div>
          </>
        )}
      </CardContent>

      <EditPatientDialog
        patient={editPatient}
        open={Boolean(editPatient)}
        onOpenChange={(open) => {
          if (!open) {
            setEditPatient(null);
          }
        }}
      />

      <DeletePatientDialog
        patientId={deleteTarget?._id ?? null}
        patientName={deleteTarget?.name}
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      />
    </Card>
  );
}
