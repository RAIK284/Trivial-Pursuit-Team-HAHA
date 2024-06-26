import React from "react";
import ShortUniqueId from "short-unique-id";
import { useNavigate } from "react-router-dom";
import "../styles/CreateOrJoinPage.css";
import useRegister from "../hooks/useRegister";
import useGameSession from "../hooks/useGameSession";
import Leaderboard from "../assets/img/leaderboard.png";

const CreateOrJoinPage = () => {
  const navigate = useNavigate();
  const { randomUUID } = new ShortUniqueId({ length: 5 });
  const { username } = useRegister();
  const { handleGameSession } = useGameSession();

  const createRoom = () => {
    const newGameSession = randomUUID();
    handleGameSession(newGameSession).then(() => {
      navigate(`/lobby/${newGameSession}`);
    });
  };

  return (
    <div data-testid="create-page" className="create-or-join-page">
      <h1 className="game-portal-header">
        Welcome to the Game Portal{" "}
        <span className="create-or-join-username">{username}</span>
      </h1>
      <div className="buttons-container">
        <div className="button-block">
          <img
            src="https://images.vexels.com/media/users/3/249681/isolated/preview/2e033ab207c08313f20bf7478f0b064b-90-s-arcade-color-stroke.png"
            alt="Start Game Icon"
          />
          <button
            data-testid="new-game-button"
            onClick={createRoom}
            className="create-button"
          >
            NEW GAME{" "}
          </button>
        </div>
        <div className="button-block">
          <img
            src="https://cdn-icons-png.freepik.com/512/8237/8237258.png"
            alt="Join Game Icon"
          />
          <button
            data-testid="join-game-button"
            onClick={() => {
              navigate("/join");
            }}
            className="join-button"
          >
            JOIN GAME{" "}
          </button>
        </div>
        <div className="button-block">
          <img src={Leaderboard} alt="Join Game Icon" />
          <button
            data-testid="join-game-button"
            onClick={() => {
              navigate("/leaderboard");
            }}
            className="leaderboard-button"
          >
            LEADERBOARD{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrJoinPage;
