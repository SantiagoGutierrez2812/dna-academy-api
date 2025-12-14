import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { createGradeValidator, updateGradeValidator, idGradeValidator } from "../../middlewares/validators/grade.validator";
import gradeController from "../../controllers/academic/grade.controller";
import { asyncHandler } from "../../utils/asyncHandler.utils";

const router = Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR", "PROFESSIONAL"]),
    createGradeValidator,
    asyncHandler(gradeController.createGrade)
);

router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR", "PROFESSIONAL"]),
    updateGradeValidator,
    asyncHandler(gradeController.updateGrade)
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR", "PROFESSIONAL"]),
    idGradeValidator,
    asyncHandler(gradeController.deleteGrade)
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR", "PROFESSIONAL"]),
    asyncHandler(gradeController.getGrades)
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR", "PROFESSIONAL"]),
    idGradeValidator,
    asyncHandler(gradeController.getGrade)
);

export default router;
