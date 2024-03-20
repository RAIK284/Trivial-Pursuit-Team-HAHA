import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RoundPage.css";
import lobbyBackground from "../assets/img/space-ufo-bg.jpg";
import blankSpinner from "../assets/img/blank-spinner.png";


const RoundPage = () => {
  const [currentRound, setCurrentRound] = useState(1);
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