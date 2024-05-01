import React from "react";
import useTopScores from "../hooks/useTopScores";


// HELP: WHERE ELSE IS LEADERBOARD PAGE????
const LeaderboardPage = () => {
  const { topScores, isLoading, error } = useTopScores();

  if (isLoading) {
    return <div className="leaderboard-loading">Loading scores...</div>;
  }

  if (error) {
    return <div className="leaderboard-error">Error: {error}</div>;
  }

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Leaderboard</h1>
      <table className="leaderboard-table">
        <thead>
          <tr className="leaderboard-table-header">
            <th className="leaderboard-header-player">Player</th>
            <th className="leaderboard-header-score">Score</th>
          </tr>
        </thead>
        <tbody>
          {topScores.map((score, index) => (
            <tr className="leaderboard-score-row" key={index}>
              <td className="leaderboard-score-player">{score.player}</td>
              <td className="leaderboard-score-value">{score.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardPage;

