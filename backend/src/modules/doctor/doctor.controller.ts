import type { Request, Response } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { DoctorServices } from "./doctor.service";
import { catchAsync } from "../../utils/catchAsync";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
	const result = await DoctorServices.createDoctor(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Doctor created successfully.",
		data: result,
	});
});

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
	const query = req.query;
	const result = await DoctorServices.getAllDoctors(query);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Doctors retrieved successfully.",
		data: result,
	});
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
	const id = req.params.id as string;

	const result = await DoctorServices.deleteDoctor(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Doctor deleted successfully",
		data: result,
	});
});

export const DoctorControllers = {
	createDoctor,
	getAllDoctors,
	deleteDoctor,
};
