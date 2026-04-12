const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null for group/room chat
    roomId: { type: String }, // for in-meeting chat
    content: { type: String, required: true },
    type: { type: String, enum: ["private", "room"], default: "private" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
