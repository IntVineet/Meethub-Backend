const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    roomId: { type: String, default: uuidv4, unique: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    scheduledAt: { type: Date },
    isInstant: { type: Boolean, default: false },
    status: { type: String, enum: ["scheduled", "active", "ended"], default: "scheduled" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);
