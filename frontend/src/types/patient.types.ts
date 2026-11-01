export type PatientGender = "MALE" | "FEMALE" | "OTHER";

export interface PatientDoctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
}

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: PatientGender;
  phone: string;
  email: string;
  condition: string;
  doctorId: string;
  doctor?: PatientDoctor | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientPayload {
  name: string;
  age: number;
  gender: PatientGender;
  phone: string;
  email: string;
  condition: string;
  doctorId: string;
}

export type UpdatePatientPayload = Partial<CreatePatientPayload>;

export interface PatientQuery {
  page?: number;
  limit?: number;
  search?: string;
  condition?: string;
  doctorId?: string;
  gender?: PatientGender;
  fromDate?: string;
  toDate?: string;
  sortBy?: "name" | "age" | "condition" | "createdAt";
  sortOrder?: "asc" | "desc";
}
