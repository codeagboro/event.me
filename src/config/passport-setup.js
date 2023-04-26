/** @format */

const passport = require("passport");
const User = require("../user/models/user.model");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize the user , just like decode a jwt token
passport.deserializeUser((id, done) => {
  const user = User.findById(id);
  console.log(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      console.log(
        { googleid: profile.id },
        { profileName: profile.displayName },
        { picture: profile._json.picture },
        { email: profile.emails[0].value }
      );

      const currentUser = await User.findOne({ googleId: profile.id });

      if (currentUser) {
        const token = jwt.sign(currentUser, process.env.JWT_SECRETKEY, {
          expiresIn: "4hr",
        });
        console.log(`user is: ${currentUser.firstName}`);
        console.log("Current user is ".red, currentUser);
        done(null, currentUser);
      } else {
        const user = await User.create({
          googleId: profile.id,
          username: profile.displayName,
          photo: profile._json.picture,
          email: profile.emails[0].value,
        });
        const token = jwt.sign(newUser, process.env.JWT_SECRETKEY, {
          expiresIn: "4hr",
        });
        console.log(token);
        console.log(`new user created ${user}`.yellow);
        done(null, user);
      }
    }
  )
);
