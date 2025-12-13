import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Envuelve un controlador para manejar errores asincrónicos.
 * Ejecuta el controlador, si ocurre una excepción, la pasa a `next()`
 * para que sea gestionada por el middleware de errores.
 *
 * @param controller - Función de controlador de Express.
 * @returns Middleware de Express con manejo de errores integrado.
 */
export const asyncHandler = (controller: RequestHandler): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await controller(req, res, next);
        } catch (error: unknown) {
            next(error);
        }
    }
}