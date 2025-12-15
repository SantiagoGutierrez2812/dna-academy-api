import type { Grade, Prisma, StudentSubject, Subject } from "@prisma/client";
import { handlePrismaError } from "../../utils/prisma-error.utils";
import HttpError from "../../errors/HttpError";
import type { CreateGradeDto, UpdateGradeDto } from "../../dtos/academic/grade.dto";
import gradeRepository from "../../repositories/academic/grades.repository";
import studentRepository from "../../repositories/academic/student.repository";
import subjectRepository from "../../repositories/academic/subjects.repository";

class GradeService {

    private async verifyProfessionalOwnership(subjectId: number, userId: number): Promise<void> {
        const subject: Subject | null = await subjectRepository.find({ id: subjectId });

        if (!subject) {
            throw new HttpError(404, "Materia no encontrada");
        }

        if (subject.professionalId !== userId) {
            throw new HttpError(403, "No tienes acceso a esta materia");
        }
    }

    async createGrade(params: CreateGradeDto, userId: number, role: string): Promise<Grade> {

        const { studentSubjectId, value, description } = params

        const enrollment: StudentSubject | null = await studentRepository.getEnroll(studentSubjectId);

        if (!enrollment) {
            throw new HttpError(404, "La inscripción ingresada no existe");
        }

        if (role === "PROFESSIONAL") {
            await this.verifyProfessionalOwnership(enrollment.subjectId, userId);
        }

        try {
            return await gradeRepository.create({ studentSubjectId, value, description });
        } catch (error: unknown) {
            handlePrismaError(error);
        }
    }

    async updateGrade(id: number, params: UpdateGradeDto, userId: number, role: string): Promise<Grade> {

        const grade: Grade | null = await gradeRepository.find({ id });

        if (!grade) {
            throw new HttpError(404, "Nota no encontrada");
        }

        if (role === "PROFESSIONAL") {
            const enrollment: StudentSubject | null = await studentRepository.getEnroll(grade.studentSubjectId);
            if (!enrollment) {
                throw new HttpError(404, "La inscripción no existe");
            }
            await this.verifyProfessionalOwnership(enrollment.subjectId, userId);
        }

        const data: Prisma.GradeUncheckedUpdateInput = {};

        if (params.value !== undefined) data.value = params.value;
        if (params.description !== undefined) data.description = params.description;

        try {
            return await gradeRepository.update(id, data);
        } catch (error: unknown) {
            handlePrismaError(error);
        }
    }

    async deleteGrade(id: number, userId: number, role: string): Promise<Grade> {

        const grade: Grade | null = await gradeRepository.find({ id });

        if (!grade) {
            throw new HttpError(404, "Nota no encontrada");
        }

        if (role === "PROFESSIONAL") {
            const enrollment: StudentSubject | null = await studentRepository.getEnroll(grade.studentSubjectId);
            if (!enrollment) {
                throw new HttpError(404, "La inscripción no existe");
            }
            await this.verifyProfessionalOwnership(enrollment.subjectId, userId);
        }

        try {
            return await gradeRepository.delete(id);
        } catch (error: unknown) {
            handlePrismaError(error);
        }
    }

    async getGrades(userId: number, role: string): Promise<Grade[]> {
        if (role === "PROFESSIONAL") {
            return await gradeRepository.getAllByProfessional(userId);
        }
        return await gradeRepository.getAll();
    }

    async getGrade(id: number, userId: number, role: string): Promise<Grade> {

        const grade: Grade | null = await gradeRepository.find({ id });

        if (!grade) {
            throw new HttpError(404, "Nota no encontrada");
        }

        if (role === "PROFESSIONAL") {
            const enrollment: StudentSubject | null = await studentRepository.getEnroll(grade.studentSubjectId);
            if (!enrollment) {
                throw new HttpError(404, "La inscripción no existe");
            }
            await this.verifyProfessionalOwnership(enrollment.subjectId, userId);
        }

        return grade
    }
}

export default new GradeService();