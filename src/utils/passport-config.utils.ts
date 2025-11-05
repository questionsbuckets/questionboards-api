import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_BASE_URL}/api/v1/user/auth/google/callback`,
    } as any,
    (accessToken: any, refreshToken: any, profile: any, done: any) => {
      console.log("profile ::::::", profile);

      const user = {
        googleId: profile?.id,
        displayName: profile?.displayName,
        email: profile?.emails?.[0]?.value,
        firstName: profile?.name?.givenName,
        lastName: profile?.name?.familyName,
        profilePicture: profile?.photos?.[0]?.value,
      };

      return done(null, user);
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

// console.log("✅ Google strategy registered successfully"); // keep this log
