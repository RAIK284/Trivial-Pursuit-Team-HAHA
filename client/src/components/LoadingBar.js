import React from "react";

const LoadingBar = ({ score, maxScore = 1000, barHeight = 10 }) => {
    const widthPercentage = (score / maxScore) * 100;
  
    return (
      <div
        style={{
          width: "85%",
          backgroundColor: "#ccc",
          height: `${barHeight}px`,
        }}
      >
        <div
          style={{
            width: `${widthPercentage}%`,
            height: "100%",
            backgroundColor: "var(--planet-purple)",
          }}
        ></div>
      </div>
    );
  };

  export default LoadingBar;