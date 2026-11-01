export interface DashboardTotals {
  doctors: number;
  patients: number;
  averagePatientsPerDoctor: number;
  doctorsThisMonth: number;
  patientsThisMonth: number;
  doctorsGrowth: number;
  patientsGrowth: number;
}

export interface MonthlyTrendPoint {
  month: string;
  label: string;
  patients: number;
  doctors: number;
}

export interface PatientsPerDoctorPoint {
  name: string;
  specialization: string | null;
  count: number;
}

export interface DistributionPoint {
  label: string;
  value: number;
}

export interface RecentPatient {
  _id: string;
  name: string;
  condition: string;
  gender: string;
  age: number;
  createdAt: string;
  doctor?: {
    name?: string;
    specialization?: string;
  };
}

export interface DashboardStats {
  totals: DashboardTotals;
  monthlyTrend: MonthlyTrendPoint[];
  patientsPerDoctor: PatientsPerDoctorPoint[];
  conditionDistribution: DistributionPoint[];
  specializationDistribution: DistributionPoint[];
  genderDistribution: DistributionPoint[];
  recentPatients: RecentPatient[];
}
