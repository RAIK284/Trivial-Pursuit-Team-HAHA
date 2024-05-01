import React from 'react';
import { IoPersonCircleSharp } from "react-icons/io5";
import LoadingBar from './LoadingBar';
import tempWheel from "../assets/img/Blank.png";

const PlayerContainer = ({ players, scores }) => {
  return (
    <div className="Game-all-player-container">
      {players.map((player, index) => (
        <div key={index} className="Game-single-player-container">
          <LoadingBar score={scores[player.playerName] || 0} />
          <div className="Game-icon-name-container">
            <IoPersonCircleSharp
              className="Game-icon"
              style={{ backgroundColor: player.playerColor }}
              color="black"
              size={40}
            />
            <div className="name-score-container">
              <div className="Game-player-name">{player.playerName}</div>
              <div className="game-score">Score: {scores[player.playerName] || 0}</div>
            </div>
            <img alt="wedges" className="temporary-wheel-image" src={tempWheel} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerContainer;
