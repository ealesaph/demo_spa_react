import React from "react";
import './GameOverModal.css';

const GameOverModal = ({
    isOpen,
    won,
    attempts,
    character,
    showAnswer = false,
    onPlayAgain,
    stats
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">
                    {won ? '¡Lo has logrado!' : 'Resultado'}
                </h2>

                {showAnswer && character ? (
                    <div className="modal-character">
                        <h3>El personaje era:</h3>
                        <div className="character-info">
                            <div className="character-name">{character?.fullName}</div>
                            <div className="character-detail">🏴‍☠️ {character?.affiliation}</div>
                            <div className="character-detail">💰 {character?.bounty}</div>
                            {character?.fruit && (
                                <div className="character-detail">🍎 {character.fruit}</div>
                            )}
                            {character?.haki && (
                                <div className="character-detail">⚡ {character.haki}</div>
                            )}
                            <div className="character-description">{character?.description}</div>
                        </div>
                    </div>
                ) : (
                    <div className="modal-character">
                        <h3>El personaje se ha ocultado</h3>
                        <div className="character-info">
                            <div className="character-description">La siguiente ronda tendrá un nuevo personaje aleatorio.</div>
                        </div>
                    </div>
                )}

                <div className="modal-stats">
                    <div className="stat-item">
                        <span className="stat-label">Intentos</span>
                        <span className="stat-value">{attempts}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Victorias</span>
                        <span className="stat-value">{stats?.wins || 0}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Racha actual</span>
                        <span className="stat-value">{stats?.currentStreak || 0}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Mejor racha</span>
                        <span className="stat-value">{stats?.maxStreak || 0}</span>
                    </div>
                </div>

                <button className="play-again-btn" onClick={onPlayAgain}>
                    🎮 Jugar de nuevo
                </button>
            </div>
        </div>
    );
};

export default GameOverModal;
