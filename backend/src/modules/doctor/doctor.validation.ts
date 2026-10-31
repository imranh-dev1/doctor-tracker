import { z } from "zod";

const createDoctorSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(120, "Name cannot exceed 120 characters"),

    specialization: z
        .string()
        .trim()
        .min(2, "Specialization is required"),

    hospital: z
        .string()
        .trim()
        .min(2, "Hospital name must be at least 2 characters")
        .max(160, "Hospital name cannot exceed 160 characters"),

    phone: z
        .string()
        .trim()
        .regex(
            /^(?:\+8801[3-9]\d{8}|8801[3-9]\d{8}|01[3-9]\d{8})$/,
            "Enter a valid Bangladeshi phone number",
        ),

    email: z
        .email("Please enter a valid email address")
        .trim()
        .toLowerCase(),
});

export const DoctorValidation = {
    createDoctorSchema
}