import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

const LobbyPage = () => {
  const [username, setUsername] = useState("");
  const { gameSession } = useParams();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [players, setPlayers] = useState([]);

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
      setPlayers(playerList);
    });
  
    return () => {
      socket.emit("leave_room", { room: gameSession, user: username });
      socket.off("receive_message");
      socket.off("update_player_list");
      console.log(`Leaving room: ${gameSession}`);
    };
  }, [gameSession, username]); // This useEffect will rerun if gameSession or username changes
  

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

  return (
    <div>
      <h1>Lobby: {gameSession}</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            {msg.username}: {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
      <div>
        <h2>Players in Room:</h2>
        {players.map((player, index) => (
          <p key={index}>{player}</p>
        ))}
      </div>
    </div>
  );
};

export default LobbyPage;
