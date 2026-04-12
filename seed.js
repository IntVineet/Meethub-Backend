const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./src/models/User");

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // Remove existing test user if any
  await User.deleteOne({ email: "test@meethub.com" });

  const user = await User.create({
    name: "Test User",
    email: "test@meethub.com",
    password: "test1234",
  });

  console.log("✅ Test user created:");
  console.log("   Email   : test@meethub.com");
  console.log("   Password: test1234");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
