import React from "react";
import LetterTile from "./LetterTile";
import './WordRow.css';

const WordRow = ({ word, wordLength = 8, statuses = [] }) => {
    // Limitar el tamaño de la palabra
    const letters = word ? word.padEnd(wordLength, ' ').split('') : Array(wordLength).fill('');

    return (
        <div className="word-row">
            {letters.map((letter, index) => (
            <LetterTile
                key={index}
                letter={letter}
                status={statuses[index] || 'idle'} />
            ))}
        </div>
    );
};

export default WordRow;