import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import config from "./config";
import { AuthRoutes } from "./modules/auth/auth.routes";
import { notFound } from "./middlewares/not-found";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

const app = express();

app.use(
	cors({
		origin: config.frontend_url ?? "http://localhost:3000",
		credentials: true,
	}),
);

// app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		message: "Doctor Tracker API is running",
	});
});

app.use("/api/auth", AuthRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
