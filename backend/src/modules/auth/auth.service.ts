import bcrypt from "bcryptjs";
import { getDatabase } from "../../lib/db";
import {
	type LoginPayload,
	type RegisterPayload,
	type RegisterUser,
	User,
	UserRole,
	UserStatus,
} from "../../types/user.types";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import type { SignOptions } from "jsonwebtoken";
import { ObjectId } from "mongodb";

const toSafeUser = (user: User) => {
	const { password, ...safeUser } = user;
	delete (safeUser as { passwordHash?: string }).passwordHash;

	return safeUser;
};

const register = async (payload: RegisterPayload) => {
	const db = getDatabase();
	const users = db.collection("users");

	const name = payload.name.trim();
	const email = payload.email.trim().toLowerCase();

	const isExistUser = await users.findOne({ email });

	if (isExistUser) {
		throw new AppError(
			httpStatus.CONFLICT,
			"An account with this email already exists.",
		);
	}

	const passwordHash = await bcrypt.hash(
		payload.password,
		Number(config.bcrypt_salt_rounds),
	);

	const now = new Date();

	const newUser: RegisterUser = {
		name,
		email,
		password: passwordHash,
		role: UserRole.PATIENT,
		status: UserStatus.ACTIVE,
		emailVerified: true,
		createdAt: now,
		updatedAt: now,
	};

	const result = await users.insertOne(newUser);

	return result;
};

const login = async (payload: LoginPayload) => {
	const db = getDatabase();
	const users = db.collection("users");

	const user = await users.findOne({
		email: payload.email,
	});

	if (!user) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"Invalid email or password.",
		);
	}

	if (user.status === UserStatus.BLOCKED) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Your account has been blocked. Please contact support.",
		);
	}

	const storedPassword =
		user.password ?? (user as { passwordHash?: string }).passwordHash;

	if (!storedPassword) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"Invalid email or password.",
		);
	}

	const isPasswordMatched = await bcrypt.compare(
		payload.password,
		storedPassword,
	);

	if (!isPasswordMatched) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"Invalid email or password.",
		);
	}

	const jwtPayload = {
		userId: user._id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		user: toSafeUser(user as User),
		accessToken,
		refreshToken,
	};
};

const getMe = async (userId: string) => {
	if (!ObjectId.isValid(userId)) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID.");
	}

	const db = getDatabase();
	const users = db.collection("users");

	const user = await users.findOne({
		_id: new ObjectId(userId),
	});

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found.");
	}

	return toSafeUser(user as User);
};

export const AuthServices = {
	register,
	login,
	getMe,
};
