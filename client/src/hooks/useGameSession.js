import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const useGameSession = () => {
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();

  // Create Game Session Function
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

  // Join Game Session Function
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

  return { handleGameSession, sessionId, setSessionId, joinRoom };
};

export default useGameSession;
