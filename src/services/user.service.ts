import { Prisma, type User } from "@prisma/client";
import { hashPassword } from "../utils/password.utils";
import HttpError from "../errors/HttpError";
import { handlePrismaError } from "../utils/prisma-error.utils";
import userRepository from "../repositories/user.repository";
import type { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";

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

    async getUsers(): Promise<User[]> {
        return await userRepository.getAll();
    }

    async getUser(id: number): Promise<User> {
        const user: User | null = await userRepository.find({ id });

        if (!user) {
            throw new HttpError(404, "Usuario no encontrado");
        }

        return user;
    }

    async updateUser(id: number, params: UpdateUserDto): Promise<User> {
        const data: Prisma.UserUncheckedUpdateInput = {};

        if (params.name !== undefined) data.name = params.name;
        if (params.email !== undefined) data.email = params.email;
        if (params.phoneNumber !== undefined) data.phoneNumber = params.phoneNumber;
        if (params.documentNumber !== undefined) data.documentNumber = params.documentNumber;
        if (params.role !== undefined) data.role = params.role;
        if (params.active !== undefined) data.active = params.active;

        if (params.password !== undefined) {
            data.password = await hashPassword(params.password);
        }

        try {
            return await userRepository.update(id, data);
        } catch (error: unknown) {
            handlePrismaError(error);
        }
    }

    async deleteUser(id: number): Promise<User> {
        try {
            return await userRepository.delete(id);
        } catch (error: unknown) {
            handlePrismaError(error);
        }
    }
}

export default new UserService();