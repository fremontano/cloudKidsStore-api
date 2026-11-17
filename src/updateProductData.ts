import mongoose from "mongoose";
import dotenv from "dotenv";
import UserModel from "./models/user.model.js";
import ProductModel from "./models/product.model.js";
import { connectDB } from "./config/db.js";
import { seedProducts } from "./data/products.seed.js";

dotenv.config();

// Actualiza los productos existentes sin borrar usuarios ni ordenes.
const run = async (): Promise<void> => {
    try {
        await connectDB();

        const admin = await UserModel.findOne({ isAdmin: true });
        const demo = await UserModel.findOne({ email: "demo@coolkid.cl" });
        const reviewer = demo ?? admin;

        if (!reviewer) {
            throw new Error(
                "Necesitas al menos un usuario para asociar las reseñas.",
            );
        }

        const reviewers = [reviewer, admin ?? reviewer];
        let updated = 0;

        for (const [productIndex, seed] of seedProducts.entries()) {
            const reviews = seed.reviews.map((review, reviewIndex) => {
                const reviewUser =
                    reviewers[
                    (productIndex + reviewIndex) % reviewers.length
                    ] ?? reviewer;

                return {
                    user: reviewUser._id,
                    name: review.name,
                    rating: review.rating,
                    comment: review.comment,
                };
            });

            const numReviews = reviews.length;
            const rating = numReviews
                ? Number(
                    (
                        reviews.reduce(
                            (sum, review) => sum + review.rating,
                            0,
                        ) / numReviews
                    ).toFixed(1),
                )
                : 0;

            const result = await ProductModel.updateOne(
                { name: seed.name },
                {
                    $set: {
                        image: seed.image,
                        brand: seed.brand,
                        category: seed.category,
                        color: seed.color,
                        colorHex: seed.colorHex,
                        description: seed.description,
                        details: seed.details,
                        price: seed.price,
                        countInStock: seed.countInStock,
                        reviews,
                        numReviews,
                        rating,
                    },
                },
            );

            updated += result.modifiedCount;
        }

        console.log(`Productos actualizados: ${updated}`);
        await mongoose.connection.close();
    } catch (error) {
        console.error("Error al actualizar productos:", error);
        process.exitCode = 1;
    }
};

void run();
