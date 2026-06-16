import cron from "node-cron";

import { Subscription } from "../models/subscription.model.js";

cron.schedule(
  "0 0 1 * *",
  async () => {
    try {
      console.log(
        "Resetting monthly upload counts..."
      );

      await Subscription.updateMany(
        {},
        {
          uploadCount: 0,
          currentMonth:
            new Date()
              .toISOString()
              .slice(0, 7),
        }
      );

      console.log(
        "Monthly uploads reset successfully"
      );
    } catch (error) {
      console.error(
        "Subscription Reset Error:",
        error
      );
    }
  }
);