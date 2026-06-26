import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Please provide product slug"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      min: [0, "Price cannot be less than 0"],
    },
    // Higher than price = "was X, now Y" sale badge. Null = not on sale.
    compareAtPrice: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      required: [true, "Please specify a category"],
      enum: ["electronics", "fashion", "home-living", "beauty", "groceries", "toys"],
    },
    images: {
      type: [String],
      required: [true, "Please provide at least one product image"],
    },
    stock: {
      type: Number,
      required: [true, "Please provide product stock"],
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    specs: [
      {
        key: String,
        value: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Compound index for fast category + featured queries
ProductSchema.index({ category: 1, featured: -1 });
ProductSchema.index({ price: 1 });

// Full-text search index — powers Phase 6 search (name weighted 3×, description 1×)
// MongoDB allows only one text index per collection; both fields declared together.
ProductSchema.index(
  { name: "text", description: "text", category: "text" },
  { weights: { name: 3, description: 1, category: 1 }, name: "product_text_search" },
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
