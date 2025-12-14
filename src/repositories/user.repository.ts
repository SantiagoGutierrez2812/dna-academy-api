import type { Prisma, User } from "@prisma/client";
import { prisma } from "../configs/database";


class UserRepository {

    OMIT_SENSITIVE_DATA = { password: true };

    async create(params: Prisma.UserCreateInput): Promise<User> {
        return await prisma.user.create({
            data: params,
            omit: this.OMIT_SENSITIVE_DATA
        });
    }

    async find(param: Prisma.UserWhereInput): Promise<User | null> {
        return await prisma.user.findFirst({
            where: {
                ...param,
                deletedAt: null
            },
            omit: this.OMIT_SENSITIVE_DATA
        });
    }

    async findUniqueWithPassword(param: Prisma.UserWhereInput): Promise<User | null> {
        return await prisma.user.findFirst({
            where: {
                ...param,
                deletedAt: null
            }
        });
    }

    async update(id: number, param: Prisma.UserUpdateInput): Promise<User> {
        return await prisma.user.update({
            where: { id, deletedAt: null },
            data: param
        });
    }
}

export default new UserRepository();