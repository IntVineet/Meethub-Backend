const router = require("express").Router();
const { sendRequest, acceptRequest, removeFriend, getFriends } = require("../controllers/friendController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getFriends);
router.post("/request", protect, sendRequest);
router.put("/accept/:userId", protect, acceptRequest);
router.delete("/:userId", protect, removeFriend);

module.exports = router;
