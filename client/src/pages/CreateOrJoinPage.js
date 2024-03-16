import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import ShortUniqueId from "short-unique-id";
import { useNavigate } from "react-router-dom"; 

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
    <div>
      <h1>Welcome {username}</h1>
      <button onClick={createRoom}>Create Room</button>
      <input
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Join Room..."
      />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
};

export default CreateOrJoinPage;
