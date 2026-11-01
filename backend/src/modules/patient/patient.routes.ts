import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { PatientValidation } from "./patient.validation";
import { auth } from "../../middlewares/checkAuth";
import { UserRole } from "../../types/user.types";
import { PatientControllers } from "./patient.controller";

const router = Router();

router.post(
	"/",
	auth(UserRole.ADMIN),
	validateRequest(PatientValidation.createPatientValidationSchema),
	PatientControllers.createPatient,
);

router.get("/", auth(UserRole.ADMIN), PatientControllers.getPatients);

router.get("/conditions", auth(UserRole.ADMIN), PatientControllers.getConditions);

router.get("/:id", auth(UserRole.ADMIN), PatientControllers.getPatient);

router.patch(
	"/:id",
	auth(UserRole.ADMIN),
	validateRequest(PatientValidation.updatePatientValidationSchema),
	PatientControllers.updatePatient,
);

router.delete("/:id", auth(UserRole.ADMIN), PatientControllers.deletePatient);

export const PatientRoutes = router;
