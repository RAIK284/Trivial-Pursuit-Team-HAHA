const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema(
  {
    gamesession: { type: String},
  },
  {
    collection: "GameSessionInfo",
  }
);

mongoose.model('GameSessionInfo', gameSessionSchema);
