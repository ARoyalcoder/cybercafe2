import rateLimit from "express-rate-limit";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 100;

export const limiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Try again later.",
  },
});