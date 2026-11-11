import mongoose, { model, Schema, type InferSchemaType } from "mongoose";

const orderSchema = new Schema(
    {
        // Usuario quien realizara la orden.
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },

        // Productos incluidos en el pedido.
        orderItems: [
            {
                name: { type: String, required: true },
                qty: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                product: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: "Product",
                },
            },
        ],
        // Direccion de envio.
        shippingAddress: {
            address: {
                type: String,
                required: true,
                trim: true,
            },
            houseNumber: {
                type: String,
                required: true,
                trim: true,
            },
            propertyType: {
                type: String,
                required: true,
                enum: ["Casa", "Departamento", "Bloque"],
            },
            unitNumber: {
                type: String,
                trim: true,
            },
            commune: {
                type: String,
                required: true,
                trim: true,
            },
            city: {
                type: String,
                required: true,
                trim: true,
                default: "Santiago",
            },
            region: {
                type: String,
                required: true,
                trim: true,
            },

            postalCode: {
                type: String,
                trim: true,
            },
            required: true,
        },
        // Metodo de pago utilizado.
        paymentMethod: {
            id: { type: String },
            statust: { type: String },
            update_time: { type: String },
            email_adress: { type: String },
        },

        itemPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },

        // Costo del envio.
        shippingPrice: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        // Total del pedido.
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        }, // Indica si el pedido fue pagado.
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },

        // Fecha en que se realizó el pago.
        paidAt: {
            type: Date,
        },

        // Indica si el pedido fue entregado.
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },

        // Fecha de entrega.
        deliveredAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);
export type Order = InferSchemaType<typeof orderSchema>;

// Order MODEL
const OrderModel = model("Order", orderSchema);
export default OrderModel;
