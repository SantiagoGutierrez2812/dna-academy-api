import { Router } from "express";

import authRoutes from "./user/user.routes";

const router = Router();

router.use("/users", authRoutes);


export default router;