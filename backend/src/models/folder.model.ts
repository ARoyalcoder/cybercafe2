import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    folderName: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "rejected",
      ],
      default: "pending",
    },

    totalFiles: {
      type: Number,
      default: 0,
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  }
);

export const Folder = mongoose.model(
  "Folder",
  folderSchema
);