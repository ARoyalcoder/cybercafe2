import { File } from "../models/file.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Folder } from "../models/folder.model.js";
import { PLAN_LIMITS } from "../utils/planLimits.js";

export const getRecentUploads =
    async (
        req: any,
        res: any
    ) => {
        try {
            const folders =
                await Folder.find({
                    owner: req.user._id,
                })
                    .sort({
                        createdAt: -1,
                    })
                    .limit(5);

            return res.json({
                success: true,
                folders,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
            });
        }
    };

export const getDashboardStats =
    async (
        req: any,
        res: any
    ) => {
        try {
            const userId =
                req.user._id;

            const totalFolders =
                await Folder.countDocuments({
                    owner: userId,
                });

            const totalFiles =
                await File.countDocuments({
                    owner: userId,
                });

            const subscription =
                await Subscription.findOne({
                    user: userId,
                });


            const plan =
                subscription?.plan || "free";

            const storageLimit =
                PLAN_LIMITS[plan].storage;


            return res.json({
                success: true,

                stats: {
                    totalFolders,
                    totalFiles,

                    storageUsed:
                        subscription
                            ?.storageUsed || 0,

                    plan:
                        subscription?.plan ||
                        "free",
                    storageLimit,
                },
            });
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                success: false,
            });
        }
    };