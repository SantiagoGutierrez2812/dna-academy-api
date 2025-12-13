import bcrypt from "bcrypt"
import appConfig from "../configs/app.config"

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, appConfig.SALT_ROUNDS_PASSWORD);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch {
        throw new Error("Error comparando contraseñas");
    }
}