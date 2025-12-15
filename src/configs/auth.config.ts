import type { AuthConfig } from "../types/auth.types";
import appConfig from "./app.config";


export const AUTH_CONFIG: AuthConfig = {

    accessToken: {
        secret: appConfig.JWT_ACCESS_SECRET,
        expiresIn: `${appConfig.JWT_ACCESS_EXP_MINUTES}m`,
        cookieName: "accessToken",
        cookieOptions: {
            httpOnly: true,
            secure: appConfig.NODE_ENV === "production",
            sameSite: appConfig.NODE_ENV === "production" ? "none" : "none",
            maxAge: appConfig.JWT_ACCESS_EXP_MINUTES * 60 * 1000, // 15 minutos por defecto
            path: "/",
        }
    },

    refreshToken: {
        secret: appConfig.JWT_REFRESH_SECRET,
        expiresIn: `${appConfig.JWT_REFRESH_EXP_DAYS}d`,
        cookieName: "refreshToken",
        cookieOptions: {
            httpOnly: true,
            secure: appConfig.NODE_ENV === "production",
            sameSite: appConfig.NODE_ENV === "production" ? "none" : "none",
            maxAge: appConfig.JWT_REFRESH_EXP_DAYS * 24 * 60 * 60 * 1000, // 7 días por defecto
            path: "/api/auth",
        }
    }
}