const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/isLoggedIn");
const upload = require("../../helper/multer");
const createEvent = require("../controller/auth.controller");


router.get("/newevent", (req, res) => {
    res.render("newevent");
});

router.get("/profile", isAuthenticated, (req, res) => {
    res.render("profile", { user: req.user });
});

router.get("/logout", isAuthenticated, (req, res) => {
    req.logout();
    res.redirect("/");
});

router.post("/create", upload.single("image"), createEvent)

const authRouter = router
module.exports = authRouter;
