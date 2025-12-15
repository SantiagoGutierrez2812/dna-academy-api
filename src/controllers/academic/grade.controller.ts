import type { Request, Response } from "express";
import gradeService from "../../services/academic/grades.service";
import type { Grade } from "@prisma/client";

class GradeController {

    async createGrade(req: Request, res: Response): Promise<void> {

        const userId: number = req.userId!;
        const role: string = req.userRole!;

        const grade: Grade = await gradeService.createGrade(req.body, userId, role);

        res.status(201).json({
            message: "Nota creada exitosamente",
            data: { grade }
        })
    }

    async updateGrade(req: Request, res: Response): Promise<void> {

        const id: number = Number(req.params.id);
        const userId: number = req.userId!;
        const role: string = req.userRole!;

        const grade: Grade = await gradeService.updateGrade(id, req.body, userId, role);

        res.status(200).json({
            message: "Nota actualizada exitosamente",
            data: { grade }
        });
    }

    async deleteGrade(req: Request, res: Response): Promise<void> {

        const id: number = Number(req.params.id);
        const userId: number = req.userId!;
        const role: string = req.userRole!;

        const grade: Grade = await gradeService.deleteGrade(id, userId, role);

        res.status(200).json({
            message: "Nota eliminada exitosamente",
            data: { grade }
        });
    }

    async getGrades(req: Request, res: Response): Promise<void> {

        const userId: number = req.userId!;
        const role: string = req.userRole!;

        const grades: Grade[] = await gradeService.getGrades(userId, role);

        res.status(200).json({
            message: "Notas obtenidas exitosamente",
            data: { grades }
        });
    }

    async getGrade(req: Request, res: Response): Promise<void> {

        const id: number = Number(req.params.id);
        const userId: number = req.userId!;
        const role: string = req.userRole!;

        const grade: Grade = await gradeService.getGrade(id, userId, role);

        res.status(200).json({
            message: "Nota obtenida exitosamente",
            data: { grade }
        });
    }
}

export default new GradeController();
