import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import { auth } from "../../middlewares/checkAuth";
import { UserRole } from "../../types/user.types";

const router = Router();

router.post(
	"/register",
	auth(UserRole.ADMIN),
	validateRequest(AuthValidations.registerValidationSchema),
	AuthControllers.register,
);

router.post(
	"/login",
	validateRequest(AuthValidations.loginValidationSchema),
	AuthControllers.login,
);

router.get(
	"/me",
	auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
	AuthControllers.getMe,
);

router.post("/logout", AuthControllers.logout);

export const AuthRoutes = router;
