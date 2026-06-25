import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
      index: true,
    },

    googleId: String,

    slug: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    uploadEnabled: {
      type: Boolean,
      default: true,
    },

    publicLink: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    qrCode: String,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model(
  "User",
  userSchema
);