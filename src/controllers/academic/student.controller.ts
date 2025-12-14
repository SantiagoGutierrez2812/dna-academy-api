import type { Request, Response } from "express";
import studentService from "../../services/academic/student.service";
import type { Student, StudentSubject } from "@prisma/client";
import type { UpdateStudentDto } from "../../dtos/academic/student.dto";

class StudentController {

    async createStudent(req: Request, res: Response): Promise<void> {

        const student: Student = await studentService.createStudent({ ...req.body, createdBy: req.userId });

        res.status(201).json({
            message: "Estudiante creado exitosamente",
            data: { student }
        })
    }

    async updateStudent(req: Request, res: Response): Promise<void> {

        const id: number = Number(req.params.id);

        const student: Student = await studentService.updateStudent(id, req.body);

        res.status(200).json({
            message: "Estudiante actualizado exitosamente",
            data: { student }
        });
    }

    async deleteStudent(req: Request, res: Response): Promise<void> {

        const id: number = Number(req.params.id);

        const student: Student = await studentService.deleteStudent(id);

        res.status(200).json({
            message: "Estudiante eliminado exitosamente",
            data: { student }
        });
    }

    async getStudents(_req: Request, res: Response): Promise<void> {

        const students: Student[] = await studentService.getStudents();

        res.status(200).json({
            message: "Estudiantes obtenidos exitosamente",
            data: { students }
        });
    }

    async getStudent(req: Request, res: Response): Promise<void> {

        const id: number = Number(req.params.id);

        const student: Student = await studentService.getStudent(id);

        res.status(200).json({
            message: "Estudiante obtenido exitosamente",
            data: { student }
        });
    }

    async enrollSubject(req: Request, res: Response): Promise<void> {

        const studentId: number = Number(req.params.id);

        const { subjectId } = req.body;

        const enrollment: StudentSubject = await studentService.enrollSubject({ studentId, subjectId });

        res.status(201).json({
            message: "Inscripción realizada exitosamente",
            data: { enrollment }
        });
    }

    async getSubjects(req: Request, res: Response): Promise<void> {

        const id: number = Number(req.params.id);

        const studentSubjects: StudentSubject[] = await studentService.getSubjects(id);

        res.status(200).json({
            message: "Materias del estudiante obtenidas exitosamente",
            data: { studentSubjects }
        });
    }

    async unenrollSubject(req: Request, res: Response): Promise<void> {

        const studentId: number = Number(req.params.id);
        const subjectId: number = Number(req.params.subjectId);

        const enrollment: StudentSubject = await studentService.unenrollSubject({ studentId, subjectId });

        res.status(200).json({
            message: "Desinscripción realizada exitosamente",
            data: { enrollment }
        });
    }
}

export default new StudentController();