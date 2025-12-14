import { Router } from "express";
import { createUserValidator, updateUserValidator, idUserValidator } from "../middlewares/validators/user.validator";
import userController from "../controllers/user.controller";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR"]),
    createUserValidator,
    asyncHandler(userController.createUser)
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR"]),
    asyncHandler(userController.getUsers)
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR"]),
    idUserValidator,
    asyncHandler(userController.getUser)
);

router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR"]),
    updateUserValidator,
    asyncHandler(userController.updateUser)
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR"]),
    idUserValidator,
    asyncHandler(userController.deleteUser)
);

export default router;