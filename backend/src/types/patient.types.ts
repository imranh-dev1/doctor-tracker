export type PatientGender = "MALE" | "FEMALE" | "OTHER";

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
	page?: string;
	limit?: string;
	search?: string;
	condition?: string;
	doctorId?: string;
}
