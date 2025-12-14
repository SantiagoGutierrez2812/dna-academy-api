import jwt from "jsonwebtoken";
import { Prisma, type LoginAttempt, type Otp, type RefreshToken, type User } from "@prisma/client";
import type { LoginSuccessfulDto, PreLoginDto } from "../dtos/auth.dto";
import loginAttemptRepository from "../repositories/auth/loginAttempt.repository";
import appConfig from "../configs/app.config";
import HttpError from "../errors/HttpError";
import userRepository from "../repositories/user.repository";
import otpRepository from "../repositories/auth/otp.repository";
import { generateUniqueOtp } from "../utils/otpGenerator.utils";
import { comparePassword } from "../utils/password.utils";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.utils";
import refreshTokenRepository from "../repositories/auth/refreshToken.repository";
import type { LoginResponse } from "../types/auth.types";
import type { RefreshTokenPayload } from "../types/jwt.types";

/**
 * Servicio de autenticación.
 * Maneja el flujo de login con OTP y protección contra ataques de fuerza bruta.
 */
class AuthService {

    /**
     * Primera fase del login: valida credenciales y genera OTP.
     *
     * Flujo:
     * 1. Verifica si la cuenta está bloqueada
     * 2. Valida email, password y estado del usuario
     * 3. Genera y almacena OTP de 6 dígitos
     * 4. Resetea contador de intentos fallidos
     *
     * @param params - Email y password del usuario
     * @param ip - Dirección IP del cliente (para registro de intentos)
     * @returns OTP generado (en producción se enviaría por email)
     * @throws HttpError 401 si las credenciales son inválidas
     * @throws HttpError 403 si la cuenta está bloqueada
     */
    async preLogin(params: PreLoginDto, ip: string): Promise<string> {

        await this.throwIfLocked(params.email);

        const user: User = await this.validateLoginAttempt(params, ip);

        const otp: string = await this.generateLoginOtp(user);

        await loginAttemptRepository.resetAttempts(user.email);

        // TODO: Implementar envío de OTP por email
        // Por ahora se retorna el OTP para facilitar pruebas

        return otp;
    }

    /**
     * Verifica si la cuenta está bloqueada por exceso de intentos fallidos.
     * @param identifier - Email del usuario
     * @throws HttpError 403 si la cuenta está bloqueada temporalmente
    */
    private async throwIfLocked(identifier: string): Promise<void> {
        const loginAttempt: LoginAttempt | null
            = await loginAttemptRepository.findUnique({ identifier });

        if (loginAttempt && loginAttempt.lockUntil && loginAttempt.lockUntil > new Date()) {
            throw new HttpError(403, "Cuenta bloqueada");
        }
    }

    /**
     * Valida credenciales del usuario y registra intentos fallidos.
     * Si las credenciales son inválidas, incrementa el contador de intentos.
     * Bloquea la cuenta si se superan los intentos fallidos.
     * @param params - Email y password del usuario
     * @param ip - Dirección IP para registro de intentos
     * @returns Usuario autenticado
     * @throws HttpError 401 si credenciales inválidas (usuario no existe, inactivo o password incorrecto)
     * @throws HttpError 403 si la cuenta se bloquea por exceso de intentos
    */
    private async validateLoginAttempt(params: PreLoginDto, ip: string): Promise<User> {
        const user: User | null = await userRepository.findUniqueWithPassword({ email: params.email });

        // Valida si el usuario existe, está activo y su contraseña es correcta
        const isValid = user && user.active && await comparePassword(params.password, user.password);

        if (!isValid) {
            // Siempre responde con "Credenciales erróneas" para que un atacante no sepa cuando los email son correctos
            await this.incrementFailedAttempts(params.email, ip, "Credenciales erróneas");
        }

        // Se usa non-null assertion porque si se llega a este punto es porque incrementFailedAttempts no lanzó error
        return user!;
    }

    /**
     * Incrementa el contador de intentos fallidos y bloquea la cuenta si es necesario.
     * @param identifier - Email del usuario
     * @param ip - Dirección IP del intento
     * @param errorMessage - Mensaje de error a mostrar si no se bloquea
     * @throws HttpError 401 con el mensaje proporcionado
     * @throws HttpError 403 si la cuenta se bloquea por exceso de intentos
    */
    private async incrementFailedAttempts(identifier: string, ip: string, errorMessage: string): Promise<never> {
        const lastLoginAttempt: LoginAttempt =
            await loginAttemptRepository.upsert({ identifier, ip });

        if (lastLoginAttempt.attempts >= appConfig.AUTH_MAX_ATTEMPTS) {
            const lockUntil = new Date(Date.now() + appConfig.LOGIN_LOCKOUT_MINUTES * 60 * 1000);
            await loginAttemptRepository.lockAccount({ identifier }, lockUntil);
            throw new HttpError(403, `Cuenta bloqueada, intente en ${appConfig.LOGIN_LOCKOUT_MINUTES} minutos`);
        }

        throw new HttpError(401, errorMessage);
    }

    /**
     * Genera un OTP único de 6 dígitos para el login.
     * Si hay colisión con un código existente, reintenta automáticamente.
     * @param user - Usuario para el cual se genera el OTP
     * @returns Código OTP de 6 dígitos
    */
    private async generateLoginOtp(user: User): Promise<string> {
        const otpExpiresAt = new Date(Date.now() + appConfig.OTP_EXPIRATION_MINUTES * 60 * 1000);

        let otp: string = "";
        let existsOtp: boolean = false;

        do {
            try {
                otp = generateUniqueOtp();
                existsOtp = false;
                await otpRepository.create({ code: otp, type: "LOGIN", userId: user.id, expiresAt: otpExpiresAt });

            } catch (error: unknown) {
                // Si lanza un error de Prisma "P2002" significa que el otp creado está repetido, por ende, debe generar uno nuevo
                if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                    existsOtp = true;
                } else {
                    throw error;
                }
            }
        } while (existsOtp);

