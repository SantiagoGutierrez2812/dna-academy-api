import app from "./app";
import appConfig from "./config/app.config";
import { connectDB, disconnectDB } from "./config/database";

export function startServer() {
    try {

        connectDB();
        console.log("Conexión a la bd exitosa");

        app.listen(appConfig.PORT, () => {
            console.log(`App iniciada por el puerto ${appConfig.PORT}`);
        });

    } catch (error: unknown) {
        console.log(error);
        process.exit(1);
    }
}

// Manejo de señales de terminación
const gracefulShutdown = async () => {
    await disconnectDB();
    process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);