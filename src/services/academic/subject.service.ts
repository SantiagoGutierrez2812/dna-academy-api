import type { Grade, Prisma, Student, Subject, User } from "@prisma/client";
import type { CreateSubjectDto, UpdateSubjectDto } from "../../dtos/academic/subject.dto";
import subjectRepository from "../../repositories/academic/subjects.repository";
import { handlePrismaError } from "../../utils/prisma-error.utils";
import userRepository from "../../repositories/user.repository";
import HttpError from "../../errors/HttpError";

class SubjectService {

    async createSubject(params: CreateSubjectDto): Promise<Subject> {

        const { name, professionalId } = params

        const professional: User | null = await userRepository.find({ id: professionalId });

        if (!professional) {
            throw new HttpError(404, "No existe el profesional ingresado");
        }

        try {
            return await subjectRepository.create({ name, professionalId });
        } catch (error: unknown) {
            handlePrismaError(error);
        }
    }

    async updateSubject(id: number, params: UpdateSubjectDto): Promise<Subject> {

        const data: Prisma.SubjectUncheckedUpdateInput = {};

        if (params.name !== undefined) data.name = params.name;
        if (params.professionalId !== undefined) data.professionalId = params.professionalId;

        try {
            return await subjectRepository.update(id, data);
        } catch (error: unknown) {
            handlePrismaError(error);
        }
    }

    async deleteSubject(id: number): Promise<Subject> {
        try {
            return await subjectRepository.delete(id);
        } catch (error: unknown) {
            handlePrismaError(error);
        }
    }

    async getSubjects(): Promise<Subject[]> {
        return await subjectRepository.getSubjects();
    }

    async getMySubjects(professionalId: number): Promise<Subject[]> {
        return await subjectRepository.getSubjectsByProfessionalId(professionalId);
    }

    async getSubject(id: number): Promise<Subject> {

        const subject: Subject | null = await subjectRepository.find({ id });

        if (!subject) {
            throw new HttpError(404, "Materia no encontrada");
        }

        return subject
    }

    async getStudents(subjectId: number): Promise<Student[]> {

        const subject: Subject | null = await subjectRepository.find({ id: subjectId });

        if (!subject) {
            throw new HttpError(404, "Materia no encontrada");
        }

        return await subjectRepository.getStudentsBySubjectId(subjectId);
    }

    async getStudentGrades(subjectId: number, studentId: number): Promise<Grade[]> {

        const subject: Subject | null = await subjectRepository.find({ id: subjectId });

        if (!subject) {
            throw new HttpError(404, "Materia no encontrada");
        }

        return await subjectRepository.getStudentGrades(subjectId, studentId);
    }
}

export default new SubjectService();