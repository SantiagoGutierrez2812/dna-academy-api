import express from "express"
import type { Request, Response } from "express"
import routes from "./routes/index"
import { errorHandler } from "./middlewares/errorHandler";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import appConfig from "./configs/app.config";

const app = express();

app.use(cors({
    origin: appConfig.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use(cookieParser());

app.use("/api", routes);

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        message: "OK"
    });
});

app.use(errorHandler);

export default app;