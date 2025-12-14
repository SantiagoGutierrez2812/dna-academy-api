import type { Prisma, User } from "@prisma/client";
import { prisma } from "../configs/database";
import HttpError from "../errors/HttpError";


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
            data: param,
            omit: this.OMIT_SENSITIVE_DATA
        });
    }

    async delete(id: number): Promise<User> {

        const user: User | null = await this.find({ id });

        if (!user) {
            throw new HttpError(404, "El usuario a eliminar no existe");
        }

        const deletedSuffix = `_deleted_${Date.now()}`;

        return await prisma.user.update({
            where: { id, deletedAt: null },
            data: {
                email: `${user.email}${deletedSuffix}`,
                phoneNumber: `${user.phoneNumber}${deletedSuffix}`,
                documentNumber: `${user.documentNumber}${deletedSuffix}`,
                deletedAt: new Date()
            },
            omit: this.OMIT_SENSITIVE_DATA
        });
    }

    async getAll(): Promise<User[]> {
        return await prisma.user.findMany({
            where: { deletedAt: null },
            omit: this.OMIT_SENSITIVE_DATA,
            orderBy: { name: "asc" }
        });
    }
}

export default new UserRepository();