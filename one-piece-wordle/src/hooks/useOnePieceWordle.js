import { useState, useEffect, useMemo, useCallback } from "react";
import { getCharacterOfTheDay, getRandomCharacter, loadCharacters, characters } from "../data/characters";

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 16;
const STORAGE_KEYS = {
    target: 'onePieceWordle_target',
    game: 'onePieceWordle_game',
    stats: 'onePieceWordle_stats'
};

const normalizeGuess = (value = '') => value.toLowerCase().replace(/[^a-z]/g, '');

const getCookie = (name) => {
    if (typeof document === 'undefined') return '';

    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : '';
};

const setCookie = (name, value, days = 365) => {
    if (typeof document === 'undefined') return;

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
};

const deleteCookie = (name) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

const persistTargetCharacter = (character, mode = 'daily') => {
    if (!character || typeof window === 'undefined') return;

    const payload = {
        mode,
        date: new Date().toDateString(),
        character
    };

    const serialized = JSON.stringify(payload);
    localStorage.setItem(STORAGE_KEYS.target, serialized);
    setCookie(STORAGE_KEYS.target, serialized);
};

const readPersistedTargetCharacter = () => {
    if (typeof window === 'undefined') return null;

    try {
        const storedValue = localStorage.getItem(STORAGE_KEYS.target);
        if (storedValue) {
            return JSON.parse(storedValue);
        }

        const cookieValue = getCookie(STORAGE_KEYS.target);
        if (cookieValue) {
            return JSON.parse(cookieValue);
        }
    } catch (error) {
        console.warn('No se pudo leer el personaje persistido:', error);
    }

    return null;
};

const persistGameState = (gameData) => {
    if (typeof window === 'undefined') return;

    const serialized = JSON.stringify(gameData);
    localStorage.setItem(STORAGE_KEYS.game, serialized);
    setCookie(STORAGE_KEYS.game, serialized);
};

const readPersistedGameState = () => {
    if (typeof window === 'undefined') return null;

    try {
        const storedValue = localStorage.getItem(STORAGE_KEYS.game);
        if (storedValue) {
            return JSON.parse(storedValue);
        }

        const cookieValue = getCookie(STORAGE_KEYS.game);
        if (cookieValue) {
            return JSON.parse(cookieValue);
        }
    } catch (error) {
        console.warn('No se pudo leer el juego persistido:', error);
    }

    return null;
};

const persistStats = (stats) => {
    if (typeof window === 'undefined') return;

    const serialized = JSON.stringify(stats);
    localStorage.setItem(STORAGE_KEYS.stats, serialized);
    setCookie(STORAGE_KEYS.stats, serialized);
};

const readPersistedStats = () => {
    if (typeof window === 'undefined') return null;

    try {
        const storedValue = localStorage.getItem(STORAGE_KEYS.stats);
        if (storedValue) {
            return JSON.parse(storedValue);
        }

        const cookieValue = getCookie(STORAGE_KEYS.stats);
        if (cookieValue) {
            return JSON.parse(cookieValue);
        }
    } catch (error) {
        console.warn('No se pudo leer las estadísticas persistidas:', error);
    }

    return null;
};

