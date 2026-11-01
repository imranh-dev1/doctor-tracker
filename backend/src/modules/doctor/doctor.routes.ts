import { Router } from "express";
import { auth } from "../../middlewares/checkAuth";
import { UserRole } from "../../types/user.types";
import { validateRequest } from "../../middlewares/validateRequest";
import { DoctorValidation } from "./doctor.validation";
import { DoctorControllers } from "./doctor.controller";

const router = Router();

router.post(
	"/",
	auth(UserRole.ADMIN),
	validateRequest(DoctorValidation.createDoctorSchema),
	DoctorControllers.createDoctor,
);

router.get("/", auth(UserRole.ADMIN), DoctorControllers.getAllDoctors);

router.delete("/:id", auth(UserRole.ADMIN), DoctorControllers.deleteDoctor);

export const DoctorRoutes = router;
