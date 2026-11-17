import mongoose from "mongoose";
import dotenv from "dotenv";
import UserModel from "./models/user.model.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const DEMO_EMAIL = "demo@coolkid.cl";
const DEMO_PASSWORD = "Demo1234";

const run = async (): Promise<void> => {
    try {
        await connectDB();

        let user = await UserModel.findOne({ email: DEMO_EMAIL }).select("+password");

        if (!user) {
            user = await UserModel.create({
                name: "Usuario Demo",
                email: DEMO_EMAIL,
                password: DEMO_PASSWORD,
                isAdmin: false,
            });
            console.log("Usuario demo creado.");
        } else {
            user.name = "Usuario Demo";
            user.password = DEMO_PASSWORD;
            user.isAdmin = false;
            await user.save();
            console.log("Usuario demo actualizado.");
        }

        console.log(`Email: ${DEMO_EMAIL}`);
        console.log(`Contraseña: ${DEMO_PASSWORD}`);

        await mongoose.connection.close();
    } catch (error) {
        console.error("Error al crear el usuario demo:", error);
        process.exitCode = 1;
    }
};

void run();
