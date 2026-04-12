const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

dotenv.config();
connectDB();

const session = require("express-session");
const passport = require("./src/config/passport");
const { initSocket } = require("./src/socket/socketHandler");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowed = (process.env.CLIENT_URL || "").split(",").map(o => o.trim());
    if (!origin || allowed.some(o => origin.startsWith(o.replace(/\/$/, "")))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Passport & Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "meethub_secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use("/v1/auth", authRoutes); // Support callback from Google Console screenshot
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/friends", require("./src/routes/friendRoutes"));
app.use("/api/meetings", require("./src/routes/meetingRoutes"));
app.use("/api/chat", require("./src/routes/chatRoutes"));

// Socket.io
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
