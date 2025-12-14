import type { Grade, Prisma } from "@prisma/client";
import { prisma } from "../../configs/database"

class GradeRepository {

    async create(params: Prisma.GradeUncheckedCreateInput): Promise<Grade> {
        return await prisma.grade.create({
            data: params
        });
    }

    async update(id: number, params: Prisma.GradeUncheckedUpdateInput): Promise<Grade> {
        return await prisma.grade.update({
            where: { id, deletedAt: null },
            data: params
        });
    }

    async find(param: Prisma.GradeWhereInput): Promise<Grade | null> {
        return await prisma.grade.findFirst({
            where: {
                ...param,
                deletedAt: null
            }
        });
    }

    async delete(id: number): Promise<Grade> {
        return await prisma.grade.update({
            where: { id, deletedAt: null },
            data: { deletedAt: new Date() }
        });
    }

    async getAll(): Promise<Grade[]> {
        return await prisma.grade.findMany({
            where: {
                deletedAt: null
            }
        });
    }
}

export default new GradeRepository()