import type { Request, Response } from "express";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import asyncHandler from "../middlewares/asyncHandler.js";
import UserModel, { DEFAULT_AVATAR } from "../models/user.model.js";
import { sendPasswordOtpEmail } from "../services/email.service.js";
import jwt from "jsonwebtoken";

const OTP_TTL_MS = 10 * 60 * 1000;

const UPLOAD_DIR = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../uploads/profiles",
);

const removeLocalImage = async (imageUrl?: string): Promise<void> => {
    if (!imageUrl) return;

    const marker = "/uploads/profiles/";
    const markerIndex = imageUrl.indexOf(marker);

    if (markerIndex === -1) return;

    const filename = path.basename(imageUrl.slice(markerIndex + marker.length));
    const filePath = path.join(UPLOAD_DIR, filename);

    try {
        await fs.promises.unlink(filePath);
    } catch {
        // Si el archivo no existe o no se puede borrar, se ignora.
    }
};

// @desc    Auth user y Get token
// @route   POST /api/users/login
export const authUser = asyncHandler(async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error("Credenciales inválidas");
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        res.status(500);
        throw new Error("JWT_SECRET no definido");
    }

    const token = jwt.sign({ userId: user._id.toString() }, secret, {
        expiresIn: "30d", // Coherente con la duracion de la cookie
    });

    // Guardar el JWT en una HTTP-Only cookie de forma segura
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // 'development' corregido y adaptado a producción
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días en milisegundos
    });

    // Se retorna el token ademas de la cookie para clientes que usan Bearer.
    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image ?? DEFAULT_AVATAR,
        isAdmin: user.isAdmin,
        token,
    });
});


// @desc    Registrar un usuario
// @route   POST /api/users/register
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const userExists = await UserModel.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("El usuario ya existe");
    }

    const user = await UserModel.create({ name, email, password });

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        res.status(500);
        throw new Error("JWT_SECRET no definido");
    }

    const token = jwt.sign({ userId: user._id.toString() }, secret, {
        expiresIn: "30d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image ?? DEFAULT_AVATAR,
        isAdmin: user.isAdmin,
    });
});

// @desc    Cerrar sesión del usuario (elimina la cookie jwt)
// @route   POST /api/users/logout
export const logoutUser = asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json({ message: "Sesión cerrada correctamente" });
});

// @desc    Enviar un código OTP al email del usuario autenticado
// @route   POST /api/users/profile/password/request-otp
export const requestPasswordOtp = asyncHandler(
    async (req: Request, res: Response) => {
        const user = await UserModel.findById(req.user?._id);

        if (!user) {
            res.status(404);
            throw new Error("Usuario no encontrado");
        }

        const otp = crypto.randomInt(100000, 1000000).toString();

        // Se guarda el OTP generado junto con su fecha de expiración.
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + OTP_TTL_MS);
        await user.save();

        await sendPasswordOtpEmail(user.email, otp);

        res.status(200).json({ message: "Código de verificación enviado al correo" });
    },
);

// @desc    Verificar el código OTP y cambiar la contraseña
// @route   POST /api/users/profile/password/verify-otp
export const verifyPasswordOtp = asyncHandler(
    async (req: Request, res: Response) => {
        const { otp, newPassword } = req.body;

        const user = await UserModel.findById(req.user?._id).select("+otp");

        if (!user) {
            res.status(404);
            throw new Error("Usuario no encontrado");
        }

        const isExpired =
            !user.otpExpires || user.otpExpires.getTime() < Date.now();

        if (!user.otp || isExpired || user.otp !== otp) {
            res.status(400);
            throw new Error("El código no es válido o ha expirado");
        }

        user.password = newPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Contraseña actualizada correctamente" });
    },
);

// @desc    Solicitar OTP para restablecer contraseña (sin sesión)
// @route   POST /api/users/forgot-password/request-otp
export const requestForgotPasswordOtp = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            res.status(404);
            throw new Error("No existe una cuenta con ese correo");
        }

        const otp = crypto.randomInt(100000, 1000000).toString();

        user.otp = otp;
        user.otpExpires = new Date(Date.now() + OTP_TTL_MS);
        await user.save();

        await sendPasswordOtpEmail(user.email, otp);

        res.status(200).json({ message: "Código de verificación enviado al correo" });
    },
);

// @desc    Restablecer contraseña con OTP (sin sesión)
// @route   POST /api/users/forgot-password/verify-otp
export const resetForgotPassword = asyncHandler(
    async (req: Request, res: Response) => {
        const { email, otp, newPassword } = req.body;

        const user = await UserModel.findOne({ email }).select("+otp");

        if (!user) {
            res.status(404);
            throw new Error("No existe una cuenta con ese correo");
        }

        const isExpired =
            !user.otpExpires || user.otpExpires.getTime() < Date.now();

        if (!user.otp || isExpired || user.otp !== otp) {
            res.status(400);
            throw new Error("El código no es válido o ha expirado");
        }

        user.password = newPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Contraseña actualizada correctamente" });
    },
);

// @desc    Obtener el perfil del usuario autenticado
// @route   GET /api/users/check-status-profile
export const userProfile = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(404);
            throw new Error("Usuario no encontrado");
        }

        res.status(200).json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            image: req.user.image ?? DEFAULT_AVATAR,
            isAdmin: req.user.isAdmin,
        });
    },
);

// @desc    Actualizar el perfil del usuario autenticado
// @route   PUT /api/users/profile
export const updateUserProfile = asyncHandler(
    async (req: Request, res: Response) => {
        const user = await UserModel.findById(req.user?._id);

        if (!user) {
            res.status(404);
            throw new Error("Usuario no encontrado");
        }

        // Se permite actualizar el nombre y el email. La contraseña
        // y los permisos de administrador no se modifican desde aquí.
        const { name, email } = req.body;

        if (name !== undefined) {
            user.name = name;
        }

        if (email !== undefined && email !== user.email) {
            const emailInUse = await UserModel.findOne({
                email,
                _id: { $ne: user._id },
            });

            if (emailInUse) {
                res.status(400);
                throw new Error("El email ya está en uso");
            }

            user.email = email;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            image: updatedUser.image ?? DEFAULT_AVATAR,
            isAdmin: updatedUser.isAdmin,
        });
    },
);

// @desc    Subir/actualizar la imagen de perfil del usuario autenticado
// @route   PUT /api/users/profile/image
export const updateProfileImage = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.file) {
            res.status(400);
            throw new Error("No se subió ninguna imagen");
        }

        const user = await UserModel.findById(req.user?._id);

        if (!user) {
            await fs.promises.unlink(req.file.path).catch(() => { });
            res.status(404);
            throw new Error("Usuario no encontrado");
        }

        const image = `${req.protocol}://${req.get("host")}/uploads/profiles/${req.file.filename}`;

        await removeLocalImage(user.image);

        user.image = image;
        await user.save();

        res.status(200).json({
            message: "Imagen de perfil actualizada correctamente",
            image,
        });
    },
);




