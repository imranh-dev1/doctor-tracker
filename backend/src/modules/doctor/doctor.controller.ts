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

export const DoctorControllers = {
    createDoctor,
}; 