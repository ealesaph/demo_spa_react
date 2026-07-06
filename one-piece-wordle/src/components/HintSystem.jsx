import React, { useState } from 'react';
import './HintSystem.css';

const HintSystem = ({ character, attempts, maxAttempts }) => {
    const [showHint, setShowHint] = useState(false);

    const getHints = () => {
        const hints = [];

        // Pista 1: Afiliación (disponible desde el inicio)
        hints.push(`Afiliación: ${character?.affiliation || '???'}`);

        // Pista 2: Fruta del Diablo (disponible después de 2 intentos)
        if (attempts >= 2) {
            hints.push(`Fruta: ${character?.fruit || 'Sin fruta'}`);
        }

        // Pista 3: Recompensa (disponible después de 3 intentos)
        if (attempts >= 3) {
            hints.push(`Recompensa: ${character?.bounty || 'Desconocida'}`);
        }

        // Pista 4: Haki (disponible después de 4 intentos)
        if (attempts >= 4) {
            hints.push(`Haki: ${character?.haki || 'Sin Haki'}`);
        }

        // Pista 5: Descripción (disponible en el último intento)
        if (attempts >= 5) {
            hints.push(`Descripción: ${character?.description || '???'}`);
        }

        return hints;
    };

    const hints = getHints();

    return (
        <div className="hint-system">
            <button
                className="hint-toggle"
                onClick={() => setShowHint(!showHint)}
            >
                {showHint ? '🔽 Ocultar pistas' : 'Mostrar pistas'}
            </button>

            {showHint && (
                <div className="hints-container">
                    <h4>Pistas disponibles:</h4>
                    {hints.length > 0 ? (
                        <ul className="hints-list">
                            {hints.map((hint, index) => (
                                <li key={index} className="hint-item">
                                    {hint}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-hints">Sigue intentando para desbloquear más pistas</p>
                    )}
                    <div className="hint-progress">
                        <span>Progreso: {Math.min(attempts, maxAttempts)}/{maxAttempts}</span>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${(attempts / maxAttempts) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HintSystem;