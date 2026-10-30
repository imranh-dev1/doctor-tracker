import "dotenv/config";
import bcrypt from "bcryptjs";
import config from "../config";
import { type RegisterUser, UserRole, UserStatus } from "../types/user.types";
import { AppError } from "./AppError";
import httpStatus from "http-status";
import { getDatabase } from "../lib/db";

export const seedAdmin = async () => {
	try {
		const db = getDatabase();

		const users = db.collection("users");

		const isExistAdmin = await users.findOne({ role: UserRole.ADMIN });

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

		const passwordHash = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);
		const now = new Date();

		const admin: RegisterUser = {
			name,
			email,
			password: passwordHash,
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
