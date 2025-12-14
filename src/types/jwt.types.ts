import type { UserRole } from "@prisma/client";

export interface AccessTokenPayload {
    sub: number,
    email: string,
    role: UserRole,
    type: "access"
}

export interface RefreshTokenPayload {
    sub: number,
    type: "refresh"
}