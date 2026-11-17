import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import asyncHandler from "./asyncHandler.js";

interface JwtPayload {
    userId: string;
}

// Verifica el JWT (cookie o Bearer) y adjunta el usuario a req.user.
export const protect = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        let token: string | undefined;

        if (req.cookies?.jwt) {
            token = req.cookies.jwt;
        } else if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            res.status(401);
            throw new Error("No autorizado, no hay token");
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            res.status(500);
            throw new Error("JWT_SECRET no definido");
        }

        let decoded: JwtPayload;

        try {
            decoded = jwt.verify(token, secret) as JwtPayload;
        } catch {
            res.status(401);
            throw new Error("No autorizado, token inválido");
        }

        const user = await UserModel.findById(decoded.userId).select('-password');

        if (!user) {
            res.status(401);
            throw new Error("No autorizado, usuario no encontrado");
        }

        req.user = user;
        next();
    },
);

// Permite el acceso solo a administradores (usar despues de protect).
export const admin = (req: Request, res: Response, next: NextFunction,): void => {
    if (req.user?.isAdmin) {
        next();
        return;
    }

    res.status(403);
    next(new Error("Acceso denegado, se requiere administrador"));
};
