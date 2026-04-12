const router = require("express").Router();
const { createMeeting, getMeetings, getMeetingByRoom, endMeeting } = require("../controllers/meetingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createMeeting);
router.get("/", protect, getMeetings);
router.get("/:roomId", protect, getMeetingByRoom);
router.put("/:roomId/end", protect, endMeeting);

module.exports = router;
