import { Subscription }
    from "../models/subscription.model.js";

import { PLAN_LIMITS }
    from "../utils/planLimits.js";

export const getUsage =
    async (
        req: any,
        res: any
    ) => {
        const subscription =
            await Subscription.findOne({
                user: req.user._id,
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
            subscription.plan
            ];
        if (!limits) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid subscription plan",
            });
        }

        return res.json({
            plan:
                subscription.plan,

            uploadsUsed:
                subscription.uploadCount,

            uploadLimit:
                limits.uploads,

            storageUsed:
                subscription.storageUsed,

            storageLimit:
                limits.storage,
        });
    };