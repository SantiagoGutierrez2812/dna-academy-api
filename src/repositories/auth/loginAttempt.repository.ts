import type { Prisma, LoginAttempt } from "@prisma/client";
import { prisma } from "../../configs/database";

class LoginAttemptRespository {

    async findUnique(param: Prisma.LoginAttemptWhereUniqueInput): Promise<LoginAttempt | null> {
        return await prisma.loginAttempt.findUnique({
            where: param,
        });
    }

    async upsert(params: Prisma.LoginAttemptCreateInput): Promise<LoginAttempt> {
        return await prisma.loginAttempt.upsert({
            where: { identifier: params.identifier },
            create: params,
            update: {
                attempts: { increment: 1 },
                ...(params.lockUntil !== undefined && { lockUntil: params.lockUntil })
            },
        });
    }

    async lockAccount(param: Prisma.LoginAttemptWhereUniqueInput, date: Date): Promise<LoginAttempt> {
        return await prisma.loginAttempt.update({
            where: param,
            data: { lockUntil: date }
        });
    }

    // ELimina el registro del usuario que inició sesión correctamente
    async resetAttempts(identifier: string): Promise<Prisma.BatchPayload> {
        return await prisma.loginAttempt.deleteMany({
            where: { identifier }
        });
    }
}

export default new LoginAttemptRespository();