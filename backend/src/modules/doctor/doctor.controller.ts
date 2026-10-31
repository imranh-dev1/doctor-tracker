import type { Request, Response } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { DoctorServices } from "./doctor.service";

const createDoctor = async (req: Request, res: Response) => {
	const result = await DoctorServices.createDoctor(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Doctor created successfully.",
		data: result,
	});
};

const getAllDoctors = async (req: Request, res: Response) => {
	const query = req.query;
	const result = await DoctorServices.getAllDoctors(query);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Doctors retrieved successfully.",
		data: result,
	});
};

export const DoctorControllers = {
	createDoctor,
	getAllDoctors,
};
