const router = require("express").Router();
const { register, login, logout } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const passport = require("passport");
const generateToken = require("../utils/generateToken");

const getClientUrl = () => {
  const urls = process.env.CLIENT_URL?.split(",") || ["http://localhost:5173"];
  return urls[0].trim();
};

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${getClientUrl()}/login`,
    session: false,
  }),
  (req, res) => {
    try {
      const token = generateToken(req.user._id);
      const clientUrl = getClientUrl();
      res.redirect(`${clientUrl}/auth-success?token=${token}`);
    } catch (error) {
      console.error("Google Auth Error:", error);
      res.redirect(`${getClientUrl()}/login`);
    }
  }
);

module.exports = router;
