import type { Prisma, Student, StudentSubject } from "@prisma/client";
import { prisma } from "../../configs/database";
import HttpError from "../../errors/HttpError";

class StudentRepository {

    async create(params: Prisma.StudentUncheckedCreateInput): Promise<Student> {
        return await prisma.student.create({
            data: params
        });
    }

    async find(param: Prisma.StudentWhereInput): Promise<Student | null> {
        return await prisma.student.findFirst({
            where: {
                ...param,
                deletedAt: null
            }
        });
    }

    async update(id: number, params: Prisma.StudentUncheckedUpdateInput): Promise<Student> {
        return await prisma.student.update({
            where: { id, deletedAt: null },
            data: params
        });
    }

    async delete(id: number): Promise<Student> {
        const student: Student | null = await this.find({ id });

        if (!student) {
            throw new HttpError(404, "El estudiante a eliminar no existe");
        }

        const deletedSuffix = `_deleted_${Date.now()}`;

        return await prisma.student.update({
            where: { id, deletedAt: null },
            data: {
                email: `${student.email}${deletedSuffix}`,
                documentNumber: `${student.documentNumber}${deletedSuffix}`,
                deletedAt: new Date()
            }
        });
    }

    async getStudents(search?: string): Promise<Student[]> {
        return await prisma.student.findMany({
            where: {
                deletedAt: null,
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                        { documentNumber: { contains: search, mode: "insensitive" } }
                    ]
                })
            }
        });
    }

    async enroll(params: Prisma.StudentSubjectUncheckedCreateInput): Promise<StudentSubject> {
        return await prisma.studentSubject.create({
            data: params
        });
    }

    async unroll(studentId: number, subjectId: number): Promise<StudentSubject> {
        return await prisma.studentSubject.delete({
            where: { studentId_subjectId: { studentId, subjectId } }
        });
    }

    async getEnroll(id: number): Promise<StudentSubject | null> {
        return await prisma.studentSubject.findFirst({
            where: { id, deletedAt: null }
        });
    }
}

export default new StudentRepository();