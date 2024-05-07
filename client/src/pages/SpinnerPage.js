import React, { useState } from "react";
import "../styles/SpinnerPage.css";
import { Wheel } from "react-custom-roulette";

// Import images for each category
import History from "../assets/img/history.png";
import Science from "../assets/img/science.png";
import Art from "../assets/img/art.png";
import Literature from "../assets/img/english.png";
import Geography from "../assets/img/geography.png";
import Sports from "../assets/img/sports.png";

const SpinnerPage = () => {
  const data = [
    {
      option: "History",
      style: { backgroundColor: "#ffc501", textColor: "black" },
    },
    {
      option: "Science",
      style: { backgroundColor: "#01ff2a", textColor: "black" },
    },
    {
      option: "Art",
      style: { backgroundColor: "#ae01ff", textColor: "black" },
    },
    {
      option: "Literature",
      style: { backgroundColor: "#ff01e6", textColor: "black" },
    },
    {
      option: "Geography",
      style: { backgroundColor: "#4356fd", textColor: "black" },
    },
    {
      option: "Sports",
      style: { backgroundColor: "#ff9211", textColor: "black" },
    },
  ];

  // Image mapping
  const imageMap = {
    History,
    Science,
    Art,
    Literature,
    Geography,
    Sports,
  };

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  return (
    <div className="SpinnerPage">
      <div className="wheel-button-container">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={() => {
            setMustSpin(false);
          }}
        />
        <button className="spin-button" onClick={handleSpinClick}>
          SPIN
        </button>
      </div>
      <div className="result-display">
        <span className="spinning">{mustSpin ? "Spinning..." : ""}</span>
        {!mustSpin && (
          <img
            src={imageMap[data[prizeNumber].option]}
            alt={data[prizeNumber].option}
          />
        )}
      </div>
    </div>
  );
};

export default SpinnerPage;
