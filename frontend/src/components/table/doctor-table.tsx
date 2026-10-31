"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Eye, MoreHorizontal, Pencil, Stethoscope, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

import { SearchInput } from "@/components/shared/search-input";
import { useGetAllDoctors } from "@/hooks";
import { specializations, type Doctor, type GetAllDoctorsQuery } from "@/types";

import { DoctorTableSkeleton } from "../skeleton/doctor-table-skeleton";
import DataPagination from "../shared/pagination";

const limit = 10;

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

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
    sortBy: searchParams.get("sortBy") ?? "",
    sortOrder:
      rawSortOrder === "asc" || rawSortOrder === "desc"
        ? rawSortOrder
        : undefined,
  };

  const setFilters = useCallback(
    (updates: Partial<Record<keyof GetAllDoctorsQuery, string | null>>) => {
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

function DoctorActions({ doctor }: { doctor: Doctor }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label={`Actions for ${doctor.name}`}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() => router.push(`/admin/doctors/${doctor._id}`)}
        >
          <Eye className="mr-2 size-4" />
          View details
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => router.push(`/admin/doctors/${doctor._id}/edit`)}
        >
          <Pencil className="mr-2 size-4" />
          Edit doctor
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onSelect={() => console.log("Delete doctor:", doctor._id)}
        >
          <Trash2 className="mr-2 size-4" />
          Delete doctor
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DoctorTable() {
  const { filters, setFilters } = useDoctorFilters();

  const { page, search, specialization, sortBy, sortOrder } = filters;

  const [searchInput, setSearchInput] = useState(search ?? "");

  // Keep search input synchronized with URL.
  useEffect(() => {
    setSearchInput(search ?? "");
  }, [search]);

  // Debounced search.
  useEffect(() => {
    const timer = setTimeout(() => {
      const value = searchInput.trim();

      if (value !== search) {
        setFilters({ search: value || null });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput, search, setFilters]);

  // API query.
  const query: GetAllDoctorsQuery = {
    page,
    limit,
    search: search || undefined,
    specialization: specialization || undefined,
    sortBy: sortBy || undefined,
    sortOrder,
  };

  const { data, isPending, isError, refetch } = useGetAllDoctors(query);

  const doctors = data?.data.result ?? [];
  const total = data?.data.meta.total ?? 0;
  const totalPages = data?.data.meta.totalPages ?? 1;

  const hasFilters = Boolean(search || specialization || sortBy || sortOrder);

  const clearFilters = () => {
    setSearchInput("");

    setFilters({
      search: null,
      specialization: null,
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search name, email, phone, Specialization, Hospital..."
            className="sm:max-w-sm"
          />

          <Select
            value={specialization || "all"}
            onValueChange={(value) =>
              setFilters({
                specialization: value === "all" ? null : value,
              })
            }
          >
            <SelectTrigger className="h-10 w-full sm:w-47.5">
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
            <SelectTrigger className="h-10 w-full sm:w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="none">Sorting</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="createdAt">Date</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort order */}
          <Select
            value={sortOrder ?? "desc"}
            onValueChange={(value) =>
              setFilters({
                sortOrder: value,
              })
            }
          >
            <SelectTrigger className="h-10 w-full sm:w-[130px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>

          {clearButton}
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
                    <TableHead className="min-w-[240px] pl-4 sm:pl-6">
                      Doctor
                    </TableHead>

                    <TableHead className="min-w-[140px]">Phone</TableHead>

                    <TableHead className="min-w-[150px]">
                      Specialization
                    </TableHead>

                    <TableHead className="min-w-[180px]">Hospital</TableHead>

                    <TableHead className="min-w-[120px]">Date added</TableHead>

                    <TableHead className="w-[70px] pr-4 text-right sm:pr-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {doctors.map((doctor: Doctor) => (
                    <TableRow key={doctor._id}>
                      <TableCell className="pl-4 sm:pl-6">
                        <div className="flex items-center gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {doctor.name}
                            </p>

                            <p className="truncate text-xs text-muted-foreground">
                              {doctor.email}
                            </p>
                          </div>
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

                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(doctor.createdAt)}
                      </TableCell>

                      <TableCell className="pr-4 text-right sm:pr-6">
                        <DoctorActions doctor={doctor} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="border-t px-4 py-4">
              <DataPagination
                content="doctors"
                page={page ?? 1}
                totalPages={totalPages}
                total={total}
                limit={limit}
                isPending={isPending}
                onPageChange={(nextPage) => {
                  setFilters({
                    page: String(nextPage),
                  });
                }}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
