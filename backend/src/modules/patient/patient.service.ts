import { ObjectId } from "mongodb";
import { getDatabase } from "../../lib/db";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { CreatePatientPayload } from "../../types/patient.types";

const createPatient = async (payload: CreatePatientPayload) => {
    const db = getDatabase();
    const doctorsCollection = db.collection("doctors");
    const patientsCollection = db.collection("patients");

    const doctorId = payload.doctorId;

    if (!ObjectId.isValid(doctorId)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid doctor ID.");
    }

    const doctor = await doctorsCollection.findOne({
        _id: new ObjectId(doctorId),
    });

    if (!doctor) {
        throw new AppError(httpStatus.NOT_FOUND, "Doctor not found.");
    }

    const existingPatient = await patientsCollection.findOne({
        email: payload.email,
    });

    if (existingPatient) {
        throw new AppError(
            httpStatus.CONFLICT,
            "A patient with this email already exists.",
        );
    }

    const patientData = {
        ...payload,
        doctorId: new ObjectId(doctorId),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await patientsCollection.insertOne(patientData);

    return patientsCollection.findOne({
        _id: result.insertedId,
    });
};

export const PatientServices = {
    createPatient,
};