import type { Country, Prisma } from "@prisma/client";
import { prisma } from "../configs/database";

class CountryRepository {

    async findUnique(param: Prisma.CountryWhereUniqueInput): Promise<Country | null> {
        return await prisma.country.findUnique({
            where: param
        });
    }

    async upsert(params: Prisma.CountryCreateInput): Promise<Country> {
        return await prisma.country.upsert({
            where: { code: params.code },
            create: params,
            update: params
        });
    }

    async getAll(): Promise<Country[]> {
        return await prisma.country.findMany({
            orderBy: { name: "asc" }
        });
    }
}

export default new CountryRepository();