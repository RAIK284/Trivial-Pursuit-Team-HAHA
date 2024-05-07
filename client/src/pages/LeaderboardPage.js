import React from "react";
import useTopScores from "../hooks/useTopScores";
import "../styles/LeaderboardPage.css";
const LeaderboardPage = () => {
  const { topScores, isLoading, error } = useTopScores();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (error) {
    return null;
  }

  return (
    <div className="LeaderboardPage">
      <h1 className="join-game-header leaderboard-header">Leaderboard</h1>
      <div className="leaderboard-columns">
        <span>Rank</span>
        <span>Usernames</span>
        <span>Total Points</span>
      </div>
      <ul className="leaderboard-container">
        {topScores.map((scores, index) => (
          <li
            className="leaderboard-item-container"
            key={index}
          >
            <span className="leaderboard-rank">0{index + 1}</span>
            <span className="leaderboard-username">{scores.username}</span>
            <span class="leaderboard-score">{scores.total_score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderboardPage;
