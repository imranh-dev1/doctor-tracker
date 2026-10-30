import type { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";
import type { RequestUser } from "../../middlewares/checkAuth";

const register = async (req: Request, res: Response) => {
	const result = await AuthServices.register(req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User registered successfully.",
		data: result,
	});
};

const login = async (req: Request, res: Response) => {
	const result = await AuthServices.login(req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User login successfully.",
		data: result,
	});
};

const getMe = async (req: Request, res: Response) => {
	const user = req.user as RequestUser;

	const result = AuthServices.getMe(user.userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Current user retrieved successfully.",
		data: result,
	});
};

export const AuthControllers = {
	register,
	login,
	getMe,
};
