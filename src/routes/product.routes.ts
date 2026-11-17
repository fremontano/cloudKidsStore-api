import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/product.controller.js";
import {
    productIdValidator,
    createProductValidator,
    updateProductValidator,
} from "../validators/product.validator.js";
import { admin, protect } from "../middlewares/authMiddleware.js";
import { uploadProductImage } from "../middlewares/uploadMiddleware.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", productIdValidator, getProductById);
router.post(
    "/",
    protect,
    admin,
    uploadProductImage,
    createProductValidator,
    createProduct,
);
router.put(
    "/:id",
    protect,
    admin,
    uploadProductImage,
    updateProductValidator,
    updateProduct,
);
router.delete("/:id", protect, admin, productIdValidator, deleteProduct);

export default router;
