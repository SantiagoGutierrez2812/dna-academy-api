import type { UserRole } from "@prisma/client";

export interface CreateUserDto {
    name: string,
    email: string;
    phoneNumber: string;
    documentNumber: string;
    password: string;
    role: UserRole;
}