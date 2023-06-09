const express = require("express");
const passport = require("passport");
const { payment, confirmPayment, booking, getEvents } = require("../controller/controller");
const router = express.Router();

// Auth login
// Auth login
router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});


router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["profile"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google"),
  (req, res) => {
     res.render("profile", { user: req.user });

  }
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  (req, res) => {
    res.render("profile", { user: req.user });
  }
);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/user/login');
});

router.post("/payment", payment);

router.post("/booking", booking);

// route for pagination
router.get("/events", getEvents);

router.post("/confirm-payment", confirmPayment);

const userRoute = router
module.exports = userRoute;