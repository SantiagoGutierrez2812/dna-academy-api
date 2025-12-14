import type { Prisma, Student, StudentSubject, Subject, User } from "@prisma/client";
import type { CreateStudentDto, StudentSubjectDto, UpdateStudentDto } from "../../dtos/academic/student.dto";
import studentRepository from "../../repositories/academic/student.repository";
import { handlePrismaError } from "../../utils/prisma-error.utils";
import HttpError from "../../errors/HttpError";
import userRepository from "../../repositories/user.repository";
import subjectsRepository from "../../repositories/academic/subjects.repository";

class StudentService {

    async createStudent(params: CreateStudentDto): Promise<Student> {

        const { name, email, countryId, documentNumber, createdBy } = params;

        const user: User | null = await userRepository.find({ id: createdBy });

        if (!user) {
            throw new HttpError(400, "El usuario creador no existe");
        }
        try {
            return await studentRepository.create({ name, email, countryId, documentNumber, createdBy });
        } catch (error: unknown) {
            handlePrismaError(error);
        }
    }

    async updateStudent(id: number, params: UpdateStudentDto): Promise<Student> {
        const data: Prisma.StudentUncheckedUpdateInput = {};

        if (params.name !== undefined) data.name = params.name;
        if (params.email !== undefined) data.email = params.email;
        if (params.countryId !== undefined) data.countryId = params.countryId;
        if (params.documentNumber !== undefined) data.documentNumber = params.documentNumber;

        try {
            return await studentRepository.update(id, data);
        } catch (error: unknown) {
            handlePrismaError(error);
        }
    }

    async deleteStudent(id: number): Promise<Student> {
        try {
            return await studentRepository.delete(id);
        } catch (error: unknown) {
            handlePrismaError(error);
        }
    }

    async getStudents(): Promise<Student[]> {
        return await studentRepository.getStudents();
    }

    async getStudent(id: number): Promise<Student> {

        const student: Student | null = await studentRepository.find({ id });

        if (!student) {
            throw new HttpError(404, "Estudiante no encontrado");
        }

        return student;
    }

    async enrollSubject(params: StudentSubjectDto): Promise<StudentSubject> {

        const student: Student | null = await studentRepository.find({ id: params.studentId });

        if (!student) {
            throw new HttpError(400, "El estudiante no existe");
        }

        const subject: Subject | null = await subjectsRepository.find({ id: params.subjectId });

        if (!subject) {
            throw new HttpError(400, "La materia no existe");
        }

        try {
            return await studentRepository.enroll({ studentId: params.studentId, subjectId: params.subjectId });
        } catch (error: unknown) {
            handlePrismaError(error);
        }
    }

    async getSubjects(studentId: number): Promise<StudentSubject[]> {
        return await studentRepository.getSubjectsByStudentId(studentId);
    }

    async unenrollSubject(params: StudentSubjectDto): Promise<StudentSubject> {
        try {
            return await studentRepository.unroll(params.studentId, params.subjectId);
        } catch (error: unknown) {
            handlePrismaError(error);
        }
    }
}

export default new StudentService();