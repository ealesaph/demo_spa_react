import React, { useEffect, useState } from 'react';
import { useOnePieceWordle } from './hooks/useOnePieceWordle';
import GameBoard from './components/GameBoard';
import Keyboard from './components/Keyboard';
import GameOverModal from './components/GameOverModal';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const {
    targetCharacter,
    guesses,
    currentGuess,
    gameOver,
    won,
    attempts,
    message,
    stats,
    keyboardStatus,
    MAX_ATTEMPTS,
    WORD_LENGTH,
    handleKeyPress,
    resetGame
  } = useOnePieceWordle();

  const [showModal, setShowModal] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [modalCharacter, setModalCharacter] = useState(null);

  // Mostrar modal cuando el juego termina
  useEffect(() => {
    if (gameOver && attempts > 0) {
      setModalCharacter(targetCharacter);
      setShowModal(true);

      if (won) {
        setConfetti(true);
        const confettiTimer = setTimeout(() => setConfetti(false), 4000);
        return () => clearTimeout(confettiTimer);
      }

      return undefined;
    }

    setShowModal(false);
    setConfetti(false);
    setModalCharacter(null);
  }, [gameOver, won, attempts, targetCharacter]);

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
  };

  const handlePlayAgain = () => {
    closeModal();
    resetGame();
    setConfetti(false);
  };

  return (
    <div className="app">
      <ThemeToggle />
      
      <header className="app-header">
        <h1>🏴‍☠️ One Piece Wordle</h1>
        <p>Adivina el personaje del día</p>
        <div className="header-stats">
          <span> {stats.wins} victorias</span>
          <span> Racha: {stats.currentStreak}</span>
          <span> {stats.gamesPlayed} partidas</span>
        </div>
      </header>

      {message && (
        <div className={`message ${message.includes('¡Felicidades!') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <GameBoard
        guesses={guesses}
        currentGuess={currentGuess}
        maxAttempts={MAX_ATTEMPTS}
        wordLength={WORD_LENGTH}
        gameOver={gameOver}
      />

      <div className="game-info">
        <span>Intentos: {attempts}/{MAX_ATTEMPTS}</span>
        <span> Personaje: ???</span>
      </div>

      <Keyboard 
        onKeyPress={handleKeyPress} 
        keyStatus={keyboardStatus}
      />

      <GameOverModal
        isOpen={showModal}
        won={won}
        attempts={attempts}
        character={modalCharacter}
        showAnswer={gameOver}
        onPlayAgain={handlePlayAgain}
        stats={stats}
      />

      {confetti && (
        <div className="confetti-container">
          🎉 🎊 ✨ 🎉 🎊 ✨ 🎉 🎊 ✨
        </div>
      )}
    </div>
  );
}

export default App;