        return otp;
    }

    /**
     * Segunda fase del login: valida OTP y genera tokens de autenticación.
     *
     * Flujo:
     * 1. Verifica que el usuario existe
     * 2. Verifica si la cuenta está bloqueada
     * 3. Valida el OTP (existe, no usado, no expirado)
     * 4. Marca el OTP como usado
     * 5. Resetea contador de intentos fallidos
     * 6. Genera tokens (access y refresh)
     * 7. Actualiza lastLogin del usuario
     *
     * @param params - Email y código OTP
     * @param ip - Dirección IP del cliente
     * @returns Respuesta con tokens y datos del usuario
     * @throws HttpError 401 si el usuario no existe o el OTP es inválido
     * @throws HttpError 403 si la cuenta está bloqueada
     */
    async loginSuccessful(params: LoginSuccessfulDto, ip: string): Promise<LoginResponse> {

        const user: User | null = await userRepository.find({ email: params.email });

        if (!user) {
            // Se envía un mensaje de código inválido para no revelar que el usuario existe
            throw new HttpError(401, "El token ingresado no es válido");
        }

        await this.throwIfLocked(params.email);

        // Si el otp no es correcto, lanza error y aumenta el loginAttempts
        const otp = await this.checkLoginOtp(params, user, ip);

        await otpRepository.markAsUsed({ id: otp.id });

        await loginAttemptRepository.resetAttempts(user.email);

        // Actualiza el lastLogin del usuario 

        await userRepository.update(user.id, { lastLogin: new Date() });

        // Llama al método que genera los tokens de autenticación
        const { accessToken, refreshToken } = await this.issueTokens(user, ip);

        return {
            message: "Inicio de sesión exitoso",
            accessToken,
            refreshToken,
            user: {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                documentNumber: user.documentNumber,
                phoneNumber: user.phoneNumber,
            }
        }
    }

    /**
     * Valida el OTP de login verificando si existe, si ya se usó y si ya expiró.
     * @param params - Email y código OTP
     * @param user - Usuario autenticado
     * @param ip - Dirección IP del cliente
     * @returns OTP válido
     * @throws HttpError 401 si el OTP no existe, ya fue usado o expiró
     * @throws HttpError 403 si la cuenta se bloquea por exceso de intentos
     */
    private async checkLoginOtp(params: LoginSuccessfulDto, user: User, ip: string): Promise<Otp> {

        const otp: Otp | null = await otpRepository.findByTokenAndUserIdAndType({ userId: user.id, code: params.otp, type: "LOGIN" });

        if (!otp) {
            await this.incrementFailedAttempts(params.email, ip, "El token ingresado no es válido");
        }

        // Se usa non-null assertion porque si llega a este punto es porque incrementFailedAttempts no lanzó error
        if (otp!.usedAt) {
            await this.incrementFailedAttempts(params.email, ip, "El token ingresado ya fue usado");
        }

        if (otp!.expiresAt < new Date()) {
            await this.incrementFailedAttempts(params.email, ip, "El token ingresado ya expiró");
        }

        return otp!;
    }

    /**
     * Genera y almacena los tokens de autenticación (access y refresh).
     * @param user - Usuario para el cual se generan los tokens
     * @param ip - Dirección IP del cliente (se almacena con el refresh token)
     * @returns Access token y refresh token generados
     */
    private async issueTokens(user: User, ip: string): Promise<{ accessToken: string, refreshToken: string }> {

        const accessToken: string = generateAccessToken({ sub: user.id, email: user.email, role: user.role, type: "access" });
        const refreshToken: string = generateRefreshToken({ sub: user.id, type: "refresh" });

        const refreshTokenExpiresAt = new Date(Date.now() + appConfig.JWT_REFRESH_EXP_DAYS * 24 * 60 * 60 * 1000);

        await refreshTokenRepository.create({ token: refreshToken, userId: user.id, ip, expiresAt: refreshTokenExpiresAt });

        return { accessToken, refreshToken };
    }

    /**
     * Genera un nuevo access token usando un refresh token válido.
     * @param token - Refresh token actual
     * @returns Nuevo access token
     * @throws HttpError 401 si el refresh token es inválido, expirado o revocado
     * @throws HttpError 401 si el usuario no existe o está inactivo
     */
    async generateNewAccessToken(token: string): Promise<string> {

        const decoded: RefreshTokenPayload = verifyRefreshToken(token);

        const refreshToken: RefreshToken | null =
            await refreshTokenRepository.find({ token, userId: decoded.sub });

        if (!refreshToken) {
            throw new HttpError(401, "Refresh token inválido o revocado");
        }

        const user: User | null = await userRepository.find({ id: refreshToken.userId });

        if (!user || !user.active) {
            throw new HttpError(401, "Usuario no encontrado o inactivo");
        }

        return generateAccessToken({ sub: user.id, email: user.email, role: user.role, type: "access" });
    }

    /**
     * Cierra la sesión eliminando el refresh token de la base de datos.
     * Usa jwt.decode para permitir logout incluso con tokens expirados.
     * @param refreshToken - Refresh token a invalidar
     */
    async logout(refreshToken: string): Promise<void> {
        const decoded = jwt.decode(refreshToken) as RefreshTokenPayload | null;

        if (decoded?.sub) {
            await refreshTokenRepository.delete({ token: refreshToken, userId: decoded.sub });
        }
    }
}

export default new AuthService();