export const useOnePieceWordle = () => {
    // Estado del juego
    const [targetCharacter, setTargetCharacter] = useState(null);
    const [characterPool, setCharacterPool] = useState(characters);
    const [guesses, setGuesses] = useState([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [message, setMessage] = useState('');
    const [celebrationTriggered, setCelebrationTriggered] = useState(false);
    const [stats, setStats] = useState({
        wins: 0,
        losses: 0,
        currentStreak: 0,
        maxStreak: 0,
        gamesPlayed: 0
    });
    const [showTargetCharacter, setShowTargetCharacter] = useState(false);

    // useMemo: Calcular el estado del teclado
    const keyboardStatus = useMemo(() => {
        const status = {};

        guesses.forEach(guess => {
            const statuses = guess.statuses || [];

            statuses.forEach((letterStatus, index) => {
                const letter = guess.word[index]?.toUpperCase();

                if (!letter) return;

                if (!status[letter] ||
                    letterStatus === 'correct' ||
                    (letterStatus === 'present' && status[letter] !== 'correct')) {
                    status[letter] = letterStatus;
                }
            });
        });

        return status;
    }, [guesses]);

    useEffect(() => {
        let active = true;

        loadCharacters().then((loadedCharacters) => {
            if (active) {
                const nextPool = Array.isArray(loadedCharacters) && loadedCharacters.length > 0
                    ? loadedCharacters
                    : characters;
                setCharacterPool(nextPool);
            }
        });

        return () => {
            active = false;
        };
    }, []);

    const selectTargetCharacter = useCallback((pool = characterPool, mode = 'daily') => {
        if (!Array.isArray(pool) || pool.length === 0) {
            return null;
        }

        const today = new Date().toDateString();
        const persistedTarget = readPersistedTargetCharacter();

        let nextCharacter = null;

        if (mode === 'daily' && persistedTarget?.character && persistedTarget.date === today) {
            nextCharacter = persistedTarget.character;
        } else {
            nextCharacter = mode === 'random'
                ? getRandomCharacter(pool)
                : getCharacterOfTheDay(pool);
        }

        setTargetCharacter(nextCharacter);
        setShowTargetCharacter(false);
        persistTargetCharacter(nextCharacter, mode);
        return nextCharacter;
    }, [characterPool]);

    // useEffect: Cargar personaje del día
    useEffect(() => {
        if (characterPool.length > 0) {
            selectTargetCharacter(characterPool, 'daily');
        }
    }, [characterPool, selectTargetCharacter]);

    // useEffect: Cargar estadísticas guardadas
    useEffect(() => {
        const savedStats = readPersistedStats();
        if (savedStats) {
            setStats(savedStats);
        }
    }, []);

    // useEffect: Guardar estadísticas
    useEffect(() => {
        if (stats.gamesPlayed > 0) {
            persistStats(stats);
        }
    }, [stats]);

    //useEffect: Cargar juego guardado
    useEffect(() => {
        const savedGame = readPersistedGameState();
        if (savedGame) {
            const today = new Date().toDateString();
            if (savedGame.date === today) {
                setGuesses(savedGame.guesses || []);
                setCurrentGuess(savedGame.currentGuess || '');
                setGameOver(savedGame.gameOver || false);
                setWon(savedGame.won || false);
                setAttempts(savedGame.attempts || 0);
            }
        }
    }, []);

    //useEffect: Guardar juego automáticamente
    useEffect(() => {
        if (targetCharacter) {
            const gameData = {
                date: new Date().toDateString(),
                guesses,
                currentGuess,
                gameOver,
                won,
                attempts
            };
            persistGameState(gameData);
        }
    }, [guesses, currentGuess, gameOver, won, attempts, targetCharacter]);

    //Funciones de comparación de personajes
    const compareAttributes = useCallback((guessCharacter, targetCharacter) => {
        if (!targetCharacter) return [];

        const comparisons = [];
        const attributes = ['fullName', 'affiliation', 'bounty', 'fruit', 'haki'];

        attributes.forEach(attr => {
            const guessValue = guessCharacter[attr] || '';
            const targetValue = targetCharacter[attr] || '';

            if (guessValue === targetValue) {
                comparisons.push('correct');
            } else if (targetValue.includes(guessValue) || guessValue.includes(targetValue)) {
                comparisons.push('present');
            } else {
                comparisons.push('absent');
            }
        });

        return comparisons;
    }, []);

    const getLetterStatuses = useCallback((guessWord, targetWord) => {
        const normalizedGuess = normalizeGuess(guessWord);
        const normalizedTarget = normalizeGuess(targetWord);

        if (!normalizedGuess || !normalizedTarget) {
            return [];
        }

        const guessLetters = normalizedGuess.split('');
        const targetLetters = normalizedTarget.split('');
        const statuses = Array(guessLetters.length).fill('absent');
        const remainingTargetLetters = [...targetLetters];

        guessLetters.forEach((letter, index) => {
            if (letter === remainingTargetLetters[index]) {
                statuses[index] = 'correct';
                remainingTargetLetters[index] = null;
            }
        });

        guessLetters.forEach((letter, index) => {
            if (statuses[index] === 'correct') return;

            const targetIndex = remainingTargetLetters.findIndex((targetLetter) => targetLetter === letter);
            if (targetIndex >= 0) {
                statuses[index] = 'present';
                remainingTargetLetters[targetIndex] = null;
            }
        });

        return statuses;
    }, []);

    //Funciones de estadísticas
    const updateStats = useCallback((win) => {
        setStats(prev => {
            const newStats = {
                ...prev,
                gamesPlayed: prev.gamesPlayed + 1
            };

            if (win) {
                newStats.wins = prev.wins + 1;
                newStats.currentStreak = prev.currentStreak + 1;
                newStats.maxStreak = Math.max(prev.maxStreak, prev.currentStreak + 1);
            } else {
                newStats.losses = prev.losses + 1;
                newStats.currentStreak = 0;
            }

            return newStats;
        });
    }, []);

    const startNewRound = useCallback(() => {
        selectTargetCharacter(characterPool, 'random');
        setGuesses([]);
        setCurrentGuess('');
        setGameOver(false);
        setWon(false);
        setAttempts(0);
        setMessage('');
        setCelebrationTriggered(false);
        localStorage.removeItem(STORAGE_KEYS.game);
        deleteCookie(STORAGE_KEYS.game);
    }, [characterPool, selectTargetCharacter]);

    const processGuess = useCallback((guessWord) => {
        const normalizedGuess = normalizeGuess(guessWord);

        if (!normalizedGuess) {
            setMessage('✍️ Escribe un personaje para intentar');
            return;
        }

        const guessedCharacter = characterPool.find((c) => {
            const aliases = [c.name, c.fullName].map((value) => normalizeGuess(value));
            return aliases.includes(normalizedGuess);
        });

        if (!guessedCharacter) {
            setMessage('❌ Personaje no encontrado');
            return;
        }

        const comparisons = compareAttributes(guessedCharacter, targetCharacter);
        const letterStatuses = getLetterStatuses(guessedCharacter.name, targetCharacter?.name || '');
        const newGuess = {
            word: guessedCharacter.name,
            statuses: letterStatuses
        };

        const nextAttempts = attempts + 1;

        setGuesses(prev => [...prev, newGuess]);
        setAttempts(nextAttempts);
        setCurrentGuess('');

        const isWin = comparisons.every(status => status === 'correct');

        if (isWin && !celebrationTriggered) {
            setWon(true);
            setGameOver(true);
            setCelebrationTriggered(true);
            updateStats(true);
            setMessage('🎉 ¡Felicidades! Has adivinado al personaje');
            setTimeout(() => {
                startNewRound();
            }, 1500);
        } else if (nextAttempts >= MAX_ATTEMPTS) {
            updateStats(false);
            setGameOver(true);
            setShowTargetCharacter(true);
            setMessage(`❌ No lo lograste. Era ${targetCharacter?.name || 'el personaje oculto'}`);
            setTimeout(() => {
                startNewRound();
            }, 1800);
        }
    }, [targetCharacter, attempts, characterPool, celebrationTriggered, compareAttributes, getLetterStatuses, updateStats, startNewRound]);

    // Manejo de teclado
    const handleKeyPress = useCallback((key) => {
        if (gameOver) return;

        if (key === 'ENTER') {
            const normalizedGuess = normalizeGuess(currentGuess);
            if (normalizedGuess.length > 0) {
                processGuess(currentGuess);
            } else {
                setMessage('✍️ Escribe un personaje para intentar');
            }
            return;
        }

        if (key === 'BACKSPACE') {
            setCurrentGuess(prev => prev.slice(0, -1));
            setMessage('');
            return;
        }

        if (currentGuess.length < WORD_LENGTH) {
            if (key.length === 1 && key.match(/[a-zA-Z]/)) {
                setCurrentGuess(prev => prev + key.toLowerCase());
                setMessage('');
            }
        }
    }, [currentGuess, gameOver, processGuess, WORD_LENGTH]);

    // Resetear juego
    const resetGame = useCallback(() => {
        selectTargetCharacter(characterPool, 'daily');
        setGuesses([]);
        setCurrentGuess('');
        setGameOver(false);
        setWon(false);
        setAttempts(0);
        setMessage('');

        // Limpiar juego guardado
        localStorage.removeItem(STORAGE_KEYS.game);
        deleteCookie(STORAGE_KEYS.game);
    }, [characterPool, selectTargetCharacter]);

    // Manejo del teclado físico
    useEffect(() => {
        const handlePhysicalKeyboard = (event) => {
            if (event.key === 'Enter') {
                handleKeyPress('ENTER');
                return;
            }

            if (event.key === 'Backspace') {
                handleKeyPress('BACKSPACE');
                return;
            }

            if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
                handleKeyPress(event.key.toUpperCase());
            }
        };

        window.addEventListener('keydown', handlePhysicalKeyboard);
        return () => window.removeEventListener('keydown', handlePhysicalKeyboard);
    }, [handleKeyPress]);

    return {
        // Estado
        targetCharacter,
        guesses,
        currentGuess,
        gameOver,
        won,
        attempts,
        message,
        stats,
        keyboardStatus,
        showTargetCharacter,
        MAX_ATTEMPTS,
        WORD_LENGTH,

        // Funciones
        handleKeyPress,
        resetGame
    };
};