import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import ShortUniqueId from "short-unique-id";
import { useNavigate } from "react-router-dom";
import "../styles/CreateOrJoinPage.css";
import useStore from "../hooks/useStore";

const socket = io.connect("http://localhost:5000");

const CreateOrJoinPage = () => {
  const navigate = useNavigate();
  const { randomUUID } = new ShortUniqueId({ length: 5 });
  const { username, loading } = useStore();
  const [room, setRoom] = useState("");
  const createRoom = () => {
    const newGameSession = randomUUID();
    handleGameSession(newGameSession).then(() => {
      navigate(`/lobby/${newGameSession}`);
    });
  };

  const joinRoom = async () => {
    if (room) {
      try {
        const res = await fetch("http://localhost:5000/sessionExists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ room }),
        });

        const data = await res.json();
        if (data.exists) {
          navigate(`/lobby/${room}`);
        } else {
          alert("This room does not exist.");
        }
      } catch (err) {
        console.error("Error checking session existence:", err);
      }
    }
  };

  const handleGameSession = async (gameSession) => {
    try {
      await fetch("http://localhost:5000/createsession", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ gamesession: gameSession }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="create-or-join-page">
      <h1>Welcome to the Game Portal {username}</h1>
      {/* This Input Will Be Moved to Aaron's Page Along with its Logic */}
      <input
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Join Room..."
      />
      <div className="buttons-container">
        <div className="button-block">
          <img src="https://cdn-icons-png.freepik.com/512/8237/8237258.png" alt="Join Game Icon" />
          <button onClick={joinRoom} className="join-button">Join a Game</button>
        </div>
        <div className="button-block">
          <img src="https://images.vexels.com/media/users/3/249681/isolated/preview/2e033ab207c08313f20bf7478f0b064b-90-s-arcade-color-stroke.png" alt="Start Game Icon" />
          <button onClick={createRoom} className="create-button">Create a Game</button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrJoinPage;
