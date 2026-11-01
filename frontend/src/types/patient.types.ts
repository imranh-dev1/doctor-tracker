export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  phone: string;
  email: string;
  condition: string;
  doctorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientPayload {
  name: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER";
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
}

export interface PatientListResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Patient[];
}
