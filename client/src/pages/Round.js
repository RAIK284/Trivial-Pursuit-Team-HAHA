import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RoundPage.css";
import lobbyBackground from "../assets/img/space-ufo-bg.jpg";
import blankSpinner from "../assets/img/blank-spinner.png";


const RoundPage = () => {
  const [currentRound, setCurrentRound] = useState(1);
  const navigate = useNavigate();

  const onRoundClick = (round) => {
    if (round === currentRound) {
      setCurrentRound(currentRound + 1);
    }
  };

  return (
    <div className="round-page" style={{ backgroundImage: `url(${lobbyBackground})` }}>
      <div className="progress-bar">
        {[1, 2, 3, 4].map((round, index) => (
          <React.Fragment key={round}>
            <div
              className={`round round-${round} ${
                currentRound === round ? "current" : ""
              } ${currentRound > round ? "completed" : ""}`}
              onClick={() => onRoundClick(round)}
              style={{ cursor: currentRound === round ? 'pointer' : 'default' }}
            >
              {currentRound === round ? (<><span>ROUND</span><span>{round}</span></>) : round}
            </div>
            {(index < 3 || index === 3) && <div className="connector"></div>}
          </React.Fragment>
        ))}
        <img src={blankSpinner} alt="Spinner" className="connected-image" />
      </div>
    </div>
  );
};

export default RoundPage;