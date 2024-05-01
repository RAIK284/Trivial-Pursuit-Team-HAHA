const GameSession = require("../models/GameSession");

exports.createGameSession = async (req, res) => {
  const { gamesession } = req.body;
  try {
    await GameSession.create({
      gamesession,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error", message: error.message });
  }
};

exports.sessionExists = async (req, res) => {
  const { room } = req.body;
  const sessionExists = await GameSession.findOne({ gamesession: room });
  if (sessionExists) {
    res.json({ exists: true });
  } else {
    res.json({ exists: false });
  }
};
