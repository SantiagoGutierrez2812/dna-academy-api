import type { Request, Response } from "express"
import authService from "../services/auth.service";
import HttpError from "../errors/HttpError";
import type { LoginResponse } from "../types/auth.types";
import { AUTH_CONFIG } from "../configs/auth.config";
import userRepository from "../repositories/user.repository";
import type { User } from "@prisma/client";


class AuthController {

    async preLogin(req: Request, res: Response) {
        const { email, password } = req.body;
        const ip = req.ip;

        if (!ip) {
            throw new HttpError(400, "No se recibió la ip");
        }

        const otp = await authService.preLogin({ email, password }, ip);

        res.status(200).json({
            data: { otp },
            message: "Se ha enviado un código de verificación a tu email"
        });

    }

    async verifyLoginOtp(req: Request, res: Response) {
        const { email, otp } = req.body;
        const ip = req.ip;

        if (!ip) {
            throw new HttpError(400, "No se recibió la ip");
        }
        const response: LoginResponse = await authService.loginSuccessful({ email, otp }, ip);

        res.cookie(
            AUTH_CONFIG.accessToken.cookieName,
            response.accessToken,
            AUTH_CONFIG.accessToken.cookieOptions
        )

        res.cookie(
            AUTH_CONFIG.refreshToken.cookieName,
            response.refreshToken,
            AUTH_CONFIG.refreshToken.cookieOptions
        )

        res.status(200).json({
            message: response.message,
            data: { user: response.user }
        });
    }

    async refreshAccessToken(req: Request, res: Response) {
        const refreshToken: string = req.cookies[AUTH_CONFIG.refreshToken.cookieName];

        if (!refreshToken) {
            throw new HttpError(401, "No se envió el refresh token");
        }

        const accessToken = await authService.generateNewAccessToken(refreshToken);

        res.cookie(
            AUTH_CONFIG.accessToken.cookieName,
            accessToken,
            AUTH_CONFIG.accessToken.cookieOptions
        );

        res.status(200).json({
            message: "Access token generado exitosamente"
        });
    }

    async logout(req: Request, res: Response) {

        const refreshToken: string | undefined = req.cookies[AUTH_CONFIG.refreshToken.cookieName];

        if (refreshToken) {
            await authService.logout(refreshToken);
        }

        res.clearCookie(
            AUTH_CONFIG.accessToken.cookieName,
            AUTH_CONFIG.accessToken.cookieOptions
        );

        res.clearCookie(
            AUTH_CONFIG.refreshToken.cookieName,
            AUTH_CONFIG.refreshToken.cookieOptions
        );

        res.status(200).json({
            message: "Sesión cerrada exitosamente"
        });
    }

    async getMe(req: Request, res: Response) {

        const userId: number = req.userId!;

        const user: User | null = await userRepository.find({ id: userId });

        if (!user) {
            throw new HttpError(404, "Usuario no encontrado");
        }

        res.status(200).json({
            message: "Usuario obtenido exitosamente",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    documentNumber: user.documentNumber,
                    phoneNumber: user.phoneNumber
                }
            }
        });
    }

    async register(req: Request, res: Response) {

        const user = await authService.register(req.body);

        res.status(201).json({
            message: "Profesional registrado exitosamente",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    }
}

export default new AuthController();