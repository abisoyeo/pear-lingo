import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../users/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_BASE_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const fullName = profile.displayName;
        const profilePic = profile.photos[0]?.value || "";

        let user = await User.findOne({
          $or: [
            { provider: "google", providerId: profile.id },
            { email: email },
          ],
        });

        let isNewUser = false;

        if (user) {
          if (!user.providerId) {
            user.providerId = profile.id;
            user.profilePic = user.profilePic || profilePic;
            await user.save();
          }
        } else {
          user = await User.create({
            fullName,
            email,
            provider: "google",
            providerId: profile.id,
            profilePic,
            isVerified: true,
          });
          isNewUser = true;
        }
        user = user.toObject();
        user.isNewUser = isNewUser;

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
