"use client";

import { Eye, MoreHorizontal, Stethoscope, Trash2, Users } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { DeleteDoctorDialog } from "@/components/dilog/delete-doctor-dialog";
import { DoctorPatientsSheet } from "@/components/dilog/doctor-patients-sheet";
import DataPagination from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { DoctorTableSkeleton } from "@/components/skeleton/doctor-table-skeleton";
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
import { useGetAllDoctors } from "@/hooks";
import { formatDate } from "@/lib/format";
import { type Doctor, type GetAllDoctorsQuery, specializations } from "@/types";

const limit = 10;

function useDoctorFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawSortOrder = searchParams.get("sortOrder");

  const filters: GetAllDoctorsQuery = {
    page: Math.max(1, Number(searchParams.get("page")) || 1),
    limit,
    search: searchParams.get("search") ?? "",
    specialization: searchParams.get("specialization") ?? "",
    fromDate: searchParams.get("fromDate") ?? "",
    toDate: searchParams.get("toDate") ?? "",
    sortBy: searchParams.get("sortBy") ?? "",
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
        <Stethoscope className="size-5 text-muted-foreground" />
      </div>

      <p className="font-medium">{title}</p>

      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>

      {action}
    </div>
  );
}

export function DoctorTable() {
  const { filters, setFilters } = useDoctorFilters();

  const { page, search, specialization, fromDate, toDate, sortBy, sortOrder } =
    filters;

  const [searchInput, setSearchInput] = useState(search ?? "");
  const [patientsDoctor, setPatientsDoctor] = useState<Doctor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null);

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

  const query: GetAllDoctorsQuery = {
    page,
    limit,
    search: search || undefined,
    specialization: specialization || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    sortBy: sortBy || undefined,
    sortOrder,
  };

  const { data, isPending, isError, refetch } = useGetAllDoctors(query);

  const doctors = data?.data.result ?? [];
  const total = data?.data.meta.total ?? 0;
  const totalPages = data?.data.meta.totalPages ?? 1;

  const hasFilters = Boolean(
    search || specialization || fromDate || toDate || sortBy || sortOrder,
  );

  const clearFilters = () => {
    setSearchInput("");

    setFilters({
      search: null,
      specialization: null,
      fromDate: null,
      toDate: null,
      sortBy: null,
      sortOrder: null,
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
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search name, email, phone, specialization, hospital..."
              className="lg:max-w-md"
            />

            <Select
              value={specialization || "all"}
              onValueChange={(value) =>
                setFilters({
                  specialization: value === "all" ? null : value,
                })
              }
            >
              <SelectTrigger className="h-10 w-full lg:w-[200px]">
                <SelectValue placeholder="All specializations" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All specializations</SelectItem>

                {specializations.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortBy || "none"}
              onValueChange={(value) =>
                setFilters({
                  sortBy: value === "none" ? null : value,
                })
              }
            >
              <SelectTrigger className="h-10 w-full lg:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="none">Sorting</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="createdAt">Date added</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
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
                  htmlFor="doctor-from-date"
                  className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Added from
                </label>

                <Input
                  id="doctor-from-date"
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
                  htmlFor="doctor-to-date"
                  className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Added until
                </label>

                <Input
                  id="doctor-to-date"
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
          <DoctorTableSkeleton />
        ) : isError ? (
          <StateMessage
            title="Unable to load doctors"
            description="Something went wrong while fetching the doctor list."
            action={
              <Button variant="outline" onClick={() => refetch()}>
                Try again
              </Button>
            }
          />
        ) : doctors.length === 0 ? (
          <StateMessage
            title="No doctors found"
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
                      Doctor
                    </TableHead>
                    <TableHead className="min-w-[140px]">Phone</TableHead>
                    <TableHead className="min-w-[150px]">
                      Specialization
                    </TableHead>
                    <TableHead className="min-w-[170px]">Hospital</TableHead>
                    <TableHead className="min-w-[110px]">Patients</TableHead>
                    <TableHead className="min-w-[120px]">Date added</TableHead>
                    <TableHead className="w-[70px] pr-4 text-right sm:pr-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor._id}>
                      <TableCell className="pl-4 sm:pl-6">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{doctor.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {doctor.email}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm">{doctor.phone}</TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="whitespace-nowrap"
                        >
                          {doctor.specialization}
                        </Badge>
                      </TableCell>

                      <TableCell className="max-w-[220px] truncate text-sm">
                        {doctor.hospital}
                      </TableCell>

                      <TableCell>
                        <button
                          type="button"
                          onClick={() => setPatientsDoctor(doctor)}
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                        >
                          <Users className="size-3.5" />
                          {doctor.patientCount ?? 0}
                        </button>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(doctor.createdAt)}
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
                              onClick={() => setPatientsDoctor(doctor)}
                            >
                              <Eye className="mr-2 size-4" />
                              View patients
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDeleteTarget(doctor)}
                            >
                              <Trash2 className="mr-2 size-4" />
                              Delete doctor
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
                content="doctors"
                page={page ?? 1}
                totalPages={totalPages}
                total={total}
                limit={limit}
                isPending={isPending}
                onPageChange={(nextPage) => {
                  setFilters({ page: String(nextPage) });
                }}
              />
            </div>
          </>
        )}
      </CardContent>

      <DoctorPatientsSheet
        doctor={patientsDoctor}
        open={Boolean(patientsDoctor)}
        onOpenChange={(open) => {
          if (!open) {
            setPatientsDoctor(null);
          }
        }}
      />

      <DeleteDoctorDialog
        doctorId={deleteTarget?._id ?? null}
        doctorName={deleteTarget?.name}
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
