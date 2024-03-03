const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  players: [{
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, default: 0 }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  // Include other game session fields if necessary
});

const GameSession = mongoose.model('GameSession', gameSessionSchema);

module.exports = GameSession;
