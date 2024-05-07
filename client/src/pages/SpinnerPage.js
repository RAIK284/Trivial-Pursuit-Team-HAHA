import React, { useState, useEffect } from "react";
import "../styles/SpinnerPage.css";
import { Wheel } from "react-custom-roulette";
import { useNavigate, useParams } from "react-router-dom";

// Import images for each category
import History from "../assets/img/history.png";
import Science from "../assets/img/science.png";
import Art from "../assets/img/art.png";
import Literature from "../assets/img/english.png";
import Geography from "../assets/img/geography.png";
import Sports from "../assets/img/sports.png";

const SpinnerPage = () => {
  const { gameSession } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    const newPrizeNumber = 0;
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  }, []);

  const handleStopSpinning = () => {
    setMustSpin(false);
    const timer = setTimeout(() => {
      // navigate(`/round/${gameSession}`, {
      //   state: { category: data[prizeNumber].option },
      // });
    }, 3000);
    return () => clearTimeout(timer);
  };

  return (
    <div className="SpinnerPage">
      <div className="wheel-button-container">
        <Wheel
        spinDuration={.5}
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={handleStopSpinning}
        />
      </div>
      <div className="result-display">
        <span className="spinning">{mustSpin ? "Spinning..." : ""}</span>
        {!mustSpin && (
          <>
            <div className="spinner-image-container">
              <img
                src={imageMap[data[prizeNumber].option]}
                alt={data[prizeNumber].option}
              />
              <div>{data[prizeNumber].option}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SpinnerPage;
