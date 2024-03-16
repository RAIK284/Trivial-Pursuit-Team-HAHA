const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET =
  "asdf897978bxcvbx{()asdfasdfa1819821xcvb8792315i13o{4?nhirevggr98";

app.use(express.json());
app.use(cors());

// Mongo Database Connection
const mongoURL =
  "mongodb+srv://harhimd:triviadatabasepass@trivialpursuitdatabase.cnaptj5.mongodb.net/?retryWrites=true&w=majority&appName=TrivialPursuitDatabase";
mongoose
  .connect(mongoURL, { useNewUrlParser: true })
  .then(() => {
    console.log("Database Connection Successful!");
  })
  .catch((e) => console.log(e));

// Creates a User
require("./models/User");
const User = mongoose.model("UserInfo");
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
  } catch (error) {}
});

//Creates the Server for Game Sessions
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const roomPlayers = {};

io.on("connection", (socket) => {
  app.post("/sessionExists", async (req, res) => {
    const { room } = req.body;
    const sessionExists = await GameSession.findOne({ gamesession: room });
    if (sessionExists) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });

  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", async (data) => {
    socket.join(data.room);
    socket.username = data.user; // Store the username on the socket for later reference

    if (!roomPlayers[data.room]) {
      roomPlayers[data.room] = [];
    }
    if (!roomPlayers[data.room].includes(data.user)) {
      roomPlayers[data.room].push(data.user);
    }

    // Emit the updated player list to all clients in the room, including the new joiner
    io.to(data.room).emit("update_player_list", roomPlayers[data.room]);
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", {
      username: data.username,
      message: data.message,
    });
  });

  socket.on("start_game", (data) => {
    io.to(data.room).emit("navigate_to_game");
  });

  socket.on("answer_clicked", (data) => {

    io.to(data.room).emit("click_recieved", data);
  });

  socket.on("create_questions", (data) =>{
    io.to(data.room).emit("questions_created", data)
  })

  socket.on("disconnecting", () => {
    // Get the list of rooms the socket is currently subscribed to, excluding the socket's own ID
    const rooms = Array.from(socket.rooms).filter((item) => item !== socket.id);

    rooms.forEach((room) => {
      const username = socket.username; // Retrieve the username stored on the socket

      // Remove the user from the room's player list
      const index = roomPlayers[room].indexOf(username);
      if (index !== -1) {
        roomPlayers[room].splice(index, 1);

        // Emit the updated player list to all clients still in the room
        io.to(room).emit("update_player_list", roomPlayers[room]);
      }
    });
  });
});

server.listen(5000, () => {
  console.log("Server is Running");
});

//Adds a Game Session
require("./models/GameSession");
const GameSession = mongoose.model("GameSessionInfo");
app.post("/createsession", async (req, res) => {
  const { gamesession } = req.body;
  try {
    await GameSession.create({
      gamesession,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error", message: error.message });
  }
});
