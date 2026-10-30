import "dotenv/config";
import bcrypt from "bcryptjs";
import config from "../config";
import { RegisterUser, UserRole, UserStatus } from "../types/user.types";
import { AppError } from "./AppError";
import httpStatus from "http-status"
import { getDatabase } from "../lib/db";

export const seedAdmin = async () => {
    try {

        const db = getDatabase();

        const users = db.collection("users");

        const isExistAdmin = await users.findOne({ role: UserRole.ADMIN })

        if (isExistAdmin) {
            console.log("Admin already exists.");
            return;
        }

        const name = config.admin_name?.trim();
        const email = config.admin_email?.trim().toLowerCase();
        const password = config.admin_pass;

        if (!email || !password || !name) {

            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required in .env",
            );
        }

        const passwordHash = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
        const now = new Date();

        const admin: RegisterUser = {
            name,
            email,
            passwordHash,
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE,
            emailVerified: true,
            createdAt: now,
            updatedAt: now,
        };

        await users.insertOne(admin);

        console.log("Admin account created successfully :", admin);
    } catch (error) {
        console.log("Error Seeding Super Admin : ", error);
    }

};


export const seedDoctor = async () => {
    try {
        const db = getDatabase();
        const users = db.collection("users");

        const isExistDoctor = await users.findOne({
            role: UserRole.DOCTOR,
        });

        if (isExistDoctor) {
            console.log("Doctor already exists.");
            return;
        }

        const name = config.doctor_name?.trim();
        const email = config.doctor_email?.trim().toLowerCase();
        const password = config.doctor_pass;

        if (!email || !password || !name) {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                "DOCTOR_NAME, DOCTOR_EMAIL and DOCTOR_PASSWORD are required in .env",
            );
        }

        const passwordHash = await bcrypt.hash(
            password,
            Number(config.bcrypt_salt_rounds),
        );

        const now = new Date();

        const doctor: RegisterUser = {
            name,
            email,
            passwordHash,
            role: UserRole.DOCTOR,
            status: UserStatus.ACTIVE,
            emailVerified: true,
            createdAt: now,
            updatedAt: now,
        };

        await users.insertOne(doctor);

        console.log("Doctor account created successfully.", seedDoctor);
    } catch (error) {
        console.error("Error seeding doctor:", error);
        throw error;
    }
};


export const seedPatient = async () => {
    try {
        const db = getDatabase();
        const users = db.collection("users");

        const isExistPatient = await users.findOne({
            role: UserRole.PATIENT,
        });

        if (isExistPatient) {
            console.log("Patient already exists.");
            return;
        }

        const name = config.patient_name?.trim();
        const email = config.patient_email?.trim().toLowerCase();
        const password = config.patient_pass;

        if (!email || !password || !name) {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                "PATIENT_NAME, PATIENT_EMAIL and PATIENT_PASSWORD are required in .env",
            );
        }

        const passwordHash = await bcrypt.hash(
            password,
            Number(config.bcrypt_salt_rounds),
        );

        const now = new Date();

        const patient: RegisterUser = {
            name,
            email,
            passwordHash,
            role: UserRole.PATIENT,
            status: UserStatus.ACTIVE,
            emailVerified: true,
            createdAt: now,
            updatedAt: now,
        };

        await users.insertOne(patient);

        console.log("Patient account created successfully.", seedPatient);
    } catch (error) {
        console.error("Error seeding patient:", error);
        throw error;
    }
}; 