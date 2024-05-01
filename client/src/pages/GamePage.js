import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import lobbyBackground from "../assets/img/space-saucer-bg.jpg";
import "../styles/GamePage.css";
import useRegister from "../hooks/useRegister";
import TimerBar from "../components/TimerBar";
import PlayerContainer from "../components/PlayerContainer";
import QuestionChoices from "../components/QuestionChoices";

const GamePage = () => {
  const { username } = useRegister();
  const { gameSession } = useParams();
  const [players, setPlayers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [scores, setScores] = useState({});
  const [timer, setTimer] = useState(5050);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [socket, setSocket] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  let numFetched = 2;

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
        const updatedPlayers = playerList.map((playerName, index) => ({
          playerName,
          playerColor: ["#E97AEB", "#AFEC7F", "#3FF3C8", "#FFAF36"][index % 4],
        }));
        setPlayers(updatedPlayers);
      });

      // TODO Questions Will Be Changed to Be Fetched in the Backend and that array will be Shuffled
      // and Distrbuted to Players who Are in the Lobby through the backend
      const fetchQuestions = async () => {
        const response = await fetch(
          `https://the-trivia-api.com/api/questions?categories=history&limit=${numFetched}`
        );
        const data = await response.json();
        setQuestions(data);
        socket.emit("create_questions", { questions: data, room: gameSession });
      };

      fetchQuestions();
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

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 50);
      }, 50);

      return () => clearInterval(interval);
    } else {
      setAnswerRevealed(true);
    }
  }, [timer]);

  useEffect(() => {
    if (answerRevealed && selectedAnswer !== null) {
      setTimeout(() => {
        if (selectedAnswer.isCorrect) {
          const updatedScore = (scores[username] || 0) + 100;
          setScores({ ...scores, [username]: updatedScore });
        }

        setSelectedAnswer(null);
        setAnswerRevealed(false);
        setQuestionIndex(questionIndex + 1);
        setTimer(5050);
      }, 2000);
    }
  }, [answerRevealed, selectedAnswer]);

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
    <div data-testid="game-page" className="game-page-container">
      <img className="lobby-bg" alt="background" src={lobbyBackground} />
      <div className="game-page-inner-container">
        {Array.isArray(questions) &&
        questions.length > 0 &&
        questionIndex < numFetched ? (
          <>
            <div>
              <div data-testid="question" className="question-header">
                {questions[questionIndex].question}
              </div>
              <div className="question-timer">
                <TimerBar
                  width={2570}
                  height={10}
                  percentage={(timer / 5050) * 100}
                />
              </div>
            </div>
            <div className="question-choices-container">
              <QuestionChoices
                choices={shuffledAnswers}
                handleClick={handleClick}
                answerRevealed={answerRevealed}
                selectedAnswer={selectedAnswer}
              />
            </div>
          </>
        ) : (
          <div></div>
        )}
        <div>
          {questionIndex < numFetched && (
            <PlayerContainer players={players} scores={scores} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
