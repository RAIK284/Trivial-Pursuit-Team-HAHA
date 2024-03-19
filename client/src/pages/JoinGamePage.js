import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import "../styles/JoinGamePage.css";

const JoinGamePage = () => {
  const { gameSession } = useParams();
  const [sessionId, setSessionId] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io.connect("http://localhost:5000");
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

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
      <div className="semi-transparent-box">
        <h1>Game Mode</h1>
        <p>Join a game here:</p>
        <input
          type="text"
          placeholder="Enter Game Session ID"
          value={sessionId}
          onChange={handleInputChange}
        />
        <button className="join-button" onClick={handleJoinGame}>
          Join Game
        </button>
      </div>
    </div>
  );
};

export default JoinGamePage;