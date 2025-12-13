import type { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
    status?: number,
}

export const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {

    res.status(error.status || 500).json({
        message: error.message || "Error interno del servidor"
    });
}