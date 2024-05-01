const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema(
  {
    gamesession: { type: String},
  },
  {
    collection: "GameSessionInfo",
  }
);

const GameSession = mongoose.model("GameSessionInfo", gameSessionSchema);
module.exports = GameSession;