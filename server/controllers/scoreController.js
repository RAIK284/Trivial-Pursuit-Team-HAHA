const User = require("../models/User");

exports.updateScore = async (req, res) => {
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

    return res
      .status(200)
      .json({ status: "ok", new_total_score: user.total_score });
  } catch (error) {
    console.error("Failed to update score:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
};

exports.findTopScores = async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ total_score: -1 })
      .limit(10)
      .select("username total_score");
    res.json(topUsers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching top scores", error: error.message });
  }
};