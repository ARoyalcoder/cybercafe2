import mongoose from "mongoose";

const paymentSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      amount: Number,

      plan: String,

      paymentId: String,

      orderId: String,

      status: String,
      paidAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

export const Payment =
  mongoose.model(
    "Payment",
    paymentSchema
  );