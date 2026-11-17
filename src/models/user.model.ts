import { model, Schema, type InferSchemaType, type Model } from "mongoose";
import bcrypt from "bcryptjs";

export const DEFAULT_AVATAR =
    "https://images.icon-icons.com/3446/PNG/512/profile_user_avatar_people_icon_219228.png";

export interface IUser {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    image?: string | undefined;
    otp?: string | undefined;
    otpExpires?: Date | undefined;
}

export interface IUserMethods {
    matchPassword(enteredPassword: string): Promise<boolean>;
}

type UserModelType = Model<IUser, {}, IUserMethods>;

// USER SCHEMA
const userSchema = new Schema<IUser, UserModelType, IUserMethods>(
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

        // URL de la imagen de perfil.
        image: {
            type: String,
            default: DEFAULT_AVATAR,
        },

        // Codigo OTP para cambiar la contraseña.
        otp: {
            type: String,
            select: false,
        },

        // Fecha de expiración del código OTP.
        otpExpires: {
            type: Date,
        },
    },
    {
        // Agrega automaticamente createdAt y updatedAt.
        timestamps: true,
    },
);

// Cifra la contraseña antes de guardar, solo si cambió.
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

// Compara la contraseña ingresada con la almacenada (hash).
userSchema.methods.matchPassword = async function (
    enteredPassword: string,
): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
};

export type User = InferSchemaType<typeof userSchema>;

// USER MODEL
const UserModel = model<IUser, UserModelType>("User", userSchema);
export default UserModel;
