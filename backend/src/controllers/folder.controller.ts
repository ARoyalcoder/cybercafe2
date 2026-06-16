import { Request, Response } from "express";
import { Folder } from "../models/folder.model.js";
import { File } from "../models/file.model.js";
import cloudinary from "../config/cloudinary.js";




export const getMyFolders = async (
  req: any,
  res: Response
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const folders = await Folder.find({
      owner: req.user._id,
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: folders.length,
      folders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch folders",
    });
  }
};

export const updateFolderStatus = async (
  req: any,
  res: any
) => {
  const { status } = req.body;

  const folder =
    await Folder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

  return res.json({
    success: true,
    folder,
  });
};

export const deleteFolder = async (
  req: any,
  res: any
) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    const files = await File.find({
      folder: folder._id,
    });

    // Delete from Cloudinary
    for (const file of files) {
      if (file.publicId) {
        await cloudinary.uploader.destroy(
          file.publicId
        );
      }
    }

    // Delete file records
    await File.deleteMany({
      folder: folder._id,
    });

    // Delete folder
    await Folder.findByIdAndDelete(
      folder._id
    );

    return res.status(200).json({
      success: true,
      message:
        "Folder deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        "Internal Server Error",
    });
  }
};




export const deleteMultipleFolders =
  async (
    req: any,
    res: any
  ) => {
    try {
      const { folderIds } =
        req.body;

      if (
        !folderIds ||
        !folderIds.length
      ) {
        return res.status(400).json({
          success: false,
          message:
            "No folders selected",
        });
      }

      const files =
        await File.find({
          folder: {
            $in: folderIds,
          },
        });

      // Delete from Cloudinary
      for (const file of files) {
        if (file.publicId) {
          await cloudinary.uploader.destroy(
            file.publicId,
            {
              resource_type:
                "raw",
            }
          );
        }
      }

      // Delete files collection
      await File.deleteMany({
        folder: {
          $in: folderIds,
        },
      });

      // Delete folders collection
      await Folder.deleteMany({
        _id: {
          $in: folderIds,
        },

        owner: req.user._id,
      });

      return res.status(200).json({
        success: true,
        message:
          "Folders deleted successfully",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
      });
    }
  };

export const getFolderDetails =
  async (
    req: any,
    res: Response
  ) => {
    try {
      const folder =
        await Folder.findOne({
          _id: req.params.id,
          owner: req.user._id,
        });

      if (!folder) {
        return res.status(404).json({
          success: false,
          message: "Folder not found",
        });
      }

      const files =
        await File.find({
          folder: folder._id,
        }).sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        folder,
        files,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch folder details",
      });
    }
  };