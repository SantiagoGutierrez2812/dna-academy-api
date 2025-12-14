import type { UserRole } from "@prisma/client";
import type { CookieOptions } from "express";

export interface AuthConfig {
    refreshToken: TokenConfig,
    accessToken: TokenConfig
}

export interface TokenConfig {
    secret: string;
    expiresIn: string;
    cookieName: string;
    cookieOptions: CookieOptions;
}

export interface LoginResponse {
    message: string,
    accessToken: string,
    refreshToken: string,
    user: UserResponse
}

interface UserResponse {
    id: string,
    name: string,
    email: string,
    role: UserRole,
    documentNumber: string,
    phoneNumber: string,
}