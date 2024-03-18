import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import ShortUniqueId from "short-unique-id";
import { useNavigate } from "react-router-dom"; 
import "../styles/CreateOrJoinPage.css"

const socket = io.connect("http://localhost:5000");

const CreateOrJoinPage = () => {
  const navigate = useNavigate(); 
  const { randomUUID } = new ShortUniqueId({ length: 5 });

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

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

  useEffect(() => {
    getUserInfo();
  }, []);

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
        <button onClick={createRoom} className="create-button">Create a Game</button>
        <button onClick={joinRoom} className="join-button">Join a Game</button>
      </div>

    </div>
  );
};

export default CreateOrJoinPage;
