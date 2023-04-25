require("dotenv").config();
require("colors");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const app = express();
const connectDB = require("./database/db");
const passport = require("passport");
const cors = require("cors");
const googleStrategy = require("./config/passport-setup");
const facebookStrategy = require("./config/passport_facebook");
const userRoute = require("./user/routes/user.routes");
const authRouter = require("./auth/routes/auth.router");

connectDB();

// use TZ LAGOS to set the timezone to lagos
process.env.TZ = "Lagos/Nigeria"; // will set the timezone to lagos

app.use(express.json());
//app.use(express)
app.use(cookieParser());
app.use(cors(
  {
    origin: "http://localhost:4567",
    credentials: true
  }
));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  maxAge: 24 * 60 * 60 * 1000
}))


//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});


app.use("/user", userRoute);
app.use("/auth", authRouter);
// app.use("/profile", profileRoutes);

app.get(
  "/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.render("profile", { user: req.user });
  }
);

app.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  (req, res) => {
    res.render("profile", { user: req.user });
  }
);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`.yellow.underline);
});