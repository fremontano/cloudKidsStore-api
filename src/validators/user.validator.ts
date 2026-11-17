import { body } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";

const nameRule = () =>
    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre es obligatorio")
        .isLength({ max: 98 })
        .withMessage("El nombre no puede superar los 98 caracteres");

const emailRule = () =>
    body("email")
        .trim()
        .notEmpty()
        .withMessage("El email es obligatorio")
        .isEmail()
        .withMessage("El email no es válido")
        .normalizeEmail();

const passwordRule = () =>
    body("password").notEmpty().withMessage("La contraseña es obligatoria");

const newPasswordRule = () =>
    passwordRule()
        .isLength({ min: 6 })
        .withMessage("La contraseña debe tener al menos 6 caracteres")
        .matches(/[a-z]/)
        .withMessage("La contraseña debe incluir al menos una letra minúscula")
        .matches(/[A-Z]/)
        .withMessage("La contraseña debe incluir al menos una letra mayúscula");

// Validador para REGISTRAR un usuario.
export const registerUserValidator = [
    nameRule(),
    emailRule(),
    newPasswordRule(),
    validateFields,
];

// Validador para ACTUALIZAR el perfil.
export const updateProfileValidator = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("El nombre no puede estar vacío"),
    body("email")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("El email no puede estar vacío")
        .isEmail()
        .withMessage("El email no es válido")
        .normalizeEmail(),
    validateFields,
];

// Validador para SOLICITAR el OTP de recuperación (sin sesión).
export const forgotPasswordRequestValidator = [
    emailRule(),
    validateFields,
];

// Validador para RESTABLECER la contraseña con OTP (sin sesión).
export const forgotPasswordResetValidator = [
    emailRule(),
    body("otp")
        .trim()
        .isNumeric()
        .withMessage("El código debe contener solo números")
        .isLength({ min: 6, max: 6 })
        .withMessage("El código debe tener 6 dígitos"),
    body("newPassword")
        .notEmpty()
        .withMessage("La nueva contraseña es obligatoria")
        .isLength({ min: 6 })
        .withMessage("La nueva contraseña debe tener al menos 6 caracteres")
        .matches(/[a-z]/)
        .withMessage("La contraseña debe incluir al menos una letra minúscula")
        .matches(/[A-Z]/)
        .withMessage("La contraseña debe incluir al menos una letra mayúscula"),
    validateFields,
];

// Validador para CAMBIAR la contraseña con código OTP.
export const verifyPasswordOtpValidator = [
    body("otp")
        .trim()
        .isNumeric()
        .withMessage("El código debe contener solo números")
        .isLength({ min: 6, max: 6 })
        .withMessage("El código debe tener 6 dígitos"),
    body("newPassword")
        .notEmpty()
        .withMessage("La nueva contraseña es obligatoria")
        .isLength({ min: 6 })
        .withMessage("La nueva contraseña debe tener al menos 6 caracteres"),
    validateFields,
];

// Validador para INICIAR sesión.
export const loginUserValidator = [
    emailRule(),
    passwordRule(),
    validateFields,
];
