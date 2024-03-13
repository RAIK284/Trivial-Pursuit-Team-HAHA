import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CreateOrJoinPage = () => {
  const [username, setUsername] = useState("");

  const getUserInfo = async () => {
    try {
      const res = await fetch("http://localhost:5000/userData", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ token: window.localStorage.getItem("token") }),
      });

      const data = await res.json();
      console.log(data, "dynamicUserInfo");
      setUsername(data.data.username);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div>
      <h1>Welcome {username}</h1>

      {/* This button will Create a Game Session ID and take you to the corresponding 
      lobby page for that game session ID. Every lobby should have a unique game session ID */}
      <button>
        <Link to={"/lobby"}>Create Game</Link>
      </button>

      {/* This button will take you to the GameSessionPage.js page that page will have an input
      You will enter a GameSession ID into that input. That game session id will come from someone who used
      the Create Game button.
      Multiple users should be able to enter the same game session ID and join a lobby.
      */}
      <button>
        <Link>Join Game</Link>
      </button>

    </div>
  );
};

export default CreateOrJoinPage;
