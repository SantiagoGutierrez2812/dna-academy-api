import jwt, { type SignOptions } from "jsonwebtoken";
import type { AccessTokenPayload, RefreshTokenPayload } from "../types/jwt.types";
import { AUTH_CONFIG } from "../configs/auth.config";
import HttpError from "../errors/HttpError";

/**
 * Genera un token, recibe un payload de tipo genérico para que el método sea reutilizable.
 * @param payload 
 * @param secret 
 * @param options 
 * @returns token
 */
function generateToken<T extends object>(payload: T, secrect: string, options?: SignOptions): string {
    return jwt.sign(payload, secrect, options);
}

/**
 * Valida que el payload generado por el método de verificación de token sea un objeto, si no, lanza error.
 * @param decoded 
 */
function validateDecodedPayload(decoded: unknown): asserts decoded is object {
    if (!decoded || typeof decoded === 'string' || typeof decoded !== 'object') {
        throw new Error('Token payload inválido');
    }
}

/**
 * Función genérica de verificación de token, devuelve el tipo de Payload que se le indique.
 * @param token 
 * @param secrect 
 * @returns payload decodificado
 */
function verifyToken<T>(token: string, secrect: string): T {
    try {
        const decoded = jwt.verify(token, secrect);
        validateDecodedPayload(decoded);

        return decoded as T;
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.name === 'TokenExpiredError') {
                throw new HttpError(401, 'Token expirado');
            } else if (error.name === 'JsonWebTokenError') {
                throw new HttpError(401, 'Token inválido');
            } else if (error.name === 'NotBeforeError') {
                throw new HttpError(401, 'NotBeforeError');
            }
        }
        throw error; // re-lanza si es otro tipo de error
    }
}


export function generateAccessToken(payload: AccessTokenPayload): string {
    return generateToken<AccessTokenPayload>(payload, AUTH_CONFIG.accessToken.secret, { expiresIn: AUTH_CONFIG.accessToken.expiresIn } as SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
    return verifyToken<AccessTokenPayload>(token, AUTH_CONFIG.accessToken.secret);
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
    return generateToken<RefreshTokenPayload>(payload, AUTH_CONFIG.refreshToken.secret, { expiresIn: AUTH_CONFIG.refreshToken.expiresIn } as SignOptions);
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
    return verifyToken<RefreshTokenPayload>(token, AUTH_CONFIG.refreshToken.secret);
}
