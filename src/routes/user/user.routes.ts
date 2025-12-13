import { Router } from "express";
import { createUserValidator } from "../../middlewares/validators/user.validator";
import userController from "../../controllers/user.controller";
import { asyncHandler } from "../../utils/asyncHandler.utils";

const router = Router()

router.post("/", createUserValidator, asyncHandler(userController.create));

export default router