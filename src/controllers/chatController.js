const Message = require("../models/Message");

exports.getPrivateMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      type: "private",
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRoomMessages = async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId, type: "room" })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
