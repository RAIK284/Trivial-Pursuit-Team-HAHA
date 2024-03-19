import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RoundPage = () => {
  const navigate = useNavigate();
  const { gameSession } = useParams();

  const handleStartGame = () => {
    setTimeout(() => {
      navigate(`/game/${gameSession}`);
    }, 2000);
  };

  useEffect(() => {
    handleStartGame();
  });

  return <div>You are on Round 1</div>;
};

export default RoundPage;
