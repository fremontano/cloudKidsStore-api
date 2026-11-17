import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

// Servir las imágenes de perfil subidas.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 4000;

app.get("/", (_req, res) => {
  res.json({
    message: "API CoolKid funcionando correctamente",
  });
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// 404 para rutas no encontradas + manejador de errores (siempre al final).
app.use(notFound);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      "Error al iniciar el servidor:",
      error instanceof Error ? error.message : error,
    );
    process.exitCode = 1;
  }
};

void startServer();
