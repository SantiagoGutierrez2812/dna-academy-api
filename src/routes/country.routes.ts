import { Router } from "express";
import countryController from "../controllers/country.controller";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get(
    "/",
    authMiddleware,
    asyncHandler(countryController.getCountries)
);

export default router;
