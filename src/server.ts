import app from "./app";
import appConfig from "./config/app.config";

export function startServer() {
    try {
        app.listen(appConfig.PORT, () => {
            console.log(`App iniciada por el puerto ${appConfig.PORT}`);
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
}