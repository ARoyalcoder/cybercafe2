import { Request, Response } from "express";
import { Folder } from "../models/folder.model.js";
import { File } from "../models/file.model.js";
import { supabase } from "../config/supabase.js";



export const getMyFolders = async (
  req: any,
  res: Response
) => {
  try {
    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const search =
      req.query.search || "";

    const status =
      req.query.status || "";

    const query: any = {
      owner: req.user._id,
    };

    if (search) {
      query.$or = [
        {
          customerName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          folderName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      query.status = status;
    }

    const totalFolders =
      await Folder.countDocuments(
        query
      );

    const folders =
      await Folder.find(query)
        .sort({
          createdAt: -1,
        })
        .skip(
          (page - 1) * limit
        )
        .limit(limit);

    return res.status(200).json({
      success: true,

      folders,

      pagination: {
        currentPage: page,

        totalPages:
          Math.ceil(
            totalFolders /
            limit
          ),

        totalFolders,

        limit,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch folders",
    });
  }
};


export const updateFolderStatus =
  async (
    req: any,
    res: any
  ) => {
    try {
      const { status } =
        req.body;

      const allowedStatuses =
        [
          "pending",
          "completed",
          "processing",
          "rejected",
        ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status",
        });
      }

      const folder =
        await Folder.findOneAndUpdate(
          {
            _id:
              req.params.id,

            owner:
              req.user._id,
          },
          { status },
          { returnDocument: "after" }
        );

      if (!folder) {
        return res.status(404).json({
          success: false,
          message:
            "Folder not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Folder status updated successfully",
        folder,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Internal Server Error",
      });
    }
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

    // Delete from Supabase Storage
    if (files.length > 0) {
      const paths = files.map(
        (file) => file.storagePath
      );

      const { error } =
        await supabase.storage
          .from("documents")
          .remove(paths);

      if (error) {
        console.error(
          "Supabase Delete Error:",
          error
        );

        return res.status(500).json({
          success: false,
          message:
            "Failed to delete files from storage",
        });
      }
    }

    // Delete File Documents
    await File.deleteMany({
      folder: folder._id,
    });

    // Delete Folder
    await Folder.findByIdAndDelete(
      folder._id
    );

    return res.status(200).json({
      success: true,
      message:
        "Folder deleted successfully",
    });
  } catch (error) {
    console.error(error);

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

      // Delete files from Supabase Storage
      if (files.length > 0) {
        const storagePaths =
          files.map(
            (file) =>
              file.storagePath
          );

        const { error } =
          await supabase.storage
            .from("documents")
            .remove(
              storagePaths

            );

        if (error) {
          console.error(
            "Supabase Delete Error:",
            error
          );

          return res.status(500).json({
            success: false,
            message:
              "Failed to delete storage files",
          });
        }
      }

      // Delete file documents
      await File.deleteMany({
        folder: {
          $in: folderIds,
        },
      });

      // Delete folders
      await Folder.deleteMany({
        _id: {
          $in: folderIds,
        },
        owner:
          req.user._id,
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
        message:
          "Internal Server Error",
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
          message:
            "Folder not found",
        });
      }

      const files =
        await File.find({
          folder: folder._id,
        })
          .select(
            "fileName fileType fileSize fileUrl storagePath createdAt"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        folder,
        files,
      });
    } catch (error) {
      console.error(
        "Folder Details Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch folder details",
      });
    }
  };