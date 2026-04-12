const router = require("express").Router();
const { getProfile, updateProfile, changePassword } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.get("/me", protect, getProfile);
router.put("/me", protect, upload.single("avatar"), updateProfile);
router.put("/me/password", protect, changePassword);

module.exports = router;
