import React from "react";
import './Keyboard.css';

const Keyboard = ({ onKeyPress, keyStatus = {} }) => {
    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
    ];

    const getKeyClass = (key) => {
        const status = keyStatus[key];
        if (status === 'correct') return 'key-correct';
        if (status === 'present') return 'key-present';
        if (status === 'absent') return 'key-absent';
        return 'key-idle';
    };

    return (
        <div className="keyboard">
            {rows.map((row, index) =>(
                <div key={index} className="keyboard-row">
                    {row.map((key) => (
                        <button
                        key={key}
                        className={`key ${getKeyClass(key)} ${key.length < 1 ? 'key-wide' : ''}`}
                        onClick={() => onKeyPress(key)}
                        >
                            {key === 'BACKSPACE' ? '⌫' : key === 'ENTER' ? '↵' : key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Keyboard;