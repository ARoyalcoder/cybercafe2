import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const globalErrorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  return res.status(err.statusCode || 500).json(
    new ApiResponse(
      err.statusCode || 500,
      null,
      err.message || "Internal Server Error"
    )
  );
};