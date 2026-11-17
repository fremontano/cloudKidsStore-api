import type { Request, Response, NextFunction } from "express";

//  Middleware para rutas no encontradas (404)
const notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

//  Middleware global para manejo de errores
const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Comprobar si es un error de Mongoose por un ID con formato inválido
    if (err.name === "CastError" && err.kind === "ObjectId") {
        message = "Resource not found";
        statusCode = 404;
    }

    res.status(statusCode).json({
        message,
        // Si esta en producción no muestra el stack trace (muestra null), si está en desarrollo muestra err.stack
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

export { notFound, errorHandler };
