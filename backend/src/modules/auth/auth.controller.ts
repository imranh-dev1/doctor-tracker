import type { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";
import type { RequestUser } from "../../middlewares/checkAuth";
import { clearAuthCookies, setAuthCookies } from "../../utils/authCookie";

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

	setAuthCookies(res, result.accessToken, result.refreshToken);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User login successfully.",
		data: result,
	});
};

const getMe = async (req: Request, res: Response) => {
	const user = req.user as RequestUser;

	const result = await AuthServices.getMe(user.userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Current user retrieved successfully.",
		data: result,
	});
};

const logout = async (req: Request, res: Response) => {
	clearAuthCookies(res);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Logout successful.",
		data: null,
	});
};

export const AuthControllers = {
	register,
	login,
	getMe,
	logout,
};
