import type { Request, Response } from "express";
import type { Country } from "@prisma/client";
import countryRepository from "../repositories/country.repository";

class CountryController {

    async getCountries(_req: Request, res: Response): Promise<void> {

        const countries: Country[] = await countryRepository.getAll();

        res.status(200).json({
            message: "Países obtenidos exitosamente",
            data: { countries }
        });
    }
}

export default new CountryController();
