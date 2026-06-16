import mongoose from "mongoose";

const subscriptionSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
      },

      plan: {
        type: String,
        enum: [
          "free",
          "plus",
          "prime",
          "pro",
        ],
        default: "free",
      },

      status: {
        type: String,
        enum: [
          "active",
          "expired",
          "cancelled",
        ],
        default: "active",
      },

      uploadCount: {
        type: Number,
        default: 0,
      },

      storageUsed: {
        type: Number,
        default: 0,
      },

      currentMonth: {
        type: String,
        default: () =>
          new Date()
            .toISOString()
            .slice(0, 7),
      },

      expiresAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

export const Subscription =
  mongoose.model(
    "Subscription",
    subscriptionSchema
  );