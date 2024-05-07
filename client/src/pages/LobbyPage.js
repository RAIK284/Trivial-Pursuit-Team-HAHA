import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import lobbyBackground from "../assets/img/space-ufo-bg.jpg";
import "../styles/LobbyPage.css";
import { IoPersonCircleSharp } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import useRegister from "../hooks/useRegister";
import useLobbySocket from "../hooks/useLobbySocket";
import { IoCloseSharp } from "react-icons/io5";

const LobbyPage = () => {
  const { gameSession } = useParams();
  const { username } = useRegister();
  const [currentMessage, setCurrentMessage] = useState("");
  const [aiPlayers, setAiPlayers] = useState(() => {
    const savedAIPlayers = localStorage.getItem("aiPlayers");
    return savedAIPlayers ? JSON.parse(savedAIPlayers) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState("easy");
  const playerColors = ["#E97AEB", "#AFEC7F", "#3FF3C8", "#FFAF36"];

  const { messages, players, startGame, sendMessage } = useLobbySocket(
    gameSession,
    username
  );

  const handleAddAIPlayer = () => {
    setShowModal(true);
  };

  const confirmAddAIPlayer = () => {
    const nextComputerNumber = aiPlayers.length + 1;
    const aiPlayerName = `Computer ${nextComputerNumber}`;
    const newAIPlayers = [
      ...aiPlayers,
      { name: aiPlayerName, difficulty: aiDifficulty },
    ];
    setAiPlayers(newAIPlayers);
    localStorage.setItem("aiPlayers", JSON.stringify(newAIPlayers));
    setShowModal(false);
  };

  const coloredPlayers = players.map((playerName, index) => ({
    playerName,
    playerColor: playerColors[index % playerColors.length],
  }));

  const displayPlayers = [
    ...coloredPlayers,
    ...aiPlayers.map((ai, index) => ({
      playerName: `${ai.name}`,
      playerColor: playerColors[(index + players.length) % playerColors.length],
    })),
  ];

  const messageDisplayRef = useRef(null);
  useEffect(() => {
    if (messageDisplayRef.current) {
      const { current: messageDisplayElement } = messageDisplayRef;
      messageDisplayElement.scrollTop = messageDisplayElement.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="page-container">
      <img className="lobby-bg" alt="background" src={lobbyBackground} />
      <div className="player-button-container">
        <div className="all-player-container">
          {displayPlayers.map((player, index) => (
            <div className="single-player-container" key={index}>
              <div
                style={{ backgroundColor: player.playerColor, width: "100%" }}
                className="player-name"
              >
                {player.playerName}
              </div>
              <IoPersonCircleSharp color="black" size={140} />
            </div>
          ))}
        </div>

        <button onClick={startGame} className="start-game-button">
          Start Game
        </button>
        <button
          onClick={handleAddAIPlayer}
          className="start-game-button ai-button"
        >
          Add a Computer <FaPlus />
        </button>
        {gameSession && (
          <p className="session-id">
            Session ID: <span data-testid="gameSession">{gameSession}</span>
          </p>
        )}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="header-x">
                <h1 className="ai-header">Select AI Difficulty</h1>
              </div>
              <IoCloseSharp
                onClick={() => {
                  setShowModal(false);
                }}
                className="ai-icon"
                size={30}
              />

              <div className="ai-modal-content">
                <button
                  className="ai-easy"
                  onClick={() => {
                    setAiDifficulty("Easy");
                    confirmAddAIPlayer();
                  }}
                >
                  Easy
                </button>
                <button
                  className="ai-medium"
                  onClick={() => {
                    setAiDifficulty("Medium");
                    confirmAddAIPlayer();
                  }}
                >
                  Medium
                </button>
                <button
                  className="ai-hard"
                  onClick={() => {
                    setAiDifficulty("Hard");
                    confirmAddAIPlayer();
                  }}
                >
                  Hard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-room-container">
        <h2 className="chat-room-header">Chat Room</h2>
        <div
          ref={messageDisplayRef}
          className="message-display scrollbar"
          id="scrollbar1"
        >
          {messages.map((msg, index) => (
            <p className="message" key={index}>
              <span
                style={{
                  color:
                    coloredPlayers.find((p) => p.playerName === msg.username)
                      ?.playerColor || "black",
                }}
              >
                {msg.username}
              </span>
              : {msg.message}
            </p>
          ))}
        </div>
        <div className="chat-container">
          <form
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(currentMessage);
              setCurrentMessage("");
            }}
          >
            <input
              maxLength={100}
              className="chat-input"
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Enter a message..."
            />
            <div>
              <LuSendHorizonal
                onClick={() => {
                  sendMessage(currentMessage);
                  setCurrentMessage("");
                }}
                className="send-icon"
                size={25}
              />
            </div>
          </form>
        </div>
        <span className="message-length">{currentMessage.length}/75</span>
      </div>
    </div>
  );
};

export default LobbyPage;
