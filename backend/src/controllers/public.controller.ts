import { Request, Response } from "express";

import { uploadBufferToCloudinary } from "../config/cloudinary.js";
import { User } from "../models/user.model.js";
import { Folder } from "../models/folder.model.js";
import { File } from "../models/file.model.js";
import { Subscription } from "../models/subscription.model.js";

import { PLAN_LIMITS } from "../utils/planLimits.js";

export const uploadCustomerFile = async (
  req: Request,
  res: Response
) => {
  let reservedSubscription: any = null;
  let totalFileSize = 0;

  try {
    const { slug } = req.params;
    const { customerName } = req.body;

    const files =
      req.files as Express.Multer.File[];

    if (!customerName?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Customer name is required",
      });
    }

    if (!files?.length) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload at least one file",
      });
    }

    totalFileSize = files.reduce(
      (total, file) =>
        total + file.size,
      0
    );

    const user =
      await User.findOne({
        slug,
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    if (!user.uploadEnabled) {
      return res.status(403).json({
        success: false,
        message:
          "Uploads are currently disabled",
      });
    }

    const subscription =
      await Subscription.findOne({
        user: user._id, 
      });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message:
          "Subscription not found",
      });
    }
    console.log("PLAN:", subscription.plan);
    console.log("FILES SIZE:", totalFileSize);
    const limits =
    PLAN_LIMITS[
      subscription.plan.toLowerCase() as keyof typeof PLAN_LIMITS
    ];
    
    console.log("LIMITS:", limits);
    if (!limits) {
      return res.status(500).json({
        success: false,
        message:
          "Invalid subscription plan",
      });
    }

    const storageLimitBytes =
      limits.storage *
      1024 *
      1024;

    /**
     * Reserve quota FIRST
     * Prevents race conditions
     */
    reservedSubscription =
      await Subscription.findOneAndUpdate(
        {
          _id: subscription._id,
          uploadCount: {
            $lte:
              limits.uploads -
              files.length,
          },
          storageUsed: {
            $lte:
              storageLimitBytes -
              totalFileSize,
          },
        },
        {
          $inc: {
            uploadCount:
              files.length,
            storageUsed:
              totalFileSize,
          },
        },
        {
          new: true,
        }
      );

    if (!reservedSubscription) {
      return res.status(403).json({
        success: false,
        message:
          "Upload limit or storage limit exceeded",
      });
    }

    const timestamp =
      Date.now();

    const folderName =
      `${customerName}_${timestamp}`;

    const folder =
      await Folder.create({
        owner: user._id,
        customerName,
        folderName,
        totalFiles:
          files.length,
        status: "pending",
      });


    const uploadedFiles =
      await Promise.all(
        files.map((file) =>
          uploadBufferToCloudinary(
            file.buffer,
            `users/${user._id}/${folderName}`
          ).then((cloudinaryFile) => {

            return File.create({
              owner:
                user._id,

              folder:
                folder._id,

              uploadedBy: {
                name:
                  customerName,
              },

              fileName:
                file.originalname,

              fileType:
                file.mimetype,

              fileSize:
                file.size,

              fileUrl:
                cloudinaryFile.secure_url,

              publicId:
                cloudinaryFile.public_id,
            });
          })
        )
      );

    folder.status =
      "completed";

    await folder.save();

    return res.status(201).json({
      success: true,

      folderId:
        folder._id,

      plan:
        reservedSubscription.plan,

      totalFiles:
        uploadedFiles.length,

      usedUploads:
        reservedSubscription.uploadCount,

      usedStorage:
        reservedSubscription.storageUsed,

      files:
        uploadedFiles,
    });
  } catch (error) {
    console.error(
      "Upload Error:",
      error
    );

    /**
     * Rollback quota reservation
     */
    if (
      reservedSubscription &&
      totalFileSize > 0
    ) {
      try {
        await Subscription.findByIdAndUpdate(
          reservedSubscription._id,
          {
            $inc: {
              uploadCount:
                -(req.files as Express.Multer.File[])
                  .length,

              storageUsed:
                -totalFileSize,
            },
          }
        );
      } catch (
      rollbackError
      ) {
        console.error(
          "Rollback Error:",
          rollbackError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error",
      error:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
};
export const toggleUploadPermission =
  async (
    req: any,
    res: any
  ) => {
    try {
      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      const updatedUser =
        await User.findByIdAndUpdate(
          req.user._id,
          {
            uploadEnabled:
              !user.uploadEnabled,
          },
          {
            new: true,
          }
        );

      return res.json({
        success: true,

        uploadEnabled:
          updatedUser?.uploadEnabled,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Internal Server Error",
      });
    }
  };