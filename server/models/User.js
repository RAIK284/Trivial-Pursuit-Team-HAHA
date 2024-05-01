const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    ID: { type: String, default: uuidv4 },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    total_score: { type: Number, default: 0 },
  },
  {
    collection: "UserInfo",
  }
);

const User = mongoose.model("UserInfo", userSchema);
module.exports = User;
