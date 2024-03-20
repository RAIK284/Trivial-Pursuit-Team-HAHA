import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/RoundPage.css";
import lobbyBackground from "../assets/img/space-ufo-bg.jpg";


const RoundPage = () => {
  const [currentRound, setCurrentRound] = useState(1);
  const navigate = useNavigate();
  const { gameSession } = useParams();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
    }
  }, [countdown, navigate, gameSession]);
  const onRoundClick = (round) => {
    if (round === currentRound) {
      setCurrentRound(currentRound + 1);
    }
  };
  const handleStartGame = () => {
    // setTimeout(() => {
    //   navigate(`/game/${gameSession}`);
    // }, 5000);
  };

  useEffect(() => {
    handleStartGame();
  });
  return (
    <div
      className="round-page"
      style={{ backgroundImage: `url(${lobbyBackground})` }}
    >
      <div className="round-countdown">Your Game Will Start In <span style={{color: "var(--planet-orange)"}}>{countdown}</span></div>
      <div className="progress-bar">
        {[1, 2, 3, 4].map((round, index) => (
          <React.Fragment key={round}>
            <div
              className={`round round-${round} ${
                currentRound === round ? "current" : ""
              } ${currentRound > round ? "completed" : ""}`}
              onClick={() => onRoundClick(round)}
              style={{ cursor: currentRound === round ? "pointer" : "default" }}
            >
              {currentRound === round ? (
                <>
                  <span>ROUND</span>
                  <span>{round}</span>
                </>
              ) : (
                round
              )}
            </div>
            {(index < 3 || index === 3) && <div className="connector"></div>}
          </React.Fragment>
        ))}
        <div style={{width: "5rem"}}></div>
      </div>
    </div>
  );
};

export default RoundPage;
