import React from "react";
import WordRow from "./WordRow";
import './GameBoard.css';

const GameBoard = ({ guesses, currentGuess, maxAttempts = 6, wordLength = 8, gameOver = false}) => {
    const rows = [];

    for (let i = 0; i < guesses.length; i++){
        rows.push(
            <WordRow
            key = {`guess-${i}`}
            word={guesses[i].word}
            wordLength={wordLength}
            statuses={guesses[i].statuses}
            />
        );
    }

    if (!gameOver && guesses.length < maxAttempts) {
        rows.push(
            <WordRow
            key = 'current-guess'
            word = {currentGuess}
            wordLength={wordLength}
            />
        );
    }

    const remainingRows = maxAttempts - rows.length;
    for (let i = 0; i < remainingRows; i++) {
        rows.push(
            <WordRow
            key={`empty-${i}`}
            word=''
            wordLength={wordLength}
            />
        );
    }

    return (
        <div className="game-board">
            {rows}
        </div>
    );
};

export default GameBoard;