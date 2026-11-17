import mongoose from "mongoose";
import dotenv from "dotenv";
import UserModel from "./models/user.model.js";
import ProductModel from "./models/product.model.js";
import { connectDB } from "./config/db.js";
import { seedProducts } from "./data/products.seed.js";

dotenv.config();

// Borra todos los datos de las colecciones.
const destroyData = async (): Promise<void> => {
    await Promise.all([
        UserModel.deleteMany({}),
        ProductModel.deleteMany({}),
    ]);
    console.log("Datos eliminados");
};

// Inserta usuarios de prueba y productos con detalles, colores y reseñas.
const importData = async (): Promise<void> => {
    await destroyData();

    const admin = await UserModel.create({
        name: "Admin CoolKid",
        email: "admin@coolkid.cl",
        password: "1234567",
        isAdmin: true,
    });

    const demo = await UserModel.create({
        name: "Usuario Demo",
        email: "demo@coolkid.cl",
        password: "Demo1234",
        isAdmin: false,
    });

    const reviewers = [demo, admin];

    const products = seedProducts.map((product, productIndex) => {
        const reviews = product.reviews.map((review, reviewIndex) => {
            const reviewer =
                reviewers[(productIndex + reviewIndex) % reviewers.length] ??
                admin;

            return {
                user: reviewer._id,
                name: review.name,
                rating: review.rating,
                comment: review.comment,
            };
        });

        const numReviews = reviews.length;
        const rating = numReviews
            ? Number(
                  (
                      reviews.reduce((sum, review) => sum + review.rating, 0) /
                      numReviews
                  ).toFixed(1),
              )
            : 0;

        return {
            ...product,
            user: admin._id,
            reviews,
            numReviews,
            rating,
        };
    });

    await ProductModel.insertMany(products);

    console.log("Datos importados:");
    console.log(`- 1 usuario admin (${admin.email})`);
    console.log(`- 1 usuario demo (${demo.email})`);
    console.log(`- ${products.length} productos con reseñas`);
    console.log(`- _id del admin: ${admin._id}`);
};

const run = async (): Promise<void> => {
    try {
        await connectDB();

        if (process.argv[2] === "--destroy") {
            await destroyData();
        } else {
            await importData();
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error("Error en el seeder:", error);
        process.exitCode = 1;
    }
};

void run();
