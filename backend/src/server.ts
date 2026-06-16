import dotenv from "dotenv";
dotenv.config();
import { connectRedis } from "./config/redis.js";

import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import app from "./app.js";
import connectDB from "./config/db.js";
import "./jobs/subscriptionReset.js";



const PORT = Number(process.env.PORT) || 5000;

let server: any;

/* ---------------- Start Server ---------------- */

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error);
    process.exit(1);
  }
};

startServer();

/* ---------------- Unhandled Promise Rejection ---------------- */

process.on("unhandledRejection", (reason) => {
  console.error("❌ UNHANDLED REJECTION");
  console.error(reason);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

/* ---------------- Uncaught Exception ---------------- */

process.on("uncaughtException", (error) => {
  console.error("❌ UNCAUGHT EXCEPTION");
  console.error(error);

  process.exit(1);
});

/* ---------------- SIGTERM ---------------- */

process.on("SIGTERM", () => {
  console.log("⚠️ SIGTERM Received");

  if (server) {
    server.close(() => {
      console.log("Server Closed");
      process.exit(0);
    });
  }
});

/* ---------------- SIGINT (Ctrl + C) ---------------- */

process.on("SIGINT", () => {
  console.log("⚠️ Server Stopped");

  if (server) {
    server.close(() => {
      process.exit(0);
    });
  }
});