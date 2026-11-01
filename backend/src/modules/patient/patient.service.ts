import { ObjectId, type Document, type Filter } from "mongodb";
import { getDatabase } from "../../lib/db";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { CreatePatientPayload, PatientQuery } from "../../types/patient.types";

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

const getPatients = async (query: PatientQuery) => {
    const db = getDatabase();
    const patientsCollection = db.collection("patients");

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter: Filter<Document> = {};

    if (typeof query.search === "string" && query.search.trim()) {
        const searchRegex = {
            $regex: query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            $options: "i",
        };

        filter.$or = [
            { name: searchRegex },
            { email: searchRegex },
            { phone: searchRegex },
            { condition: searchRegex },
        ];
    }

    if (typeof query.condition === "string" && query.condition.trim()) {
        filter.condition = {
            $regex: query.condition.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            $options: "i",
        };
    }

    if (typeof query.doctorId === "string" && query.doctorId.trim()) {
        if (!ObjectId.isValid(query.doctorId)) {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid doctor ID.");
        }

        filter.doctorId = new ObjectId(query.doctorId);
    }

    const [patients, total] = await Promise.all([
        patientsCollection
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray(),

        patientsCollection.countDocuments(filter),
    ]);

    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data: patients,
    };
};

export const PatientServices = {
    createPatient,
    getPatients
};
