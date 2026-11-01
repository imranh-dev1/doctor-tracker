import { z } from "zod";

const phoneRegex = /^(\+8801|8801|01)[3-9]\d{8}$/;

const createPatientValidationSchema = z.object({
	name: z
		.string()
		.trim()
		.min(3, "Name must be at least 3 characters")
		.max(100, "Name cannot exceed 100 characters"),

	age: z
		.number()
		.int("Age must be a whole number")
		.min(0, "Age cannot be negative")
		.max(120, "Age cannot exceed 120"),

	gender: z.enum(["MALE", "FEMALE", "OTHER"]),

	phone: z
		.string()
		.trim()
		.regex(phoneRegex, "Enter a valid Bangladeshi phone number"),

	email: z
		.string()
		.trim()
		.email("Enter a valid email address")
		.transform((value) => value.toLowerCase()),

	condition: z
		.string()
		.trim()
		.min(2, "Condition must be at least 2 characters")
		.max(200, "Condition cannot exceed 200 characters"),

	doctorId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid doctor ID"),
});

const updatePatientValidationSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(3, "Name must be at least 3 characters")
			.max(100, "Name cannot exceed 100 characters")
			.optional(),

		age: z
			.number()
			.int("Age must be a whole number")
			.min(0, "Age cannot be negative")
			.max(120, "Age cannot exceed 120")
			.optional(),

		gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),

		phone: z
			.string()
			.trim()
			.regex(phoneRegex, "Enter a valid Bangladeshi phone number")
			.optional(),

		email: z
			.string()
			.trim()
			.email("Enter a valid email address")
			.transform((value) => value.toLowerCase())
			.optional(),

		condition: z
			.string()
			.trim()
			.min(2, "Condition must be at least 2 characters")
			.max(200, "Condition cannot exceed 200 characters")
			.optional(),

		doctorId: z
			.string()
			.regex(/^[a-f\d]{24}$/i, "Invalid doctor ID")
			.optional(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field is required to update a patient",
	});

export const PatientValidation = {
	createPatientValidationSchema,
	updatePatientValidationSchema,
};
