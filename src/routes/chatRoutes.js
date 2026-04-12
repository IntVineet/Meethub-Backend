const router = require("express").Router();
const { getPrivateMessages, getRoomMessages } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.get("/private/:userId", protect, getPrivateMessages);
router.get("/room/:roomId", protect, getRoomMessages);

module.exports = router;
