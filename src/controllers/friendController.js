const User = require("../models/User");

exports.sendRequest = async (req, res) => {
  try {
    const target = await User.findOne({ email: req.body.email });
    if (!target) return res.status(404).json({ message: "User not found" });
    if (target._id.equals(req.user._id)) return res.status(400).json({ message: "Cannot add yourself" });
    if (target.friendRequests.includes(req.user._id))
      return res.status(400).json({ message: "Request already sent" });

    target.friendRequests.push(req.user._id);
    await target.save();
    res.json({ message: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const sender = await User.findById(req.params.userId);
    if (!sender) return res.status(404).json({ message: "User not found" });

    req.user.friendRequests = req.user.friendRequests.filter((id) => !id.equals(sender._id));
    req.user.friends.push(sender._id);
    sender.friends.push(req.user._id);

    await req.user.save();
    await sender.save();
    res.json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const friend = await User.findById(req.params.userId);
    req.user.friends = req.user.friends.filter((id) => !id.equals(friend._id));
    friend.friends = friend.friends.filter((id) => !id.equals(req.user._id));
    await req.user.save();
    await friend.save();
    res.json({ message: "Friend removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friends", "name email avatar status")
      .populate("friendRequests", "name email avatar");
    res.json({ friends: user.friends, requests: user.friendRequests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
