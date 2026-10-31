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