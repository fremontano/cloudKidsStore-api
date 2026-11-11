import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/", (_req, res) => {
  res.json({
    message: "API CoolKid funcionando correctamente",
  });
});

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
