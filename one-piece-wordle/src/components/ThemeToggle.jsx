import React, { useState, useEffect } from 'react';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(false);

    // Cargar preferencia de tema guardada
    useEffect(() => {
        const savedTheme = localStorage.getItem('onePieceWordle_theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
        localStorage.setItem('onePieceWordle_theme', newTheme ? 'dark' : 'light');

        // Guardar en cookie también (bonus)
        document.cookie = `theme=${newTheme ? 'dark' : 'light'}; path=/; max-age=${60 * 60 * 24 * 30}`;
    };

    return (
        <button className="theme-toggle" onClick={toggleTheme}>
            {isDark ? '☀️' : '🌙'}
        </button>
    );
};

export default ThemeToggle;