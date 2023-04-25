const passport = require("passport");
const User = require("../user/models/user.model");
const FacebookStrategy = require("passport-facebook").Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize the user , just like decode a jwt token
passport.deserializeUser((id, done) => {
  const user = User.findById(id);
  console.log(id)
  done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/facebook/callback"
  },// facebook will send back the token and profile
async (token, refreshToken, profile, done) => {
    console.log(profile);
    console.log(
      { googleid: profile.id },
      { profileName: profile.displayName },
      { picture: profile.picture.type(large) }
    );

    const currentUser = await User.findOne({ googleId: profile.id });

    if (currentUser) {
      console.log("Current user is ".red, currentUser);
      done(null, currentUser);
    } else {
      const user = await User.create({
        googleId: profile.id,
        username: profile.displayName,
        photo: profile._json.picture,
      });
      console.log(`new user created ${user}`.yellow);
      done(null, user);
    }
}));
