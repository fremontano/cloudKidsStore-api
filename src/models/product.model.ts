import mongoose, { model, Schema, type InferSchemaType } from "mongoose";

// REVIEW SCHEMA,es uun documento embebidos, no una colección independiente.

const reviewSchema = new Schema({
  // Usuario que realizó la reseña.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  comment: {
    type: String,
    trim: true,
  },
});

// PRODUCT SCHEMA, estructura principal del producto.
// Incluye un array de reseñas (reviewSchema).
const productSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    color: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Características adicionales del producto.
    details: {
      type: [String],
      default: [],
    },

    // Reseñas embebidas dentro del documento Product.
    reviews: {
      type: [reviewSchema],
      default: [],
    },

    // Cantidad total de reseñas.
    numReviews: {
      type: Number,
      min: 0,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Unidades disponibles en inventario.
    countInStock: {
      type: Number,
      min: 0,
      default: 0,
    },

    // Calificacion promedio del producto.
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    // Agrega automáticamente createdAt y updatedAt.
    timestamps: true,
  },
);

export type Review = InferSchemaType<typeof reviewSchema>;
export type Product = InferSchemaType<typeof productSchema>;

// PRODUCT MODEL,crea el modelo para interactuar con MongoDB.
// Las reseñas se guardan dentro de products.

const ProductModel = model("Product", productSchema);
export default ProductModel;
