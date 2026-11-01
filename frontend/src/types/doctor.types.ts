export type Doctor = {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  patientCount: number;
  createdAt: string;
  updatedAt?: string;
};

export type CreateDoctorPayload = {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
};

export const specializations = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "General Medicine",
  "Gynecology",
  "Neurology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Urology",
] as const;

export interface GetAllDoctorsQuery {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  hospital?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
