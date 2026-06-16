import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import QRCode from "qrcode";
import { nanoid } from "nanoid";
import dotenv from "dotenv";

dotenv.config();

import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL:
        "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          googleId: profile.id,
        });

        if (!user) {
          const slug = nanoid(12);

          const publicLink = `${process.env.CLIENT_URL}/user/${slug}`;

          const qrCode = await QRCode.toDataURL(publicLink);

          user = await User.create({
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            slug,
            publicLink,
            qrCode,
          });
        }

        // Create subscription only if it doesn't already exist
        await Subscription.findOneAndUpdate(
          { user: user._id },
          {
            $setOnInsert: {
              user: user._id,
              plan: "free",
            },
          },
          {
            upsert: true,
            returnDocument: "after",
          }
        );

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);

    done(null, user);
  } catch (error) {
    done(error, null);
  }
});




export default passport;