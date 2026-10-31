import httpStatus from "http-status";
import {
	CreateDoctorPayload,
    GetAllDoctorsQuery, 
} from "../../types/doctor.types";
import { getDatabase } from "../../lib/db";
import { AppError } from "../../utils/AppError";
import { Document as MongoDocument, Filter } from "mongodb";

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

const getAllDoctors = async (query: GetAllDoctorsQuery) => {
	const db = getDatabase();
	const doctors = db.collection("doctors");

	const requestedPage = Number(query.page);
	const requestedLimit = Number(query.limit);

	const page =
		Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

	const limit =
		Number.isInteger(requestedLimit) && requestedLimit > 0
			? Math.min(requestedLimit, 100)
			: 10;

	const skip = (page - 1) * limit;

	const filter: Filter<MongoDocument> = {};

	const search = query.search?.trim();

	if (search) {
		const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

		filter.$or = [
			{ name: { $regex: escapedSearch, $options: "i" } },
			{ email: { $regex: escapedSearch, $options: "i" } },
			{ phone: { $regex: escapedSearch, $options: "i" } },
			{ specialization: { $regex: escapedSearch, $options: "i" } },
			{ hospital: { $regex: escapedSearch, $options: "i" } },
		];
	}

	if (query.specialization?.trim()) {
		filter.specialization = {
			$regex: `^${query.specialization.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
			$options: "i",
		};
	}

	if (query.hospital?.trim()) {
		filter.hospital = {
			$regex: `^${query.hospital.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
			$options: "i",
		};
	}

	const allowedSortFields = [
		"name",
		"email",
		"phone",
		"specialization",
		"hospital",
		"createdAt",
	] as const;

	type SortField = (typeof allowedSortFields)[number];

	const sortBy: SortField = allowedSortFields.includes(
		query.sortBy as SortField,
	)
		? (query.sortBy as SortField)
		: "createdAt";

	const sortOrder = query.sortOrder === "asc" ? 1 : -1;

	const [result, total] = await Promise.all([
		doctors
			.find(filter)
			.sort({ [sortBy]: sortOrder })
			.skip(skip)
			.limit(limit)
			.toArray(),

		doctors.countDocuments(filter),
	]);

	return {
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
		result,
	};
};

export const DoctorServices = {
	createDoctor,
	getAllDoctors,
};
