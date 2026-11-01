import httpStatus from "http-status";
import { Document, Filter, ObjectId } from "mongodb";
import { getDatabase } from "../../lib/db";
import { AppError } from "../../utils/AppError";
import { buildDateRange } from "../../utils/dateRange";
import {
	CreateDoctorPayload,
	GetAllDoctorsQuery,
} from "../../types/doctor.types";

const escapeRegex = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getPatientCounts = async (doctorIds: ObjectId[]) => {
	if (doctorIds.length === 0) {
		return new Map<string, number>();
	}

	const db = getDatabase();
	const patients = db.collection("patients");

	const rows = await patients
		.aggregate<{ _id: ObjectId; count: number }>([
			{ $match: { doctorId: { $in: doctorIds } } },
			{ $group: { _id: "$doctorId", count: { $sum: 1 } } },
		])
		.toArray();

	return new Map(rows.map((row) => [String(row._id), row.count]));
};

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

	return {
		...newDoctor,
		_id: result.insertedId,
		patientCount: 0,
	};
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

	const filter: Filter<Document> = {};

	const search = query.search?.trim();

	if (search) {
		const escapedSearch = escapeRegex(search);

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
			$regex: `^${escapeRegex(query.specialization.trim())}$`,
			$options: "i",
		};
	}

	if (query.hospital?.trim()) {
		filter.hospital = {
			$regex: `^${escapeRegex(query.hospital.trim())}$`,
			$options: "i",
		};
	}

	const dateRange = buildDateRange(query.fromDate, query.toDate);

	if (dateRange) {
		filter.createdAt = dateRange;
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

	const counts = await getPatientCounts(
		result.map((doctor) => doctor._id as ObjectId),
	);

	return {
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
		result: result.map((doctor) => ({
			...doctor,
			patientCount: counts.get(String(doctor._id)) ?? 0,
		})),
	};
};

const deleteDoctor = async (id: string) => {
	const db = getDatabase();
	const doctors = db.collection("doctors");
	const patients = db.collection("patients");

	if (!ObjectId.isValid(id)) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid doctor ID");
	}

	const doctor = await doctors.findOne({
		_id: new ObjectId(id),
	});

	if (!doctor) {
		throw new AppError(httpStatus.NOT_FOUND, "Doctor not found");
	}

	await doctors.deleteOne({
		_id: new ObjectId(id),
	});

	await patients.deleteMany({
		doctorId: new ObjectId(id),
	});

	return doctor;
};

export const DoctorServices = {
	createDoctor,
	getAllDoctors,
	deleteDoctor,
};
