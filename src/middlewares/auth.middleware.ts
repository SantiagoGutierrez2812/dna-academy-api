import type { Request, Response, NextFunction } from "express";
import { AUTH_CONFIG } from "../configs/auth.config";
import { verifyAccessToken } from "../utils/jwt.utils";
import type { AccessTokenPayload } from "../types/jwt.types";
import HttpError from "../errors/HttpError";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const accessToken: string = req.cookies[AUTH_CONFIG.accessToken.cookieName];

    if (!accessToken) throw new HttpError(401, "No autenticado");

    const decoded: AccessTokenPayload = verifyAccessToken(accessToken);

    if (decoded.type !== "access") throw new HttpError(401, "Tipo de token incorrecto");

    req.userId = decoded.sub;
    req.userRole = decoded.role;

    next();
}