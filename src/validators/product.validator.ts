import { body, param } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";

// Reglas comunes reutilizables, un fragmento por campo.
const productRules = {
    name: body("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
    image: body("image").trim().notEmpty().withMessage("La imagen es obligatoria"),
    brand: body("brand").trim().notEmpty().withMessage("La marca es obligatoria"),
    category: body("category").trim().notEmpty().withMessage("La categoría es obligatoria"),
    color: body("color").trim().notEmpty().withMessage("El color es obligatorio"),
    colorHex: body("colorHex")
        .optional()
        .trim()
        .matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
        .withMessage("colorHex debe ser un color hexadecimal valido"),
    description: body("description").trim().notEmpty().withMessage("La descripción es obligatoria"),

    price: body("price")
        .isFloat({ min: 0 })
        .withMessage("El precio debe ser un número mayor o igual a 0"),

    countInStock: body("countInStock")
        .isInt({ min: 0 })
        .withMessage("countInStock debe ser un entero mayor o igual a 0"),

    // Acepta un array (JSON) o un JSON string enviado desde FormData.
    details: body("details")
        .optional()
        .custom((value: unknown) => {
            if (Array.isArray(value)) return true;
            if (typeof value !== "string") return false;

            try {
                return Array.isArray(JSON.parse(value));
            } catch {
                return false;
            }
        })
        .withMessage("details debe ser un array de strings"),
};

// Valida solo el :id de la ruta (GET y DELETE).
export const productIdValidator = [
    param("id").isMongoId().withMessage("ID de producto no válido"),
    validateFields,
];

// Validador para CREAR (todos los campos obligatorios).
export const createProductValidator = [
    productRules.name,
    productRules.image,
    productRules.brand,
    productRules.category,
    productRules.color,
    productRules.colorHex,
    productRules.description,
    productRules.price,
    productRules.countInStock.optional(),
    productRules.details,
    validateFields,
];

// Validador para ACTUALIZAR (campos opcionales, actualización parcial).
export const updateProductValidator = [
    param("id").isMongoId().withMessage("ID de producto no válido"),
    productRules.name.optional(),
    productRules.image.optional(),
    productRules.brand.optional(),
    productRules.category.optional(),
    productRules.color.optional(),
    productRules.colorHex.optional(),
    productRules.description.optional(),
    productRules.price.optional(),
    productRules.countInStock.optional(),
    productRules.details,
    validateFields,
];
