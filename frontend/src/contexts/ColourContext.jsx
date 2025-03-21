import React, { createContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
    const [colors, setColors] = useState({
        primary: '#171717',
        secondary: '#ffffff',
        accent1: '#0000ff',
        accent2: '#ffff00',
    });
    console.log(useSelector((state) => state || null))
    // ✅ SAFELY Access Redux state to prevent "Cannot read properties of undefined"
    const colorData = useSelector((state) => state.colors || null);
console.log(colorData)
    useEffect(() => {
        if (colorData) {
            setColors(colorData); // ✅ Update state with Redux data
            updateCSSVariables(colorData);
            localStorage.setItem('colors', JSON.stringify(colorData));
        }
    }, [colorData]);

    const updateCSSVariables = (colors) => {
        document.documentElement.style.setProperty('--primary-color', colors.primary);
        document.documentElement.style.setProperty('--secondary-color', colors.secondary);
        document.documentElement.style.setProperty('--accent1-color', colors.accent1);
        document.documentElement.style.setProperty('--accent2-color', colors.accent2);
    };

    return (
        <ColorContext.Provider value={{ colors }}>
            {children}
        </ColorContext.Provider>
    );
};
