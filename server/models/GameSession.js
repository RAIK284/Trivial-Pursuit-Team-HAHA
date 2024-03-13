const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo' }],
  },
  {
    collection: "GameSession",
  }
);

mongoose.model('GameSession', gameSessionSchema);
