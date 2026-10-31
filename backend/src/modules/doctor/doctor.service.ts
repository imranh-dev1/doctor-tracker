import httpStatus from "http-status"; 
import { CreateDoctorPayload } from "../../types/doctor.types";
import { getDatabase } from "../../lib/db";
import { AppError } from "../../utils/AppError";

const createDoctor = async (payload: CreateDoctorPayload) => {
    const db = getDatabase();
    const doctors = db.collection("doctors"); 
    const name = payload.name.trim();
    const email = payload.email.trim().toLowerCase();
    const phone = payload.phone.trim();

    const isExistDoctor = await doctors.findOne({
        $or: [{ email }, { phone }],
    });

    if (isExistDoctor) {
        throw new AppError(
            httpStatus.CONFLICT,
            "A doctor with this email or phone number already exists.",
        );
    }

    const now = new Date();

    const newDoctor = {
        name,
        email,
        phone,
        specialization: payload.specialization.trim(),
        hospital: payload.hospital.trim(),
        createdAt: now,
        updatedAt: now,
    };

    const result = await doctors.insertOne(newDoctor);

    return result;
};

export const DoctorServices = {
    createDoctor,
};