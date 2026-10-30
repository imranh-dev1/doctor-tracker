import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
	node_env: process.env.NODE_ENV,
	port: process.env.PORT,
	database_url: process.env.MONGODB_URI!,
	bak_url: process.env.APP_URL,
	frontend_url: process.env.FRONTEND_URL,

	admin_name: process.env.ADMIN_NAME,
	admin_email: process.env.ADMIN_EMAIL,
	admin_pass: process.env.ADMIN_PASSWORD,

	doctor_name: process.env.DOCTOR_NAME,
	doctor_email: process.env.DOCTOR_EMAIL,
	doctor_pass: process.env.DOCTOR_PASSWORD,

	patient_name: process.env.PATIENT_NAME,
	patient_email: process.env.PATIENT_EMAIL,
	patient_pass: process.env.PATIENT_PASSWORD,

	bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

	jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
	jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
	jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN!,
	jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,
};
