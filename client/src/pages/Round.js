import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RoundPage = () => {
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
      navigate(`/game/${gameSession}`);
    }
  }, [countdown, navigate, gameSession]);

  return <div>You are on Round 1 Your Game Will Start in: {countdown}</div>;
};

export default RoundPage;
