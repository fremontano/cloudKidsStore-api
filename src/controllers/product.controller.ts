import type { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ProductModel from "../models/product.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const PRODUCT_UPLOAD_DIR = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../uploads/products",
);

// Convierte details a string[] aunque venga como JSON string desde FormData.
const parseDetails = (value: unknown): string[] => {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof value === "string") {
        try {
            const parsed: unknown = JSON.parse(value);

            if (Array.isArray(parsed)) {
                return parsed.map((item) => String(item).trim()).filter(Boolean);
            }
        } catch {
            // Si no es JSON, se separa por saltos de línea o comas.
        }

        return value
            .split(/\r?\n|,/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
};

const removeLocalProductImage = async (imageUrl?: string): Promise<void> => {
    if (!imageUrl) return;

    const marker = "/uploads/products/";
    const markerIndex = imageUrl.indexOf(marker);

    if (markerIndex === -1) return;

    const filename = path.basename(imageUrl.slice(markerIndex + marker.length));
    const filePath = path.join(PRODUCT_UPLOAD_DIR, filename);

    try {
        await fs.promises.unlink(filePath);
    } catch {
        // Si el archivo no existe o no se puede borrar, se ignora.
    }
};

// @desc    Obtener todos los productos
// @route   GET /api/products
export const getAllProducts = asyncHandler(
    async (_req: Request, res: Response) => {
        const products = await ProductModel.find({});
        res.status(200).json(products);
    },
);

// @desc    Obtener un producto por su id
// @route   GET /api/products/:id
export const getProductById = asyncHandler(
    async (req: Request, res: Response) => {
        const product = await ProductModel.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error("Producto no encontrado");
        }

        res.status(200).json(product);
    },
);

// @desc    Crear un producto
// @route   POST /api/products
export const createProduct = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401);
            throw new Error("No autorizado");
        }

        const { name, image, brand, category, color, colorHex, description, details, price, countInStock } = req.body;

        const product = new ProductModel({
            user: req.user._id,
            name,
            image,
            brand,
            category,
            color,
            colorHex,
            description,
            details: parseDetails(details),
            price,
            countInStock: countInStock || 0,
        });

        const createdProduct = await product.save();

        res.status(201).json({
            message: "Producto creado exitosamente",
            product: createdProduct,
        });
    },
);

// @desc    Actualizar un producto por su id
// @route   PUT /api/products/:id
export const updateProduct = asyncHandler(
    async (req: Request, res: Response) => {
        const product = await ProductModel.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error("Producto no encontrado");
        }

        const { name, image, brand, category, color, colorHex, description, details, price, countInStock } = req.body;
        const previousImage = product.image;

        if (name !== undefined) product.name = name;
        if (image !== undefined) product.image = image;
        if (brand !== undefined) product.brand = brand;
        if (category !== undefined) product.category = category;
        if (color !== undefined) product.color = color;
        if (colorHex !== undefined) product.colorHex = colorHex;
        if (description !== undefined) product.description = description;
        if (details !== undefined) product.details = parseDetails(details);
        if (price !== undefined) product.price = price;
        if (countInStock !== undefined) product.countInStock = countInStock;

        const updatedProduct = await product.save();

        if (image !== undefined && image !== previousImage) {
            await removeLocalProductImage(previousImage);
        }

        res.status(200).json({
            message: "Producto actualizado exitosamente",
            product: updatedProduct,
        });
    },
);

// @desc    Eliminar un producto por su id
// @route   DELETE /api/products/:id
export const deleteProduct = asyncHandler(
    async (req: Request, res: Response) => {
        const product = await ProductModel.findByIdAndDelete(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error("Producto no encontrado");
        }

        await removeLocalProductImage(product.image);

        res.status(200).json({ message: "Producto eliminado" });
    },
);
