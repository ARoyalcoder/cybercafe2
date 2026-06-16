import { Request, Response } from "express";

import { Session } from "../models/session.model.js";

import generateToken from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// export const googleSuccess = asyncHandler(
//   async (req: Request, res: Response) => {
//     const user: any = req.user;

//     if (!user) {
//       throw new ApiError(
//         401,
//         "User not found"
//       );
//     }

//     const deviceId =
//       (req.headers["device-id"] as string) ||
//       "unknown-device";

//     const existingSession =
//       await Session.findOne({
//         user: user._id,
//         deviceId,
//       });

//     if (existingSession) {
//       return res.status(200).json(
//         new ApiResponse(
//           200,
//           {
//             token: existingSession.token,
//             user,
//           },
//           "Already logged in on this device"
//         )
//       );
//     }

//     const activeSessions =
//       await Session.countDocuments({
//         user: user._id,
//       });

//     if (activeSessions >= 2) {
//       throw new ApiError(
//         403,
//         "Maximum 2 devices allowed"
//       );
//     }

//     const token = generateToken(
//       user._id.toString()
//     );

//     await Session.create({
//       user: user._id,
//       deviceId,
//       token,
//     });

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure:
//         process.env.NODE_ENV ===
//         "production",
//       sameSite: "lax",
//       maxAge:
//         7 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json(
//       new ApiResponse(
//         200,
//         {
//           token,
//           user,
//         },
//         "Login successful"
//       )
//     );
//   }
// );

export const googleSuccess = asyncHandler(
  async (req: Request, res: Response) => {
    const user: any = req.user;

    if (!user) {
      throw new ApiError(
        401,
        "User not found"
      );
    }

    const token = generateToken(
      user._id.toString()
    );
    console.log(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      maxAge:
        7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(
      `${process.env.CLIENT_URL}/auth/success?token=${token}`
    );
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response) => {
    const deviceId =
      req.headers["device-id"] as string;

    const user: any = req.user;

    if (!user) {
      throw new ApiError(
        401,
        "Unauthorized"
      );
    }

    await Session.findOneAndDelete({
      user: user._id,
      deviceId,
    });

    res.clearCookie("token");

    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Logged out successfully"
      )
    );
  }
);


export const getProfile =
  async (
    req: any,
    res: any
  ) => {
    res.json({
      success: true,
      user: req.user,
    });
  };