const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(express.json());
app.use(cors());
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const JWT_SECRET =
  "asdf897978bxcvbx{()asdfasdfa1819821xcvb8792315i13o{4?nhirevggr98";

// Mongo Database Connection
const mongoURL =
  "mongodb+srv://harhimd:triviadatabasepass@trivialpursuitdatabase.cnaptj5.mongodb.net/?retryWrites=true&w=majority&appName=TrivialPursuitDatabase";
mongoose
  .connect(mongoURL, { useNewUrlParser: true })
  .then(() => {
    console.log("Database Connection Successful!");
  })
  .catch((e) => console.log(e));

require("./models/User");
const User = mongoose.model("UserInfo");

// Creates a User
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ username });

    if (oldUser) {
      return res.send({ error: "User Exists" });
    }
    await User.create({
      username,
      password: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

// Logs in a User
app.post("/login-user", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ error: "User Not Found" }); // Use 404 for not found
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid Password" }); // Use 401 for unauthorized
  }

const token = jwt.sign({ username: user.username }, JWT_SECRET);
  return res.status(200).json({ status: "ok", data: token });
});

app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userUsername = decoded.username;
    User.findOne({ username: userUsername })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {
  }
});

app.listen(5000, () => {
  console.log("Server Started");
});
