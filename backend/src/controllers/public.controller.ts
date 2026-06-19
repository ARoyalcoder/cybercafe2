import { Request, Response } from "express";

import { User } from "../models/user.model.js";
import { Folder } from "../models/folder.model.js";
import { File } from "../models/file.model.js";
import { Subscription } from "../models/subscription.model.js";

import { PLAN_LIMITS } from "../utils/planLimits.js";


import { supabase } from "../config/supabase.js"

export const uploadCustomerFile = async (
  req: Request,
  res: Response
) => {
  let reservedSubscription: any = null;

  let totalFileSize = 0;

  const uploadedPaths: string[] = [];

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
      (sum, file) => sum + file.size,
      0
    );

    const user = await User.findOne({
      slug,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
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

    const limits =
      PLAN_LIMITS[
      subscription.plan.toLowerCase() as keyof typeof PLAN_LIMITS
      ];

    if (!limits) {
      return res.status(500).json({
        success: false,
        message:
          "Invalid subscription plan",
      });
    }

    const storageLimitBytes =
      limits.storage * 1024 * 1024;

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
            uploadCount: files.length,
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

    const timestamp = Date.now();

    const folderName =
      `${customerName}_${timestamp}`;

    const folder = await Folder.create({
      owner: user._id,
      customerName,
      folderName,
      totalFiles: files.length,
      status: "pending",
    });

    const getThumbnailUrl = (
      mimetype: string,
      fileUrl: string
    ) => {
      if (
        mimetype.startsWith(
          "image/"
        )
      ) {
        return fileUrl;
      }

      if (
        mimetype ===
        "application/pdf"
      ) {
        return "https://cdn-icons-png.flaticon.com/512/337/337946.png";
      }

      if (
        mimetype.includes("word")
      ) {
        return "https://cdn-icons-png.flaticon.com/512/281/281760.png";
      }

      if (
        mimetype.includes(
          "spreadsheet"
        ) ||
        mimetype.includes("excel")
      ) {
        return "https://cdn-icons-png.flaticon.com/512/732/732220.png";
      }

      return "https://cdn-icons-png.flaticon.com/512/833/833524.png";
    };

    const uploadedFiles =
      await Promise.all(
        files.map(async (file) => {
          const storagePath =
            `${user._id}/${folderName}/${timestamp}-${file.originalname}`;

          const { error } =
            await supabase.storage
              .from("documents")
              .upload(
                storagePath,
                file.buffer,
                {
                  contentType:
                    file.mimetype,
                  upsert: false,
                }
              );

          if (error) {
            throw new Error(
              `Failed to upload ${file.originalname}: ${error.message}`
            );
          }

          uploadedPaths.push(
            storagePath
          );

          const {
            data: publicUrlData,
          } = supabase.storage
            .from("documents")
            .getPublicUrl(
              storagePath
            );

          const fileUrl =
            publicUrlData.publicUrl;

          const thumbnailUrl =
            getThumbnailUrl(
              file.mimetype,
              fileUrl
            );

          return File.create({
            owner: user._id,
            folder: folder._id,
            uploadedBy: {
              name: customerName,
            },
            fileName:
              file.originalname,
            fileType:
              file.mimetype,
            fileSize: file.size,
            fileUrl,
            storagePath,
            thumbnailUrl,
          });
        })
      );

    await Folder.findByIdAndUpdate(
      folder._id,
      {
        status: "completed",
      }
    );

    return res.status(201).json({
      success: true,
      folderId: folder._id,
      plan:
        reservedSubscription.plan,
      totalFiles:
        uploadedFiles.length,
      usedUploads:
        reservedSubscription.uploadCount,
      usedStorage:
        reservedSubscription.storageUsed,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error(
      "Upload Error:",
      error
    );

    if (uploadedPaths.length) {
      try {
        await supabase.storage
          .from("documents")
          .remove(
            uploadedPaths
          );
      } catch (
        cleanupError
      ) {
        console.error(
          "Cleanup Error:",
          cleanupError
        );
      }
    }

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
                -(
                  req.files as Express.Multer.File[]
                ).length,
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