import React from "react";
import "../styles/GamePageResults.css";

const GamePageResults = () => {
  // Array of player objects with usernames, scores, and positions
  const players = [
    { username: "Player 1", score: 100, position: "1st" },
    { username: "Player 2", score: 90, position: "2nd" },
    { username: "Player 3", score: 80, position: "3rd" },
    { username: "Player 4", score: 70, position: "4th" },
  ];

  const sortedPlayers = players.sort((a, b) => b.score - a.score);

  return (
    <div className="game-results-container">
      <h2>Game Results</h2>
      <div className="player-container">
        {sortedPlayers.map((player, index) => (
          <div key={index} className="player-card">
            <span className="player-position">{player.position}</span>
            <span className="player-username">{player.username}</span>
            <span className="player-score">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamePageResults;