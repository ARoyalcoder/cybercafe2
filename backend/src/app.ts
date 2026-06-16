import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

/* Config */
import passport from "./config/passport.js";

/* Middleware */
import { limiter } from "./middleware/rateLimit.middleware.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";

/* Routes */
import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import publicRoutes from "./routes/public.routes.js";
import folderRoutes from "./routes/folder.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import fileRoutes from "./routes/file.routes.js"
const app = express();

/* -------------------------------------------------------------------------- */
/*                               Security Layer                               */
/* -------------------------------------------------------------------------- */

app.use(helmet());
app.use(limiter);
app.use(compression());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/* -------------------------------------------------------------------------- */
/*                              Request Parsers                               */
/* -------------------------------------------------------------------------- */

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

/* -------------------------------------------------------------------------- */
/*                             Authentication                                 */
/* -------------------------------------------------------------------------- */

app.use(passport.initialize());

/* -------------------------------------------------------------------------- */
/*                               Health Check                                 */
/* -------------------------------------------------------------------------- */

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API Working",
  });
});

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/files", fileRoutes);
/* -------------------------------------------------------------------------- */
/*                              Not Found Route                               */
/* -------------------------------------------------------------------------- */

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* -------------------------------------------------------------------------- */
/*                               Error Handler                                */
/* -------------------------------------------------------------------------- */

app.use(globalErrorHandler);

export default app;