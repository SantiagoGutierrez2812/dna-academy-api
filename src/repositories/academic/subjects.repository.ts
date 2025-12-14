import type { Grade, Prisma, Student, Subject } from "@prisma/client";
import { prisma } from "../../configs/database";
import HttpError from "../../errors/HttpError";

class SubjectRepository {

    async create(params: Prisma.SubjectUncheckedCreateInput): Promise<Subject> {
        return await prisma.subject.create({
            data: params
        });
    }

    async find(param: Prisma.SubjectWhereInput): Promise<Subject | null> {
        return await prisma.subject.findFirst({
            where: {
                ...param,
                deletedAt: null
            }
        });
    }

    async update(id: number, params: Prisma.SubjectUncheckedUpdateInput): Promise<Subject> {
        return await prisma.subject.update({
            where: { id, deletedAt: null },
            data: params
        });
    }

    async delete(id: number): Promise<Subject> {
        const subject: Subject | null = await this.find({ id });

        if (!subject) {
            throw new HttpError(404, "La materia a eliminar no existe");
        }

        const deletedSuffix = `_deleted_${Date.now()}`;

        return await prisma.subject.update({
            where: { id, deletedAt: null },
            data: {
                name: `${subject.name}${deletedSuffix}`,
                deletedAt: new Date()
            }
        });
    }

    async getSubjects(): Promise<Subject[]> {
        return await prisma.subject.findMany({
            where: { deletedAt: null }
        });
    }

    async getSubjectsByProfessionalId(professionalId: number): Promise<Subject[]> {
        return await prisma.subject.findMany({
            where: {
                professionalId,
                deletedAt: null
            }
        });
    }

    async getStudentsBySubjectId(subjectId: number): Promise<Student[]> {
        const enrollments = await prisma.studentSubject.findMany({
            where: {
                subjectId,
                deletedAt: null,
                student: { deletedAt: null }
            },
            include: { student: true }
        });

        return enrollments.map(enrollment => enrollment.student);
    }

    async getStudentGrades(subjectId: number, studentId: number): Promise<Grade[]> {
        const enrollment = await prisma.studentSubject.findFirst({
            where: {
                subjectId,
                studentId,
                deletedAt: null
            }
        });

        if (!enrollment) return [];

        return await prisma.grade.findMany({
            where: {
                studentSubjectId: enrollment.id,
                deletedAt: null
            }
        });
    }
}

export default new SubjectRepository();