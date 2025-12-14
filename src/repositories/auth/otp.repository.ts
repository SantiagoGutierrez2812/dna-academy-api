import type { Otp, OtpType, Prisma } from "@prisma/client";
import { prisma } from "../../configs/database"

class OtpRepository {

    async findManyByType(type: OtpType): Promise<Otp[]> {
        return await prisma.otp.findMany({
            where: { type }
        });
    }

    async create(params: Prisma.OtpUncheckedCreateInput): Promise<Otp> {
        return await prisma.otp.create({
            data: params
        });
    }

    async findByTokenAndUserIdAndType(params: Prisma.OtpWhereInput): Promise<Otp | null> {
        return await prisma.otp.findFirst({
            where: params
        });
    }

    async markAsUsed(param: Prisma.OtpWhereUniqueInput): Promise<Otp> {
        return await prisma.otp.update({
            where: param,
            data: { usedAt: new Date() }
        });
    }
}

export default new OtpRepository();