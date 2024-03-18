const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    ID: { type: String, default: uuidv4 }, 
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    collection: "UserInfo",
  }
);

mongoose.model("UserInfo", userSchema);
