import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const useLobbySocket = (gameSession, username) => {
  const socket = useMemo(() => io.connect("http://localhost:5000"), []);

  const [messages, setMessages] = useState([]);
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (username) {
      console.log(`Attempting to connect to room: ${gameSession}`);
      socket.emit("join_room", { user: username, room: gameSession });

      socket.on("receive_message", (data) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { username: data.username, message: data.message },
        ]);
      });

      socket.on("update_player_list", (playerList) => {
        setPlayers(playerList);
      });

      socket.on("navigate_to_game", () => {
        navigate(`/spinner-page/${gameSession}`);
    });
    }

    return () => {
      if (username) {
        socket.emit("leave_room", { room: gameSession, user: username });
        socket.off("receive_message");
        socket.off("update_player_list");
        console.log(`Leaving room: ${gameSession}`);
      }
    };
  }, [gameSession, username, socket]);

  const startGame = () => {
    socket.emit("start_game", { room: gameSession });
  };

  const sendMessage = (message) => {
    if (message) {
      socket.emit("send_message", { message, username, room: gameSession });
    }
  };

  return {
    messages,
    players,
    startGame,
    sendMessage,
  };
};

export default useLobbySocket;
