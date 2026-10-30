import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { MongoServerError } from "mongodb";
import config from "../config";

export const globalErrorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (res.headersSent) {
        return next(err);
    }

    if (config.node_env === "development") {
        console.error("Error from Global Error Handler:", err);
    }

    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = "Internal Server Error";
    let errorName = "Error";
    let errorStack: string | undefined;

    if (err instanceof Error) {
        errorMessage = err.message;
        errorName = err.name;
        errorStack = err.stack;
    }

    // Handle MongoDB errors
    if (err instanceof MongoServerError) {
        switch (err.code) {
            case 11000:
                statusCode = httpStatus.CONFLICT;
                errorMessage = "A user with this email already exists.";
                break;

            case 121:
                statusCode = httpStatus.BAD_REQUEST;
                errorMessage = "MongoDB document validation failed.";
                break;

            default:
                statusCode = httpStatus.INTERNAL_SERVER_ERROR;
                errorMessage = "A database operation failed.";
                break;
        }
    }

    // Handle custom application errors
    if (
        typeof err === "object" &&
        err !== null &&
        "statusCode" in err &&
        typeof err.statusCode === "number"
    ) {
        statusCode = err.statusCode;
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        name:
            config.node_env === "development"
                ? errorName
                : "Internal Server Error",
        message:
            config.node_env === "development"
                ? errorMessage
                : "Something went wrong!",
        error: config.node_env === "development" ? err : undefined,
        stack: config.node_env === "development" ? errorStack : undefined,
    });
};