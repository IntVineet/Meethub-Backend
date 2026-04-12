const Meeting = require("../models/Meeting");
const { v4: uuidv4 } = require("uuid");

exports.createMeeting = async (req, res) => {
  try {
    const { title, scheduledAt, isInstant } = req.body;
    const meeting = await Meeting.create({
      title,
      roomId: uuidv4(),
      host: req.user._id,
      scheduledAt,
      isInstant: isInstant || false,
    });
    res.status(201).json(meeting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [{ host: req.user._id }, { participants: req.user._id }],
      status: { $ne: "ended" },
    }).populate("host", "name avatar");
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMeetingByRoom = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ roomId: req.params.roomId }).populate("host", "name avatar");
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.endMeeting = async (req, res) => {
  try {
    await Meeting.findOneAndUpdate({ roomId: req.params.roomId }, { status: "ended" });
    res.json({ message: "Meeting ended" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
