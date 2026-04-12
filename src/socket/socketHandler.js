const { Server } = require("socket.io");
const Message = require("../models/Message");

const onlineUsers = new Map(); // userId -> socketId

const initSocket = (server) => {
  const io = new Server(server, {
    cors: { 
      origin: (process.env.CLIENT_URL || "").split(",").map(url => url.trim()), 
      credentials: true 
    },
  });

  io.on("connection", (socket) => {
    // User comes online
    socket.on("user:online", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("users:online", Array.from(onlineUsers.keys()));
    });

    // Private chat
    socket.on("chat:private", async ({ senderId, receiverId, content }) => {
      const message = await Message.create({ sender: senderId, receiver: receiverId, content, type: "private" });
      const populated = await message.populate("sender", "name avatar");
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) io.to(receiverSocket).emit("chat:message", populated);
      socket.emit("chat:message", populated);
    });

    // Room chat
    socket.on("chat:room", async ({ senderId, roomId, content }) => {
      const message = await Message.create({ sender: senderId, roomId, content, type: "room" });
      const populated = await message.populate("sender", "name avatar");
      io.to(roomId).emit("chat:room:message", populated);
    });

    // Join meeting room
    socket.on("room:join", ({ roomId, userId, userName }) => {
      socket.join(roomId);
      socket.to(roomId).emit("room:user-joined", { userId, userName, socketId: socket.id });
    });

    // WebRTC Signaling
    socket.on("webrtc:offer", ({ to, offer, from }) => {
      io.to(to).emit("webrtc:offer", { offer, from });
    });

    socket.on("webrtc:answer", ({ to, answer, from }) => {
      io.to(to).emit("webrtc:answer", { answer, from });
    });

    socket.on("webrtc:ice-candidate", ({ to, candidate }) => {
      io.to(to).emit("webrtc:ice-candidate", { candidate, from: socket.id });
    });

    // Call signaling (1-to-1)
    socket.on("call:invite", ({ to, from, callType, callerName }) => {
      const targetSocket = onlineUsers.get(to);
      if (targetSocket) io.to(targetSocket).emit("call:incoming", { from, callType, callerName, socketId: socket.id });
    });

    socket.on("call:accepted", ({ to, from }) => {
      io.to(to).emit("call:accepted", { from });
    });

    socket.on("call:rejected", ({ to }) => {
      io.to(to).emit("call:rejected");
    });

    socket.on("call:ended", ({ to }) => {
      io.to(to).emit("call:ended");
    });

    // Leave room
    socket.on("room:leave", ({ roomId, userId }) => {
      socket.leave(roomId);
      socket.to(roomId).emit("room:user-left", { userId, socketId: socket.id });
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit("users:online", Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = { initSocket };
