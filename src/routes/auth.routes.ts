import { Router } from "express";
import { preLoginValidator, verifyLoginOtpValidator, registerValidator } from "../middlewares/validators/auth.validator";
import { asyncHandler } from "../utils/asyncHandler.utils";
import authController from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";


const router = Router();

router.post("/login", preLoginValidator, asyncHandler(authController.preLogin));
router.post("/verify-otp-login", verifyLoginOtpValidator, asyncHandler(authController.verifyLoginOtp));
router.post("/register", registerValidator, asyncHandler(authController.register));
router.post("/refresh", asyncHandler(authController.refreshAccessToken));
router.post("/logout", authMiddleware, asyncHandler(authController.logout));
router.get("/me", authMiddleware, asyncHandler(authController.getMe));


export default router;