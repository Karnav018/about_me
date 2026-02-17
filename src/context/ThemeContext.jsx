import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dracula');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dracula' ? 'light' : 'dracula');
    };

    const setThemeByName = (name) => {
        if (['dracula', 'light', 'matrix'].includes(name)) {
            setTheme(name);
        }
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setThemeByName }}>
            {children}
        </ThemeContext.Provider>
    );
};
