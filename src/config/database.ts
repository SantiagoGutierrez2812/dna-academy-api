import { PrismaClient } from "@prisma/client";
import appConfig from "./app.config";

declare global {
    var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient();

// Cache de instancia en desarrollo para evitar múltiples conexiones en hot-reload
if (appConfig.NODE_ENV !== "production") {
    global.prisma = prisma;
}

export async function connectDB(): Promise<void> {
    try {
        await prisma.$connect();
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        throw error;
    }
}

export async function disconnectDB(): Promise<void> {
    await prisma.$disconnect();
}