import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { PatientValidation } from "./patient.validation";
import { auth } from "../../middlewares/checkAuth";
import { UserRole } from "../../types/user.types";
import { PatientController } from "./patient.controller";

const router = Router();

router.post(
	"/",
	auth(UserRole.ADMIN),
	validateRequest(PatientValidation.createPatientValidationSchema),
	PatientController.createPatient,
);

export const PatientRoutes = router;
