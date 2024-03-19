import React, { useState } from "react";
import "../styles/JoinGamePage.css";

const JoinGamePage = () => {
  const [sessionId, setSessionId] = useState("");

  const handleInputChange = (event) => {
    setSessionId(event.target.value);
  };

  const handleJoinGame = () => {
    console.log("Joining game with session ID:", sessionId);
  };

  return (
    <div className="join-game-container">
      <h1>Game Mode</h1>
      <p>Join a game here:</p>
      <input
        type="text"
        placeholder="Session ID or Enter Game Session ID"
        value={sessionId}
        onChange={handleInputChange}
      />
      <button className="join-button" onClick={handleJoinGame}>
        Join Game
      </button>
    </div>
  );
};

export default JoinGamePage;