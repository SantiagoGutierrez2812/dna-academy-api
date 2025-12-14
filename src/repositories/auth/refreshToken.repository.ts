import type { Prisma, RefreshToken } from "@prisma/client";
import { prisma } from "../../configs/database"


class RefreshTokenRepository {

    async create(params: Prisma.RefreshTokenUncheckedCreateInput): Promise<RefreshToken> {
        return await prisma.refreshToken.create({
            data: params
        });
    }

    async find(params: Prisma.RefreshTokenWhereInput): Promise<RefreshToken | null> {
        return await prisma.refreshToken.findFirst({
            where: params
        });
    }

    async delete(params: Prisma.RefreshTokenWhereInput): Promise<number> {
        const result = await prisma.refreshToken.deleteMany({
            where: params
        });
        return result.count;
    }
}

export default new RefreshTokenRepository();