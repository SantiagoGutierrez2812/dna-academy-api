import "dotenv/config";  // Carga variables de entorno
import countryRepository from "../src/repositories/country.repository"
import { prisma } from "../src/configs/database";

// Semilla que llama a la API externa restcountries y guarda todos los países en la bd.
async function seedCountries() {

    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2");

    const countries = await response.json();

    for (const country of countries) {
        await countryRepository.upsert({
            name: country.name.common,
            code: country.cca2
        });
    }

    console.log(`${countries.length} países insertados`);
}

async function main() {
    await seedCountries()
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect()); 