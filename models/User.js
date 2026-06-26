import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHashed: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller", "customer"],
      default: "customer",
    },
    points: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
    },
    emailOrderUpdates: { type: Boolean, default: true },
    emailPromotions: { type: Boolean, default: false },
    emailNewArrivals: { type: Boolean, default: false },
    addresses: [
      {
        fullName: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String,
        buildingDetails: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.User || mongoose.model("User", UserSchema, "user");
