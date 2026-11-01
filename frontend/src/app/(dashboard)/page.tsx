"use client";

import {
  Activity,
  CalendarPlus,
  RefreshCw,
  Stethoscope,
  Users,
} from "lucide-react";
import Link from "next/link";
import { BarList } from "@/components/charts/bar-list";
import { DonutChart } from "@/components/charts/donut-chart";
import { TrendChart } from "@/components/charts/trend-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardSkeleton } from "@/components/skeleton/dashboard-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetDashboardStats } from "@/hooks";
import {
  formatDate,
  formatNumber,
  formatRelativeDate,
  initials,
} from "@/lib/format";

export default function DashboardPage() {
  const { data, isPending, isError, refetch, isFetching } =
    useGetDashboardStats();

  const stats = data?.data;

  if (isPending) {
    return <DashboardSkeleton />;
  }

  if (isError || !stats) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
        <div className="rounded-full bg-muted p-3">
          <Activity className="size-5 text-muted-foreground" />
        </div>
        <p className="font-medium">Unable to load analytics</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Something went wrong while fetching dashboard statistics.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="size-4" />
          Try again
        </Button>
      </div>
    );
  }

  const { totals } = stats;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Operations dashboard"
        description="A live view of the care network — doctor capacity, patient growth and clinical demand."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={isFetching ? "size-4 animate-spin" : "size-4"}
              />
              Refresh
            </Button>
            <Button render={<Link href="/patients" />}>
              <Users className="size-4" />
              View patients
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total doctors"
          value={formatNumber(totals.doctors)}
          icon={Stethoscope}
          trend={totals.doctorsGrowth}
        />
        <StatCard
          label="Total patients"
          value={formatNumber(totals.patients)}
          icon={Users}
          trend={totals.patientsGrowth}
        />
        <StatCard
          label="Avg. patients / doctor"
          value={totals.averagePatientsPerDoctor}
          icon={Activity}
          hint={`${formatNumber(totals.patients)} patients across ${formatNumber(
            totals.doctors,
          )} doctors`}
        />
        <StatCard
          label="New patients this month"
          value={formatNumber(totals.patientsThisMonth)}
          icon={CalendarPlus}
          hint={`${formatNumber(
            totals.doctorsThisMonth,
          )} new doctors onboarded this month`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Network growth</CardTitle>
            <CardDescription>
              New doctors and patients registered over the last 12 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart data={stats.monthlyTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patients per doctor</CardTitle>
            <CardDescription>
              Doctors carrying the highest patient load.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarList
              items={stats.patientsPerDoctor.map((item) => ({
                label: item.name,
                sublabel: item.specialization,
                value: item.count,
              }))}
              emptyLabel="No patient assignments yet"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patients by condition</CardTitle>
            <CardDescription>
              The most common clinical conditions in the network.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={stats.conditionDistribution}
              centerLabel="Patients"
              emptyLabel="No patient conditions recorded yet"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doctors by specialization</CardTitle>
            <CardDescription>
              How clinical expertise is distributed across the network.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={stats.specializationDistribution}
              centerLabel="Doctors"
              emptyLabel="No doctors registered yet"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Recent patient registrations</CardTitle>
            <CardDescription>
              The latest patients added to the care network.
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            render={<Link href="/patients" />}
          >
            View all
          </Button>
        </CardHeader>

        <CardContent className="px-0">
          {stats.recentPatients.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No patients have been registered yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4 sm:pl-6">Patient</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Assigned doctor</TableHead>
                    <TableHead className="pr-4 text-right sm:pr-6">
                      Registered
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {stats.recentPatients.map((patient) => (
                    <TableRow key={patient._id}>
                      <TableCell className="pl-4 sm:pl-6">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {initials(patient.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {patient.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {patient.age} years · {patient.gender}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary">{patient.condition}</Badge>
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

                      <TableCell
                        className="pr-4 text-right text-sm text-muted-foreground sm:pr-6"
                        title={formatDate(patient.createdAt)}
                      >
                        {formatRelativeDate(patient.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
