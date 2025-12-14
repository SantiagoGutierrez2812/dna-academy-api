import type { Request, Response } from "express";
import type { User } from "@prisma/client";
import userService from "../services/user.service";

class UserController {

    async createUser(req: Request, res: Response): Promise<void> {

        const user: User = await userService.create(req.body);

        res.status(201).json({
            message: "Usuario creado exitosamente",
            data: { user }
        });
    }

    async getUsers(_req: Request, res: Response): Promise<void> {

        const users: User[] = await userService.getUsers();

        res.status(200).json({
            message: "Usuarios obtenidos exitosamente",
            data: { users }
        });
    }

    async getUser(req: Request, res: Response): Promise<void> {

        const id: number = Number(req.params.id);

        const user: User = await userService.getUser(id);

        res.status(200).json({
            message: "Usuario obtenido exitosamente",
            data: { user }
        });
    }

    async updateUser(req: Request, res: Response): Promise<void> {

        const id: number = Number(req.params.id);

        const user: User = await userService.updateUser(id, req.body);

        res.status(200).json({
            message: "Usuario actualizado exitosamente",
            data: { user }
        });
    }

    async deleteUser(req: Request, res: Response): Promise<void> {

        const id: number = Number(req.params.id);

        const user: User = await userService.deleteUser(id);

        res.status(200).json({
            message: "Usuario eliminado exitosamente",
            data: { user }
        });
    }
}

export default new UserController();