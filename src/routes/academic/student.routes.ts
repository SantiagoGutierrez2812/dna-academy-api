import { Router } from "express";
import studentController from "../../controllers/academic/student.controller";
import { asyncHandler } from "../../utils/asyncHandler.utils";
import { createStudentValidator, enrrollValidator, idStudentValidator, unenrrollValidator, updateStudentValidator } from "../../middlewares/validators/student.validator";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR"]),
    createStudentValidator,
    asyncHandler(studentController.createStudent)
);

router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR"]),
    updateStudentValidator,
    asyncHandler(studentController.updateStudent)
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR"]),
    idStudentValidator,
    asyncHandler(studentController.deleteStudent)
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR"]),
    asyncHandler(studentController.getStudents)
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR"]),
    idStudentValidator,
    asyncHandler(studentController.getStudent)
);

router.post(
    "/:id/subjects",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR"]),
    enrrollValidator,
    asyncHandler(studentController.enrollSubject)
);

router.delete(
    "/:id/subjects/:subjectId",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR"]),
    unenrrollValidator,
    asyncHandler(studentController.unenrollSubject)
);

router.get(
    "/:id/subjects",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR"]),
    idStudentValidator,
    asyncHandler(studentController.getSubjects)
);

export default router;