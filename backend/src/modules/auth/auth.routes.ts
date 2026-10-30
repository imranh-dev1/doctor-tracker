import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post(
    "/register",
    validateRequest(UserValidations.createUserValidationSchema),
    AuthControllers.registerCitizen,
);

export const 