import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

// Middleware que finaliza la cadena de validación.
// Si hay errores responde 400 con el detalle, si no continúa al controlador.
export const validateFields = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
