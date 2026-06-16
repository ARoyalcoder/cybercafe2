import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    deviceId: String,

    token: String,
  },
  {
    timestamps: true,
  }
);

export const Session = mongoose.model(
  "Session",
  sessionSchema
);