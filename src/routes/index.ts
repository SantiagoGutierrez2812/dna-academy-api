import { Router } from "express";

import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import studentRoutes from "./academic/student.routes";
import subjectRoutes from "./academic/subject.routes";
import gradeRoutes from "./academic/grade.routes";
import countryRoutes from "./country.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/subjects", subjectRoutes);
router.use("/grades", gradeRoutes);
router.use("/countries", countryRoutes);


export default router;