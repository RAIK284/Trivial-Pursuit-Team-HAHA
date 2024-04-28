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
      return res.send({ error: "Username Is Already In Use" });
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
    return res.status(404).json({ error: "That User Does Not Exist" }); 
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Incorrect Password" }); 
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

// Update User Score
app.post("/update-score", async (req, res) => {
  const { username, score } = req.body;

  if (!score || score < 0) {
    return res.status(400).json({ error: "Invalid score value provided." });
  }

  try {
    const user = await User.findOneAndUpdate(
      { username: username },
      { $inc: { total_score: score } }, 
      { new: true } 
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ status: "ok", new_total_score: user.total_score });
  } catch (error) {
    console.error("Failed to update score:", error);
    return res.status(500).json({ status: "error", message: "Internal server error." });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


// Finds top Scores

app.get('/api/top-scores', async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ total_score: -1 })  
      .limit(10)                  
      .select('username total_score'); 
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top scores', error: error.message });
  }
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
    socket.username = data.user; 

    if (!roomPlayers[data.room]) {
      roomPlayers[data.room] = [];
    }
    if (!roomPlayers[data.room].includes(data.user)) {
      roomPlayers[data.room].push(data.user);
    }

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

  socket.on("answer_clicked", async (data) => {
    const scoreToAdd = data.isCorrect ? 500 : 0;

    const user = await User.findOneAndUpdate(
      { username: data.clickedBy },
      { $inc: { total_score: scoreToAdd } },
      { new: true }
    );

    if (user) {
        io.to(data.room).emit("score_updated", {
            user: data.clickedBy,
            score: user.total_score  
        });
    }
});

socket.on("update_score", async ({ user, score, room }) => {
  const userDoc = await User.findOneAndUpdate(
    { username: user },
    { $set: { total_score: score } },
    { new: true }
  );
  
  io.to(room).emit("score_updated", { user: user, score: userDoc.total_score });
});


  socket.on("create_questions", (data) => {
    io.to(data.room).emit("questions_created", data);
  });


  
  
  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms).filter((item) => item !== socket.id);

    rooms.forEach((room) => {
      const username = socket.username; 

      const index = roomPlayers[room].indexOf(username);
      if (index !== -1) {
        roomPlayers[room].splice(index, 1);

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
