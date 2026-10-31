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

export const DoctorRoutes = router;