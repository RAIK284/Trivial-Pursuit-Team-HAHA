import React, { useState } from "react";

const GameSession = () => {
  const [gameSessionID, setGameSessionID] = useState("");

  return (
    <div>
      {/* Enter the GameSession ID here to join the Lobby with the corresponding game session ID */}
      <input onChange={(e) => setGameSessionID(e.target.value)}></input>
    </div>
  );
};

export default GameSession;
