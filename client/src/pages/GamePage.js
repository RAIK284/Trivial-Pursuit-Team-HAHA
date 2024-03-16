import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import lobbyBackground from "../assets/img/space-saucer-bg.jpg";
import tempWheel from "../assets/img/Blank.png";
import "../styles/GamePage.css";
import { IoPersonCircleSharp } from "react-icons/io5";

const GamePage = () => {
  const [username, setUsername] = useState("");
  const { gameSession } = useParams();
  const [players, setPlayers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const playerColors = ["#E97AEB", "#AFEC7F", "#3FF3C8", "#FFAF36"];

  const [playerClicked, setPlayerClicked] = useState("");
  const [socket, setSocket] = useState(null);
  const handleClick = (answerChoices) => {
    console.log("click");

    socket.emit("answer_clicked", {
      clickedBy: username,
      isCorrect: answerChoices.isCorrect,
      answer: answerChoices.answer,
      room: gameSession,
    });
  };
  useEffect(() => {
    const newSocket = io.connect("http://localhost:5000");
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await fetch("http://localhost:5000/userData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ token: window.localStorage.getItem("token") }),
        });

        const data = await res.json();
        setUsername(data.data.username);
      } catch (err) {
        console.error(err);
      }
    };

    getUserInfo();
  }, []);

  useEffect(() => {
    if (socket && username) {
      console.log(`Attempting to connect to room: ${gameSession}`);
      socket.emit("join_room", { user: username, room: gameSession });

      socket.on("update_player_list", (playerList) => {
        const updatedPlayers = playerList.map((playerName, index) => ({
          playerName,
          playerColor: playerColors[index % playerColors.length],
        }));
        setPlayers(updatedPlayers);
      });

      const fetchQuestions = async () => {
        const response = await fetch(
          "https://the-trivia-api.com/api/questions?categories=history&limit=5"
        );
        const data = await response.json();
        setQuestions(data);
        socket.emit("create_questions", { questions: data, room: gameSession });
      };

      fetchQuestions();

      socket.on("questions_created", (data) => {
        setQuestions(data.questions);
        if (data.questions.length > 0) {
          const combinedAnswers = [
            {
              answer: data.questions[0].correctAnswer,
              isCorrect: true,
              selectedBy: null,
            },
            ...data.questions[0].incorrectAnswers.map((incorrect) => ({
              answer: incorrect,
              isCorrect: false,
            })),
          ];

          setShuffledAnswers(shuffleArray(combinedAnswers));
        }
      });

      socket.on("click_recieved", (data) => {
        console.log(data.clickedBy, data.isCorrect, data.answer);
        setPlayerClicked(data.clickedBy);
      });

      return () => {
        socket.emit("leave_room", { room: gameSession, user: username });
        socket.off("update_player_list");
        socket.off("questions_created");
        socket.off("click_recieved");
      };
    }
  }, [socket, username, gameSession]);

  function shuffleArray(array) {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  return (
    <div className="game-page-container">
      <div>
        <img className="lobby-bg" alt="background" src={lobbyBackground} />
        <div>
          {Array.isArray(questions) && questions.length > 0 && (
            <>
              <div className="question-header">{questions[0].question}</div>
              <div className="question-choices-container">
                {shuffledAnswers.map((answerChoices, index) => (
                  <div
                    onClick={() => {
                      handleClick(answerChoices);
                    }}
                    key={index}
                    className={`question-choices question-choice-${index + 1}`}
                  >
                    {answerChoices.answer}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div>{playerClicked}</div>
      </div>

      <div className="player-question-container">
        <div className="Game-all-player-container">
          {players.map((player, index) => (
            <div className="Game-single-player-container" key={index}>
              <div className="loading-bar"></div>

              <div className="Game-icon-name-container">
                <IoPersonCircleSharp
                  className="Game-icon"
                  style={{ backgroundColor: player.playerColor }}
                  color="black"
                  size={40}
                />
                <div className="name-score-container">
                  <div className="Game-player-name">{player.playerName}</div>
                  <div className="game-score">Score: 0</div>
                </div>
                <img
                  alt="wedges"
                  className="temporary-wheel-image"
                  src={tempWheel}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
