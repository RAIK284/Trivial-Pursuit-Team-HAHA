import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosRocket } from "react-icons/io";
import "../styles/JoinGamePage.css";

const JoinGamePage = () => {
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();

  const joinRoom = async (e) => {
    e.preventDefault();
    if (sessionId) {
      try {
        const res = await fetch("http://localhost:5000/sessionExists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();
        if (data.exists) {
          navigate(`/lobby/${sessionId}`);
        } else {
          alert("This room does not exist.");
        }
      } catch (err) {
        console.error("Error checking session existence:", err);
      }
    }
  };

  return (
    <div className="join-game-container">
      <h1 className="join-game-header">Join Game</h1>

      <div className="join-button-input-container">
        <div class="text-input-container">
          <span class="join-game-text">
            Enter The Trivial Pursuit!
          </span>
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
