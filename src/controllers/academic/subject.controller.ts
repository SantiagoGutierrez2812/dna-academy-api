import type { Request, Response } from "express";
import subjectService from "../../services/academic/subject.service";
import type { Grade, Student, Subject } from "@prisma/client";

class SubjectController {

    async createSubject(req: Request, res: Response): Promise<void> {

        const subject: Subject = await subjectService.createSubject(req.body);

        res.status(201).json({
            message: "Materia creada",
            data: { subject }
        })
    }

    async updateSubject(req: Request, res: Response): Promise<void> {

        const id: number = Number(req.params.id);

        const subject: Subject = await subjectService.updateSubject(id, req.body);

        res.status(200).json({
            message: "Materia actualizada exitosamente",
            data: { subject }
        });
    }

    async deleteSubject(req: Request, res: Response): Promise<void> {

        const id: number = Number(req.params.id);

        const subject: Subject = await subjectService.deleteSubject(id);

        res.status(200).json({
            message: "Materia eliminada exitosamente",
            data: { subject }
        });
    }

    async getSubjects(_req: Request, res: Response): Promise<void> {

        const subjects: Subject[] = await subjectService.getSubjects();

        res.status(200).json({
            message: "Materias obtenidas exitosamente",
            data: { subjects }
        });
    }

    async getMySubjects(req: Request, res: Response): Promise<void> {

        const professionalId: number = req.userId!;

        const subjects: Subject[] = await subjectService.getMySubjects(professionalId);

        res.status(200).json({
            message: "Mis materias obtenidas exitosamente",
            data: { subjects }
        });
    }

    async getSubject(req: Request, res: Response): Promise<void> {

        const id: number = Number(req.params.id);

        const subject: Subject = await subjectService.getSubject(id);

        res.status(200).json({
            message: "Materia obtenida exitosamente",
            data: { subject }
        });
    }

    async getStudents(req: Request, res: Response): Promise<void> {

        const subjectId: number = Number(req.params.id);
        const userId: number = req.userId!;
        const role: string = req.userRole!;

        const students: Student[] = await subjectService.getStudents(subjectId, userId, role);

        res.status(200).json({
            message: "Estudiantes de la materia obtenidos exitosamente",
            data: { students }
        });
    }

    async getStudentGrades(req: Request, res: Response): Promise<void> {

        const subjectId: number = Number(req.params.id);
        const studentId: number = Number(req.params.studentId);
        const userId: number = req.userId!;
        const role: string = req.userRole!;

        const grades: Grade[] = await subjectService.getStudentGrades(subjectId, studentId, userId, role);

        res.status(200).json({
            message: "Notas del estudiante obtenidas exitosamente",
            data: { grades }
        });
    }
}

export default new SubjectController();