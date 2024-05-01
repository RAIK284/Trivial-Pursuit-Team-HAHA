require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const userRoutes = require("./routes/userRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const setupSocket = require("./controllers/socketController");

app.use(express.json());
app.use(cors());

// Mongo Database Connection
const mongoURL = process.env.MONGO_URL;
mongoose
  .connect(mongoURL, { useNewUrlParser: true })
  .then(() => {
    console.log("Database Connection Successful!");
  })
  .catch((e) => console.log(e));


// Apply Routes
app.use(userRoutes);
app.use(scoreRoutes);
app.use(sessionRoutes);

module.exports = app;

// Create the Server
const server = http.createServer(app);
setupSocket(server);

server.listen(5000, () => {
  console.log("Server is Running");
});
