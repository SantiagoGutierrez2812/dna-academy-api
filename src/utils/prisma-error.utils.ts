import { Prisma } from "@prisma/client";
import HttpError from "../errors/HttpError";

/**
 * Recibe un error y verifica si proviene de Prisma y lo relanza según su código.
 * Si no es de Prisma, relanza el error original.
 * @param error - Error capturado en una operación con Prisma.
 * @throws PrismaClientKnownRequestError | Error
 */
export function handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002': {
                const field = (error.meta?.target as string[])?.[0];
                throw new HttpError(409, `El ${field} ya ha sido registrado`);
            }
            case 'P2003': {
                const field = (error.meta?.field_name as string)?.split('_')[0];
                throw new HttpError(400, `El ${field || 'registro relacionado'} no existe`);
            }
            case 'P2025': {
                throw new HttpError(404, `Registro no encontrado`);
            }
        }
    }
    throw error;
} 