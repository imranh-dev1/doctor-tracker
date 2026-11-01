import { getDatabase } from "../../lib/db";

const MONTHS_TO_SHOW = 12;

const growth = (current: number, previous: number) => {
	if (previous === 0) {
		return current === 0 ? 0 : 100;
	}

	return Math.round(((current - previous) / previous) * 1000) / 10;
};

const monthKey = (date: Date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const monthLabel = (date: Date) =>
	new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);

const getDashboardStats = async () => {
	const db = getDatabase();
	const doctors = db.collection("doctors");
	const patients = db.collection("patients");

	const now = new Date();

	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
	const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
	const trendStart = new Date(
		now.getFullYear(),
		now.getMonth() - (MONTHS_TO_SHOW - 1),
		1,
	);

	const [
		totalDoctors,
		totalPatients,
		doctorsThisMonth,
		patientsThisMonth,
		doctorsLastMonth,
		patientsLastMonth,
		patientTrendRows,
		doctorTrendRows,
		patientsPerDoctor,
		conditionDistribution,
		specializationDistribution,
		genderDistribution,
		recentPatients,
	] = await Promise.all([
		doctors.countDocuments(),
		patients.countDocuments(),
		doctors.countDocuments({ createdAt: { $gte: startOfMonth } }),
		patients.countDocuments({ createdAt: { $gte: startOfMonth } }),
		doctors.countDocuments({
			createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
		}),
		patients.countDocuments({
			createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
		}),

		patients
			.aggregate<{ _id: string; count: number }>([
				{ $match: { createdAt: { $gte: trendStart } } },
				{
					$group: {
						_id: {
							$dateToString: {
								format: "%Y-%m",
								date: "$createdAt",
							},
						},
						count: { $sum: 1 },
					},
				},
			])
			.toArray(),

		doctors
			.aggregate<{ _id: string; count: number }>([
				{ $match: { createdAt: { $gte: trendStart } } },
				{
					$group: {
						_id: {
							$dateToString: {
								format: "%Y-%m",
								date: "$createdAt",
							},
						},
						count: { $sum: 1 },
					},
				},
			])
			.toArray(),

		patients
			.aggregate<{
				_id: unknown;
				count: number;
				name: string;
				specialization: string | null;
			}>([
				{ $group: { _id: "$doctorId", count: { $sum: 1 } } },
				{ $sort: { count: -1 } },
				{ $limit: 7 },
				{
					$lookup: {
						from: "doctors",
						localField: "_id",
						foreignField: "_id",
						as: "doctor",
					},
				},
				{ $unwind: { path: "$doctor", preserveNullAndEmptyArrays: true } },
				{
					$project: {
						_id: 0,
						name: { $ifNull: ["$doctor.name", "Unassigned"] },
						specialization: { $ifNull: ["$doctor.specialization", null] },
						count: 1,
					},
				},
			])
			.toArray(),

		patients
			.aggregate<{ _id: string; count: number }>([
				{ $group: { _id: "$condition", count: { $sum: 1 } } },
				{ $sort: { count: -1 } },
				{ $limit: 8 },
			])
			.toArray(),

		doctors
			.aggregate<{ _id: string; count: number }>([
				{ $group: { _id: "$specialization", count: { $sum: 1 } } },
				{ $sort: { count: -1 } },
				{ $limit: 8 },
			])
			.toArray(),

		patients
			.aggregate<{ _id: string; count: number }>([
				{ $group: { _id: "$gender", count: { $sum: 1 } } },
				{ $sort: { count: -1 } },
			])
			.toArray(),

		patients
			.aggregate([
				{ $sort: { createdAt: -1 } },
				{ $limit: 5 },
				{
					$lookup: {
						from: "doctors",
						localField: "doctorId",
						foreignField: "_id",
						as: "doctor",
					},
				},
				{ $unwind: { path: "$doctor", preserveNullAndEmptyArrays: true } },
				{
					$project: {
						name: 1,
						condition: 1,
						gender: 1,
						age: 1,
						createdAt: 1,
						"doctor.name": 1,
						"doctor.specialization": 1,
					},
				},
			])
			.toArray(),
	]);

	const patientTrendMap = new Map(
		patientTrendRows.map((row) => [row._id, row.count]),
	);

	const doctorTrendMap = new Map(
		doctorTrendRows.map((row) => [row._id, row.count]),
	);

	const monthlyTrend = Array.from({ length: MONTHS_TO_SHOW }, (_, index) => {
		const date = new Date(
			now.getFullYear(),
			now.getMonth() - (MONTHS_TO_SHOW - 1 - index),
			1,
		);
		const key = monthKey(date);

		return {
			month: key,
			label: monthLabel(date),
			patients: patientTrendMap.get(key) ?? 0,
			doctors: doctorTrendMap.get(key) ?? 0,
		};
	});

	const patientsPerDoctorChart = patientsPerDoctor.map((row) => ({
		name: row.name,
		specialization: row.specialization,
		count: row.count,
	}));

	const conditions = conditionDistribution.map((row) => ({
		label: row._id || "Unknown",
		value: row.count,
	}));

	const specializations = specializationDistribution.map((row) => ({
		label: row._id || "Unknown",
		value: row.count,
	}));

	const genders = genderDistribution.map((row) => ({
		label: row._id || "Unknown",
		value: row.count,
	}));

	return {
		totals: {
			doctors: totalDoctors,
			patients: totalPatients,
			averagePatientsPerDoctor:
				totalDoctors === 0
					? 0
					: Math.round((totalPatients / totalDoctors) * 10) / 10,
			doctorsThisMonth,
			patientsThisMonth,
			doctorsGrowth: growth(doctorsThisMonth, doctorsLastMonth),
			patientsGrowth: growth(patientsThisMonth, patientsLastMonth),
		},
		monthlyTrend,
		patientsPerDoctor: patientsPerDoctorChart,
		conditionDistribution: conditions,
		specializationDistribution: specializations,
		genderDistribution: genders,
		recentPatients,
	};
};

export const DashboardServices = {
	getDashboardStats,
};
