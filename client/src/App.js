import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LobbyPage from "./pages/LobbyPage";
import SpinnerPage from "./pages/SpinnerPage";
import CreateOrJoinPage from "./pages/CreateOrJoinPage";
import GamePage from "./pages/GamePage";
import RoundPage from "./pages/Round";
import JoinGamePage from "./pages/JoinGamePage";
import LeaderboardPage from "./pages/LeaderboardPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/lobby/:gameSession" element={<LobbyPage />} />
        <Route path="/spinner-page/:gameSession" element={<SpinnerPage />} />
        <Route path="/create-or-join-game" element={<CreateOrJoinPage />} />
        <Route path="/game/:gameSession" element={<GamePage />} />
        <Route path="/round/:gameSession" element={<RoundPage />} />
        <Route path="/join" element={<JoinGamePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />

      </Routes>
    </Router>
  );
}

export default App;
