import React from "react";
import { IoIosRocket } from "react-icons/io";
import "../styles/JoinGamePage.css";
import useGameSession from "../hooks/useGameSession";
const JoinGamePage = () => {
  const { joinRoom, sessionId, setSessionId } = useGameSession();

  return (
    <div className="join-game-container">
      <h1 className="join-game-header">Join Game</h1>

      <div className="join-button-input-container">
        <div class="text-input-container">
          <span class="join-game-text">Enter The Trivial Pursuit!</span>
          <form className="join-game-form" onSubmit={joinRoom}>
            <input
              className="join-page-input"
              type="text"
              placeholder="Game Session ID Here..."
              value={sessionId}
              onChange={(e) => {
                setSessionId(e.target.value);
              }}
            />
            <IoIosRocket
              style={{
                color: `${sessionId ? "white" : "rgba(0, 0, 0, 0.222)"}`,
              }}
              onClick={joinRoom}
              className="rocket-icon"
              size={30}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinGamePage;
