import multer from "multer";
import type { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "../../uploads/profiles");
const productUploadDir = path.resolve(__dirname, "../../uploads/products");

fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(productUploadDir, { recursive: true });

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
};

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = ALLOWED_IMAGE_TYPES[file.mimetype] ?? ".jpg";
        cb(null, `${crypto.randomUUID()}${ext}`);
    },
});

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
) => {
    if (!ALLOWED_IMAGE_TYPES[file.mimetype]) {
        cb(new Error("Solo se permiten imágenes JPG, PNG, WEBP o GIF"));
        return;
    }

    cb(null, true);
};

export const uploadProfileImage = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
}).single("image");

const productStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, productUploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = ALLOWED_IMAGE_TYPES[file.mimetype] ?? ".jpg";
        cb(null, `${crypto.randomUUID()}${ext}`);
    },
});

const productUpload = multer({
    storage: productStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

// Acepta multipart/form-data con el archivo en el campo "image" y convierte
// la ruta del archivo en una URL pública. Si no hay archivo, se conserva
// el valor de "image" enviado en el body (por ejemplo, una URL externa).
export const uploadProductImage = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    productUpload.single("image")(req, res, (error: unknown) => {
        if (error) {
            next(error);
            return;
        }

        if (req.file) {
            req.body = req.body ?? {};
            req.body.image = `${req.protocol}://${req.get("host")}/uploads/products/${req.file.filename}`;
        }

        next();
    });
};
