import { Prisma, type User } from "@prisma/client";
import { hashPassword } from "../utils/password.utils";
import HttpError from "../errors/HttpError";
import { handlePrismaError } from "../utils/prisma-error.utils";
import userRepository from "../repositories/user.repository";
import type { CreateUserDto } from "../dtos/user.dto";

class UserService {

    async create(params: CreateUserDto): Promise<User> {
        try {
            params.password = await hashPassword(params.password);
            const { name, email, phoneNumber, documentNumber, password, role } = params;
            return await userRepository.create({ name, email, phoneNumber, documentNumber, password, role });

        } catch (error: unknown) {
            handlePrismaError(error);
        }
    }
}

export default new UserService();