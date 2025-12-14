import type { Grade, Prisma, StudentSubject } from "@prisma/client";
import { handlePrismaError } from "../../utils/prisma-error.utils";
import HttpError from "../../errors/HttpError";
import type { CreateGradeDto, UpdateGradeDto } from "../../dtos/academic/grade.dto";
import gradeRepository from "../../repositories/academic/grades.repository";
import studentRepository from "../../repositories/academic/student.repository";

class GradeService {

    async createGrade(params: CreateGradeDto): Promise<Grade> {

        const { studentSubjectId, value, description } = params

        const enrollment: StudentSubject | null = await studentRepository.getEnroll(studentSubjectId);

        if (!enrollment) {
            throw new HttpError(404, "La inscripción ingresada no existe");
        }

        try {
            return await gradeRepository.create({ studentSubjectId, value, description });
        } catch (error: unknown) {
            handlePrismaError(error);
        }
    }

    async updateGrade(id: number, params: UpdateGradeDto): Promise<Grade> {

        const data: Prisma.GradeUncheckedUpdateInput = {};

        if (params.value !== undefined) data.value = params.value;
        if (params.description !== undefined) data.description = params.description;

        try {
            return await gradeRepository.update(id, data);
        } catch (error: unknown) {
            handlePrismaError(error);
        }
    }

    async deleteGrade(id: number): Promise<Grade> {
        try {
            return await gradeRepository.delete(id);
        } catch (error: unknown) {
            handlePrismaError(error);
        }
    }

    async getGrades(): Promise<Grade[]> {
        return await gradeRepository.getAll();
    }

    async getGrade(id: number): Promise<Grade> {

        const grade: Grade | null = await gradeRepository.find({ id });

        if (!grade) {
            throw new HttpError(404, "Nota no encontrada");
        }

        return grade
    }
}

export default new GradeService();