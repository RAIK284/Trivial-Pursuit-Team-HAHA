import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import lobbyBackground from "../assets/img/space-ufo-bg.jpg";
import "../styles/LobbyPage.css";
import { IoPersonCircleSharp } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";

const socket = io.connect("http://localhost:5000");

const LobbyPage = () => {
  const [username, setUsername] = useState("");
  const { gameSession } = useParams();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [players, setPlayers] = useState([]);
  const playerColors = ["#E97AEB", "#AFEC7F", "#3FF3C8", "#FFAF36"];
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await fetch("http://localhost:5000/userData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ token: window.localStorage.getItem("token") }),
        });

        const data = await res.json();
        setUsername(data.data.username);
      } catch (err) {
        console.error(err);
      }
    };

    getUserInfo();

    console.log(`Attempting to connect to room: ${gameSession}`);
    if (username) {
      socket.emit("join_room", { user: username, room: gameSession });
    }

    socket.on("receive_message", (data) => {
      console.log(`Message received: ${data.message}`);
      setMessages((prevMessages) => [
        ...prevMessages,
        { username: data.username, message: data.message },
      ]);
    });

    socket.on("update_player_list", (playerList) => {
      // Map the incoming list of usernames to objects with playerName and playerColor
      const updatedPlayers = playerList.map((playerName, index) => ({
        playerName,
        playerColor: playerColors[index % playerColors.length], // Cycle through playerColors
      }));
      setPlayers(updatedPlayers); // Update state with the new player objects
    });

    return () => {
      socket.emit("leave_room", { room: gameSession, user: username });
      socket.off("receive_message");
      socket.off("update_player_list");
      console.log(`Leaving room: ${gameSession}`);
    };
  }, [gameSession, username]);

  const sendMessage = () => {
    if (currentMessage !== "") {
      socket.emit("send_message", {
        message: currentMessage,
        username,
        room: gameSession,
      });
      setCurrentMessage("");
    }
  };

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
          {players.map((player, index) => (
            <div className="single-player-container" key={index}>
              <div
                style={{ backgroundColor: player.playerColor }}
                className="player-name"
              >
                {player.playerName}
              </div>
              <IoPersonCircleSharp color="black" size={140} />
            </div>
          ))}
        </div>
        <button
          onClick={navigate(`/spinner-page/${gameSession}`)}
          className="start-game-button"
        >
          Start Game
        </button>
        <p className="session-id">Session ID: {gameSession}</p>
      </div>

      <div class="chat-room-container">
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
                    players.find((p) => p.playerName === msg.username)
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
              sendMessage();
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
                onClick={sendMessage}
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
