// src/components/LetterTile.jsx
import React from 'react';
import './LetterTile.css';

const LetterTile = ({letter, status}) => {
    // status debería: 'correct', 'present', 'absent', 'empty', 'idle',
    const getStatusClass = () => {
        switch(status) {
            case 'correct': return 'letter-tile correct';
            case 'present': return 'letter-tile present';
            case 'absent': return 'letter-tile absent';
            default: return 'letter-tile';
        }
    };

    return(
        <div className={getStatusClass()}>
            {letter}
        </div>
    );
};

export default LetterTile;