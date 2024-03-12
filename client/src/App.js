import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import GameSessionPage from './pages/GameSessionPage';
import LobbyPage from './pages/LobbyPage';
import SpinnerPage from './pages/SpinnerPage';
import CreateOrJoinPage from './pages/CreateOrJoinPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/game-session" element={<GameSessionPage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/spinner" element={<SpinnerPage />} />
        <Route path="/create-or-join-game" element={<CreateOrJoinPage />} />

      </Routes>
    </Router>
  );
}

export default App;
