
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import config from "./config";

const app = express();

app.use(
    cors({
        origin: config.frontend_url ?? "http://localhost:3000",
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Doctor Tracker API is running",
    });
});

export default app;
