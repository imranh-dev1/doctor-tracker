import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DashboardServices } from "./dashboard.service";

const getStats = catchAsync(async (_req: Request, res: Response) => {
	const result = await DashboardServices.getDashboardStats();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Dashboard statistics retrieved successfully.",
		data: result,
	});
});

export const DashboardControllers = {
	getStats,
};
