import mongoose from "mongoose";

const fileSchema =
    new mongoose.Schema(
        {
            owner: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "User",
                index: true,
                required: true,
            },

            folder: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "Folder",
                index: true,
            },

            uploadedBy: {
                name: String,
                mobile: String,
            },

            fileName: String,

            fileUrl: {
                type: String,
                required: true,
            },
            thumbnailUrl: {
                type: String,
                default: "",
            },
            storagePath: {
                type: String,
                required: true,
            },

            publicId: String,

            fileType: String,

            fileSize: Number,
        },
        {
            timestamps: true,
        }
    );

export const File =
    mongoose.model(
        "File",
        fileSchema
    );