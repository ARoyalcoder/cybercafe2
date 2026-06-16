

import { Subscription } from "../models/subscription.model.js";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { PLAN_LIMITS } from "../utils/planLimits.js";

import { Request, Response, NextFunction } from "express";

export const checkSubscription = asyncHandler(
  async (
    req: any,
    _res: Response,
    next: NextFunction
  ) => {
    // Check authentication
    

    const subscription =
      await Subscription.findOne({
        user: req.user._id,
      });

    if (!subscription) {
      throw new ApiError(
        404,
        "Subscription not found"
      );
    }

    // Check expiry
    if (
      subscription.expiresAt &&
      new Date(subscription.expiresAt) <
        new Date()
    ) {
      await Subscription.findByIdAndUpdate(
        subscription._id,
        {
          plan: "free",
          status: "expired",
          uploadCount: 0,
        }
      );

      throw new ApiError(
        403,
        "Subscription expired. Please renew."
      );
    }

    const plan =
      String(
        subscription.plan
      ).toLowerCase();

    const limits =
      PLAN_LIMITS[
        plan as keyof typeof PLAN_LIMITS
      ];

    if (!limits) {
      throw new ApiError(
        400,
        `Invalid subscription plan: ${subscription.plan}`
      );
    }

    const uploadCount =
      subscription.uploadCount || 0;

    if (
      uploadCount >= limits.uploads
    ) {
      throw new ApiError(
        403,
        "Monthly upload limit reached. Please upgrade your plan."
      );
    }

    req.subscription =
      subscription;

    next();
  }
);

// export const checkSubscription =
//   asyncHandler(
//     async (
//       req: any,
//       _res: any,
//       next: any
//     ) => {
//       console.log("Checking subscription for user:", req.user._id);
//       const subscription =
//         await Subscription.findOne({
//           user: req.user._id,
//         });

//       if (!subscription) {
//         throw new ApiError(
//           404,
//           "Subscription not found"
//         );
//       }

//       const isExpired =
//         subscription.expiresAt &&
//         subscription.expiresAt <
//         new Date();

//       if (isExpired) {
//         await Subscription.findByIdAndUpdate(
//           subscription._id,
//           {
//             $set: {
//               plan: "free",
//               status:
//                 "expired",
//               uploadCount: 0,
//               storageUsed: 0,
//             },
//           }
//         );

//         throw new ApiError(
//           403,
//           "Subscription expired. Please renew."
//         );
//       }

//       const limits =
//         PLAN_LIMITS[
//         subscription.plan.toLowerCase() as keyof typeof PLAN_LIMITS
//         ];
//       if (!limits) {
//         throw new ApiError(
//           400,
//           "Invalid subscription plan"
//         );
//       }

//       if (
//         (subscription.uploadCount ||
//           0) >=
//         limits.uploads
//       ) {
//         throw new ApiError(
//           403,
//           "Monthly upload limit reached. Please upgrade your plan."
//         );
//       }

//       req.subscription =
//         subscription;
//       console.log("pass");
//       next();
//     }
//   );