import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { User } from "../models/user.model.js";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

interface TokenPayload extends JwtPayload {
    userId: string;
}

export const verifyJWT = asyncHandler(
    async (
        req: Request,
        _res: Response,
        next: NextFunction
    ) => {
        /* Get Token */
        const token =
            req.cookies?.token ||
            req.headers.authorization?.replace(
                "Bearer ",
                ""
            );

        /* Validate Token */
        if (!token) {
            throw new ApiError(
                401,
                "Unauthorized access"
            );
        }

        /* Verify Token */
        const { userId } = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as TokenPayload;

        /* Find User */
        const user = await User.findById(
            userId
        ).select("-password");

        if (!user) {
            throw new ApiError(
                401,
                "Invalid access token"
            );
        }

        /* Attach User */
        req.user = user;

        next();
    }
);