import type {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";

type Handler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<void> | void;

// Envuelve un handler async: si la promesa se rechaza,
// el error pasa a next() y llega al error handler de Express.
const asyncHandler =
    (fn: Handler): RequestHandler =>
        (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };

export default asyncHandler;
