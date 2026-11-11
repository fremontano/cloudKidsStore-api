import dns from "node:dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI?.trim();

    if (!mongoUri) {
      throw new Error("Falta configurar MONGO_URI en el archivo .env");
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB conectado correctamente");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error);

    throw error;
  }
};
