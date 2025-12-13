import type { Prisma, User } from "@prisma/client";
import { prisma } from "../configs/database";


class UserRepository {

    OMIT_SENSITIVE_DATA = { password: true };

    async create(params: Prisma.UserCreateInput): Promise<User> {
        return await prisma.user.create({
            data: params,
            omit: this.OMIT_SENSITIVE_DATA
        });
    }
}

export default new UserRepository();