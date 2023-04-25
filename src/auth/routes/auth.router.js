const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../../middleware/isLoggedIn");
const upload = require("../../helper/multer");
const createEvent = require("../controller/auth.controller");


router.get("/newevent", (req, res) => {
    res.render("newevent");
});

router.get("/profile", ensureAuthenticated, (req, res) => {
    res.render("profile", { user: req.user });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

router.post("/create", upload.single("image"), createEvent)

const authRouter = router
module.exports = authRouter;
