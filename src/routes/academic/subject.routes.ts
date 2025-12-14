import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { createSubjectValidator, idSubjectValidator, updateSubjectValidator, studentGradesValidator } from "../../middlewares/validators/subject.validator";
import subjectController from "../../controllers/academic/subject.controller";
import { asyncHandler } from "../../utils/asyncHandler.utils";


const router = Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR"]),
    createSubjectValidator,
    asyncHandler(subjectController.createSubject)
);

router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR"]),
    updateSubjectValidator,
    asyncHandler(subjectController.updateSubject)
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR"]),
    idSubjectValidator,
    asyncHandler(subjectController.deleteSubject)
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR"]),
    asyncHandler(subjectController.getSubjects)
);

router.get(
    "/my-subjects",
    authMiddleware,
    roleMiddleware(["PROFESSIONAL"]),
    asyncHandler(subjectController.getMySubjects)
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR"]),
    idSubjectValidator,
    asyncHandler(subjectController.getSubject)
);

router.get(
    "/:id/students",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR", "PROFESSIONAL"]),
    idSubjectValidator,
    asyncHandler(subjectController.getStudents)
);

router.get(
    "/:id/students/:studentId/grades",
    authMiddleware,
    roleMiddleware(["ADMINISTRATOR", "COORDINATOR", "PROFESSIONAL"]),
    studentGradesValidator,
    asyncHandler(subjectController.getStudentGrades)
);

export default router;