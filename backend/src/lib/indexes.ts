import { getDatabase } from "./db";

type IndexDefinition = {
	collection: string;
	keys: Record<string, 1 | -1>;
	options?: Record<string, unknown>;
	name: string;
};

const INDEXES: IndexDefinition[] = [
	{
		collection: "users",
		keys: { email: 1 },
		options: { unique: true },
		name: "users_email_unique",
	},
	{
		collection: "doctors",
		keys: { email: 1 },
		options: { unique: true },
		name: "doctors_email_unique",
	},
	{
		collection: "doctors",
		keys: { phone: 1 },
		options: { unique: true },
		name: "doctors_phone_unique",
	},
	{
		collection: "doctors",
		keys: { name: 1 },
		name: "doctors_name",
	},
	{
		collection: "doctors",
		keys: { specialization: 1 },
		name: "doctors_specialization",
	},
	{
		collection: "doctors",
		keys: { hospital: 1 },
		name: "doctors_hospital",
	},
	{
		collection: "doctors",
		keys: { createdAt: -1 },
		name: "doctors_created_at",
	},
	{
		collection: "patients",
		keys: { email: 1 },
		options: { unique: true },
		name: "patients_email_unique",
	},
	{
		collection: "patients",
		keys: { doctorId: 1, createdAt: -1 },
		name: "patients_doctor_created_at",
	},
	{
		collection: "patients",
		keys: { condition: 1 },
		name: "patients_condition",
	},
	{
		collection: "patients",
		keys: { name: 1 },
		name: "patients_name",
	},
	{
		collection: "patients",
		keys: { createdAt: -1 },
		name: "patients_created_at",
	},
];

export const ensureIndexes = async () => {
	const db = getDatabase();

	for (const index of INDEXES) {
		try {
			await db
				.collection(index.collection)
				.createIndex(index.keys, { ...index.options, name: index.name });
		} catch (error) {
			console.warn(
				`Could not create index "${index.name}" on "${index.collection}":`,
				error instanceof Error ? error.message : error,
			);
		}
	}

	console.log("MongoDB indexes are ready.");
};
