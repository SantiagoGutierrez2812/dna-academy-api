import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import HttpError from "../../errors/HttpError";

/**
 * Middleware para validar los datos de la request
 */
export const validator = (req: Request, _res: Response, next: NextFunction) => {

    const errors = validationResult(req); //Lee los errores del req

    if (!errors.isEmpty()) {
        // Envía el primer error
        const firstError = errors.array()[0];
        throw new HttpError(400, firstError?.msg);
    }

    next();
}