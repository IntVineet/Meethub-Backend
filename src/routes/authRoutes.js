const router = require("express").Router();
const { register, login, logout } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const passport = require("passport");
const generateToken = require("../utils/generateToken");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    // On success, generate token and redirect to frontend with token in URL
    const token = generateToken(req.user._id);
    const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").split(",")[0];
    res.redirect(`${clientUrl}/auth-success?token=${token}`);
  }
);

module.exports = router;
