export type Doctor = {
	_id: string;
	name: string;
	specialization: string;
	hospital: string;
	phone: string;
	email: string;
	createdAt?: string;
	updatedAt?: string;
};

export type CreateDoctorPayload = {
	name: string;
	specialization: string;
	hospital: string;
	phone: string;
	email: string;
};

export interface GetAllDoctorsQuery {
	page?: string;
	limit?: string;
	search?: string;
	specialization?: string;
	hospital?: string;
	fromDate?: string;
	toDate?: string;
	sortBy?: string;
	sortOrder?: string;
}
