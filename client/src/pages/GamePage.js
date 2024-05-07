import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";
import lobbyBackground from "../assets/img/space-saucer-bg.jpg";
import "../styles/GamePage.css";
import { IoPersonCircleSharp } from "react-icons/io5";
import useRegister from "../hooks/useRegister";
import TimerBar from "../components/TimerBar";
import PlayerContainer from "../components/PlayerContainer";
import QuestionChoices from "../components/QuestionChoices";
import tempWheel from "../assets/img/Blank.png";
import History from "../assets/img/history.png";

const GamePage = () => {
  const { username } = useRegister();
  const { gameSession } = useParams();
  const [players, setPlayers] = useState([]);
  const [aiScoresSet, setAiScoresSet] = useState(false);
  const location = useLocation();
  const category = location.state?.category || "defaultCategory";
  const [aiPlayers, setAiPlayers] = useState(() => {
    const storedAiPlayers = localStorage.getItem("aiPlayers");
    return storedAiPlayers
      ? JSON.parse(storedAiPlayers).map((ai) => ai.name)
      : [];
  });
  const [questions, setQuestions] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [scores, setScores] = useState({});
  const [timer, setTimer] = useState(5050);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [socket, setSocket] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  let numFetched = 1;

  function getSuffix(i) {
    const j = i % 10;
    const k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  }

  useEffect(() => {
    const newSocket = io.connect("http://localhost:5000");
    setSocket(newSocket);
    return () => {
      newSocket.close();
      newSocket.off("score_updated");
    };
  }, []);

  useEffect(() => {
    if (socket && username) {
      socket.emit("join_room", { user: username, room: gameSession });
      setScores({ [username]: 0 });
      socket.on("update_player_list", (playerList) => {
        const updatedPlayers = [
          ...playerList.map((playerName, index) => ({
            playerName,
            playerColor: ["#E97AEB", "#AFEC7F", "#3FF3C8", "#FFAF36"][
              index % 4
            ],
          })),
          ...aiPlayers.map((name, index) => ({
            playerName: name,
            playerColor: ["#E97AEB", "#AFEC7F", "#3FF3C8", "#FFAF36"][
              (index + 1) % 4
            ],
          })),
        ];
        setPlayers(updatedPlayers);
      });
      fetchQuestions();
    }
  }, [socket, username, gameSession, aiPlayers, category]);

  const fetchQuestions = async () => {
    const response = await fetch(
      `https://the-trivia-api.com/api/questions?categories=${category}&limit=${numFetched}`
    );
    const data = await response.json();
    setQuestions(data);
    if (data.length) {
      setShuffledAnswers(
        shuffleArray([
          ...data[0].incorrectAnswers.map((answer) => ({
            answer,
            isCorrect: false,
            selectedBy: [],
          })),
          { answer: data[0].correctAnswer, isCorrect: true, selectedBy: [] },
        ])
      );
    }
    socket.emit("create_questions", { questions: data, room: gameSession });
  };

  useEffect(() => {
    if (timer <= 0 && !answerRevealed && questions.length > questionIndex) {
      setAnswerRevealed(true);
      aiPlayers.forEach((aiPlayer, index) =>
        simulateAIAnswer(aiPlayer, shuffledAnswers, index)
      );
    }
  }, [timer, aiPlayers, questionIndex, questions, shuffledAnswers]);

  useEffect(() => {
    const interval =
      timer > 0 ? setInterval(() => setTimer((timer) => timer - 50), 50) : null;
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (answerRevealed) {
      setTimeout(() => {
        setAnswerRevealed(false);
        if (selectedAnswer?.isCorrect) {
          setScores((prev) => ({
            ...prev,
            [username]: (prev[username] || 0) + 100,
          }));
        }
        setSelectedAnswer(null);
        setQuestionIndex((prev) => prev + 1);
        setTimer(5050);
      }, 2000);
    }
  }, [answerRevealed, selectedAnswer]);

  const handleClick = (answer, index) => {
    if (!answerRevealed) {
      setSelectedAnswer({ index, isCorrect: answer.isCorrect });
      setShuffledAnswers((prev) =>
        prev.map((ans, i) =>
          i === index
            ? { ...ans, selectedBy: [...(ans.selectedBy || []), username] }
            : ans
        )
      );
      socket.emit("answer_clicked", {
        clickedBy: username,
        isCorrect: answer.isCorrect,
        answer: answer.answer,
        room: gameSession,
      });
    }
  };

  const simulateAIAnswer = (aiPlayer, answers, index) => {
    // Always pick the correct answer for simplicity in this adjustment
    const correct = true;
    const answerIndex = answers.findIndex((ans) => ans.isCorrect);

    if (answerIndex === -1) {
      return;
    }

    const selectedAnswer = answers[answerIndex];
    setShuffledAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      const currentSelectedBy = newAnswers[answerIndex].selectedBy || [];
      if (!currentSelectedBy.includes(aiPlayer)) {
        newAnswers[answerIndex].selectedBy = [...currentSelectedBy, aiPlayer];
      }
      return newAnswers;
    });

    // Adjust the score based on the AI player's index
    if (selectedAnswer.isCorrect) {
      let scoreIncrement = 100;
      if (index === 0) scoreIncrement = 300; // First AI player
      else if (index === 1) scoreIncrement = 200; // Second AI player
      else if (index === 2) scoreIncrement = 100; // Third AI player

      const updatedScore = (scores[aiPlayer] || 0) + scoreIncrement;
      setScores((prevScores) => ({ ...prevScores, [aiPlayer]: updatedScore }));
    }
  };

  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  return (
    <div data-testid="game-page" className="game-page-container">
      <img className="lobby-bg" alt="background" src={lobbyBackground} />
      <div className="game-page-inner-container">
        {questions.length > 0 && questionIndex < numFetched && (
          <>
            <div className="question-container">
              <div data-testid="question" className="question-header">
                <img style={{height: "6rem"}} src={History} />
                {questions[questionIndex]?.question}
              </div>
              <TimerBar
                width={2570}
                height={10}
                percentage={(timer / 5050) * 100}
              />
            </div>
            <QuestionChoices
              choices={shuffledAnswers}
              handleClick={handleClick}
              answerRevealed={answerRevealed}
              selectedAnswer={selectedAnswer}
            />
            <PlayerContainer players={players} scores={scores} />
          </>
        )}
        {questionIndex >= numFetched && (
          <div class="results-header-container">
            <div className="results-container">
              {players
                .map((player) => ({
                  ...player,
                  score: scores[player.playerName] || 0,
                }))
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <div className="player-result">
                    <div
                      className="results-place-container"
                      key={player.playerName}
                    >
                      <span
                        style={{ backgroundColor: player.playerColor }}
                        class="results-name"
                      >
                        {player.playerName}
                      </span>
                      <span className="results-icon">
                        {" "}
                        <IoPersonCircleSharp color="black" size={150} />
                        Score: {player.score}
                      </span>
                      <img className="place-icon" src={tempWheel} />

                      <span
                        style={{ backgroundColor: player.playerColor }}
                        class="results-place"
                      >
                        {getSuffix(index + 1)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            <h1 className="results-header">Round Results</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;
