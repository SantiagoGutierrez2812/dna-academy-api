import type { Request, Response, NextFunction } from "express";
import HttpError from "../errors/HttpError";
import type { UserRole } from "@prisma/client";

export const roleMiddleware = (allowedRoles: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const userRole = req.userRole;

        if (!userRole) {
            throw new HttpError(401, "No autenticado");  // No hay rol = no pasó por authMiddleware
        }

        if (!allowedRoles.includes(userRole)) {
            throw new HttpError(403, "No tienes permisos para acceder a este recurso");
        }

        next();
    }
} 