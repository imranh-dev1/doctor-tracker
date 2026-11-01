import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
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

const getPatient = catchAsync(async (req: Request, res: Response) => {
	const result = await PatientServices.getPatientById(req.params.id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Patient retrieved successfully.",
		data: result,
	});
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
	const result = await PatientServices.updatePatient(
		req.params.id as string,
		req.body,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Patient updated successfully.",
		data: result,
	});
});

const deletePatient = catchAsync(async (req: Request, res: Response) => {
	const result = await PatientServices.deletePatient(req.params.id as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Patient deleted successfully.",
		data: result,
	});
});

const getConditions = catchAsync(async (_req: Request, res: Response) => {
	const result = await PatientServices.getPatientConditions();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Patient conditions retrieved successfully.",
		data: result,
	});
});

export const PatientControllers = {
	createPatient,
	getPatients,
	getPatient,
	updatePatient,
	deletePatient,
	getConditions,
};
