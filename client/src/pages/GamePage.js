import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import lobbyBackground from "../assets/img/space-saucer-bg.jpg";
import tempWheel from "../assets/img/Blank.png";
import "../styles/GamePage.css";
import { IoPersonCircleSharp } from "react-icons/io5";
import useStore from "../hooks/useStore";
import TimerBar from "../components/TimerBar";
import LoadingBar from "../components/LoadingBar";

const GamePage = () => {
  const { username } = useStore();
  const { gameSession } = useParams();
  const [players, setPlayers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [scores, setScores] = useState({});
  const [timer, setTimer] = useState(5050);
  const [visibleTimer, setVisibleTimer] = useState(5000);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const playerColors = ["#E97AEB", "#AFEC7F", "#3FF3C8", "#FFAF36"];
  const [socket, setSocket] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  let numFetched = 2;

  const handleClick = (answerChoices, index) => {
    if (!answerRevealed) {
      setSelectedAnswer({ index, isCorrect: answerChoices.isCorrect });

      setShuffledAnswers((prevAnswers) => {
        const newAnswers = [...prevAnswers];
        if (!newAnswers[index].selectedBy) {
          newAnswers[index].selectedBy = [username];
        } else if (!newAnswers[index].selectedBy.includes(username)) {
          newAnswers[index].selectedBy.push(username);
        }
        return newAnswers;
      });

      socket.emit("answer_clicked", {
        clickedBy: username,
        isCorrect: answerChoices.isCorrect,
        answer: answerChoices.answer,
        room: gameSession,
      });
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 50);
        if (visibleTimer > 0) {
          setVisibleTimer((prevVisibleTimer) =>
            Math.max(prevVisibleTimer - 50, 0)
          );
        }
      }, 50);

      return () => clearInterval(interval);
    } else {
      setAnswerRevealed(true);
    }
  }, [timer]);

  useEffect(() => {
    if (answerRevealed && selectedAnswer !== null) {
      const updatedScore =
        (scores[username] || 0) + (selectedAnswer.isCorrect ? 100 : 0);
      setScores({ ...scores, [username]: updatedScore });

      socket.emit("update_score", {
        user: username,
        score: updatedScore,
        room: gameSession,
      });

      setTimeout(() => {
        setSelectedAnswer(null);
        setAnswerRevealed(false);
        setQuestionIndex(questionIndex + 1);
        setTimer(5050);
        setVisibleTimer(5000);
      }, 2000);
    } else {
      if (answerRevealed) {
        setTimeout(() => {
          setSelectedAnswer(null);
          setAnswerRevealed(false);
          setQuestionIndex(questionIndex + 1);
          setTimer(5050);
          setVisibleTimer(5000);
        }, 2000);
      }
    }
  }, [answerRevealed, selectedAnswer]);

  useEffect(() => {
    const newSocket = io.connect("http://localhost:5000");
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && username) {
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
          `https://the-trivia-api.com/api/questions?categories=history&limit=${numFetched}`
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
              selectedBy: [],
            },
            ...data.questions[0].incorrectAnswers.map((incorrect) => ({
              answer: incorrect,
              isCorrect: false,
              selectedBy: [],
            })),
          ];

          setShuffledAnswers(shuffleArray(combinedAnswers));
          setTimer(5050);
          setVisibleTimer(5000);
          setAnswerRevealed(false);
          setSelectedAnswer(null);
        }
      });

      socket.on("score_updated", ({ user, score }) => {
        setScores((prevScores) => ({
          ...prevScores,
          [user]: score,
        }));
      });

      return () => {
        socket.emit("leave_room", { room: gameSession, user: username });
        socket.off("update_player_list");
        socket.off("questions_created");
      };
    }
  }, [socket, username, gameSession]);

  useEffect(() => {
    if (questions.length > 0 && questionIndex < questions.length) {
      const currentQuestion = questions[questionIndex];
      const combinedAnswers = [
        {
          answer: currentQuestion.correctAnswer,
          isCorrect: true,
          selectedBy: [],
        },
        ...currentQuestion.incorrectAnswers.map((incorrect) => ({
          answer: incorrect,
          isCorrect: false,
          selectedBy: [],
        })),
      ];

      setShuffledAnswers(shuffleArray(combinedAnswers));
    }
  }, [questionIndex, questions]);

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
          {Array.isArray(questions) &&
          questions.length > 0 &&
          questionIndex < numFetched ? (
            <>
              <div className="question-header">
                {questions[questionIndex].question}
              </div>
              <div className="question-timer">
                <TimerBar
                  width={2000}
                  height={10}
                  percentage={(visibleTimer / 5000) * 100}
                />
              </div>
              <div className="question-choices-container">
                {shuffledAnswers.map((answerChoices, index) => (
                  <div
                    className={`question-choices question-choice-${index + 1} ${
                      answerRevealed
                        ? answerChoices.isCorrect
                          ? "question-true"
                          : "question-false"
                        : ""
                    } ${
                      selectedAnswer?.index === index ? "selected-choice" : ""
                    }`}
                    onClick={() => handleClick(answerChoices, index)}
                    key={index}
                  >
                    {answerChoices.answer}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="player-scores">
              {players.map((player, index) => (
                <div key={index} className="player-score">
                  <IoPersonCircleSharp
                    className="player-icon"
                    style={{ color: player.playerColor }}
                  />
                  <span className="player-name">{player.playerName}</span> -{" "}
                  <span className="player-score-value">
                    {scores[player.playerName] || 0}
                  </span>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>

      {questionIndex < numFetched && (
        <div className="player-question-container">
          <div className="Game-all-player-container">
            {players.map((player, index) => (
              <div key={index} className="Game-single-player-container">
                <LoadingBar score={scores[player.playerName] || 0} />
                <div className="Game-icon-name-container">
                  <IoPersonCircleSharp
                    className="Game-icon"
                    style={{ backgroundColor: player.playerColor }}
                    color="black"
                    size={40}
                  />
                  <div className="name-score-container">
                    <div className="Game-player-name">{player.playerName}</div>
                    <div className="game-score">
                      Score: {scores[player.playerName] || 0}
                    </div>
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
      )}
    </div>
  );
};
export default GamePage;
