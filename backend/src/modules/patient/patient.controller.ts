import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { PatientServices } from "./patient.service";

const createPatient = catchAsync(async (req: Request, res: Response) => {
	const result = await PatientServices.createPatient(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Patient created successfully.",
		data: result,
	});
});

const getPatients = catchAsync(async (req: Request, res: Response) => {
	const result = await PatientServices.getPatients(req.query);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Patients retrieved successfully.",
		data: result,
	});
});

export const PatientController = {
	createPatient,
	getPatients,
};
