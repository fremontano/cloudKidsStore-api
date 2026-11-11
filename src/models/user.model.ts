import { model, Schema, type InferSchemaType } from "mongoose";

// USER SCHEMA
const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        // Contraseña cifrada (hash).
        password: {
            type: String,
            required: true,
            select: false,
        },

        // Indica si el usuario tiene permisos de administrador.
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        // Agrega automaticamente createdAt y updatedAt.
        timestamps: true,
    },
);

export type User = InferSchemaType<typeof userSchema>;

// USER MODEL

const UserModel = model("User", userSchema);
export default UserModel;
