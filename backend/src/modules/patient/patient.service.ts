import { ObjectId, type Document, type Filter } from "mongodb";
import httpStatus from "http-status";
import { getDatabase } from "../../lib/db";
import { AppError } from "../../utils/AppError";
import { buildDateRange } from "../../utils/dateRange";
import {
	CreatePatientPayload,
	PatientQuery,
	UpdatePatientPayload,
} from "../../types/patient.types";

const SORTABLE_FIELDS = ["name", "age", "condition", "createdAt"] as const;

type SortableField = (typeof SORTABLE_FIELDS)[number];

const escapeRegex = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizePatient = (payload: CreatePatientPayload | UpdatePatientPayload) => {
	const normalized: Record<string, unknown> = { ...payload };

	if (typeof payload.name === "string") {
		normalized.name = payload.name.trim();
	}

	if (typeof payload.email === "string") {
		normalized.email = payload.email.trim().toLowerCase();
	}

	if (typeof payload.phone === "string") {
		normalized.phone = payload.phone.trim();
	}

	if (typeof payload.condition === "string") {
		normalized.condition = payload.condition.trim();
	}

	return normalized;
};

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

	const data = normalizePatient(payload);

	const existingPatient = await patientsCollection.findOne({
		email: data.email,
	});

	if (existingPatient) {
		throw new AppError(
			httpStatus.CONFLICT,
			"A patient with this email already exists.",
		);
	}

	const now = new Date();

	const patientData = {
		...data,
		doctorId: new ObjectId(doctorId),
		createdAt: now,
		updatedAt: now,
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
			$regex: escapeRegex(query.search.trim()),
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
			$regex: `^${escapeRegex(query.condition.trim())}$`,
			$options: "i",
		};
	}

	if (typeof query.gender === "string" && query.gender.trim()) {
		const gender = query.gender.trim().toUpperCase();

		if (["MALE", "FEMALE", "OTHER"].includes(gender)) {
			filter.gender = gender;
		}
	}

	if (typeof query.doctorId === "string" && query.doctorId.trim()) {
		if (!ObjectId.isValid(query.doctorId)) {
			throw new AppError(httpStatus.BAD_REQUEST, "Invalid doctor ID.");
		}

		filter.doctorId = new ObjectId(query.doctorId);
	}

	const dateRange = buildDateRange(query.fromDate, query.toDate);

	if (dateRange) {
		filter.createdAt = dateRange;
	}

	const sortBy: SortableField = SORTABLE_FIELDS.includes(
		query.sortBy as SortableField,
	)
		? (query.sortBy as SortableField)
		: "createdAt";

	const sortOrder = query.sortOrder === "asc" ? 1 : -1;

	const [result, total] = await Promise.all([
		patientsCollection
			.aggregate([
				{ $match: filter },
				{ $sort: { [sortBy]: sortOrder } },
				{ $skip: skip },
				{ $limit: limit },
				{
					$lookup: {
						from: "doctors",
						localField: "doctorId",
						foreignField: "_id",
						as: "doctor",
					},
				},
				{
					$unwind: {
						path: "$doctor",
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$project: {
						"doctor.email": 0,
						"doctor.phone": 0,
						"doctor.createdAt": 0,
						"doctor.updatedAt": 0,
					},
				},
			])
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
		result,
	};
};

const getPatientById = async (id: string) => {
	const db = getDatabase();
	const patientsCollection = db.collection("patients");

	if (!ObjectId.isValid(id)) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid patient ID.");
	}

	const [patient] = await patientsCollection
		.aggregate([
			{ $match: { _id: new ObjectId(id) } },
			{
				$lookup: {
					from: "doctors",
					localField: "doctorId",
					foreignField: "_id",
					as: "doctor",
				},
			},
			{
				$unwind: {
					path: "$doctor",
					preserveNullAndEmptyArrays: true,
				},
			},
		])
		.toArray();

	if (!patient) {
		throw new AppError(httpStatus.NOT_FOUND, "Patient not found.");
	}

	return patient;
};

const updatePatient = async (id: string, payload: UpdatePatientPayload) => {
	const db = getDatabase();
	const patientsCollection = db.collection("patients");
	const doctorsCollection = db.collection("doctors");

	if (!ObjectId.isValid(id)) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid patient ID.");
	}

	const patient = await patientsCollection.findOne({
		_id: new ObjectId(id),
	});

	if (!patient) {
		throw new AppError(httpStatus.NOT_FOUND, "Patient not found.");
	}

	const data = normalizePatient(payload);

	if (typeof data.doctorId === "string") {
		if (!ObjectId.isValid(data.doctorId)) {
			throw new AppError(httpStatus.BAD_REQUEST, "Invalid doctor ID.");
		}

		const doctor = await doctorsCollection.findOne({
			_id: new ObjectId(data.doctorId),
		});

		if (!doctor) {
			throw new AppError(httpStatus.NOT_FOUND, "Doctor not found.");
		}

		data.doctorId = new ObjectId(data.doctorId);
	}

	if (typeof data.email === "string" && data.email !== patient.email) {
		const emailTaken = await patientsCollection.findOne({
			email: data.email,
			_id: { $ne: new ObjectId(id) },
		});

		if (emailTaken) {
			throw new AppError(
				httpStatus.CONFLICT,
				"A patient with this email already exists.",
			);
		}
	}

	await patientsCollection.updateOne(
		{ _id: new ObjectId(id) },
		{
			$set: {
				...data,
				updatedAt: new Date(),
			},
		},
	);

	return getPatientById(id);
};

const deletePatient = async (id: string) => {
	const db = getDatabase();
	const patientsCollection = db.collection("patients");

	if (!ObjectId.isValid(id)) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid patient ID.");
	}

	const patient = await patientsCollection.findOne({
		_id: new ObjectId(id),
	});

	if (!patient) {
		throw new AppError(httpStatus.NOT_FOUND, "Patient not found.");
	}

	await patientsCollection.deleteOne({
		_id: new ObjectId(id),
	});

	return patient;
};

const getPatientConditions = async () => {
	const db = getDatabase();
	const patientsCollection = db.collection("patients");

	const conditions = await patientsCollection.distinct("condition");

	return conditions
		.filter((condition): condition is string => typeof condition === "string")
		.sort((a, b) => a.localeCompare(b));
};

export const PatientServices = {
	createPatient,
	getPatients,
	getPatientById,
	updatePatient,
	deletePatient,
	getPatientConditions,
};
