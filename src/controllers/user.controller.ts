import type { Request, Response } from "express";
import type { User } from "@prisma/client";
import userService from "../services/user.service";

class UserController {

    create = async (req: Request, res: Response): Promise<void> => {

        const user: User = await userService.create(req.body);

        res.status(201).json({
            message: `${user.role} creado exitosamente`
        });
    }
}

export default new UserController();