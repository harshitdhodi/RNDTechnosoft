// src/contexts/ColorContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
    const [colors, setColors] = useState({
        primary: '#171717',
        secondary: '#ffffff',
        accent1: '#0000ff',
        accent2: '#ffff00',
    });

    useEffect(() => {
        const loadColors = async () => {
            try {
                const response = await axios.get('/api/colors/get-colors');
                if (response.data.colors) {
                    setColors(response.data.colors);
                    updateCSSVariables(response.data.colors);
                    localStorage.setItem('colors', JSON.stringify(response.data.colors));
                }
            } catch (error) {
                console.error('Error fetching colors:', error);
            }
        }

        loadColors();
    }, []);

    const updateCSSVariables = (colors) => {
        document.documentElement.style.setProperty('--primary-color', colors.primary);
        document.documentElement.style.setProperty('--secondary-color', colors.secondary);
        document.documentElement.style.setProperty('--accent1-color', colors.accent1);
        document.documentElement.style.setProperty('--accent2-color', colors.accent2);
    };

    const handleChange = (colorName, colorValue) => {
        const newColors = {
            ...colors,
            [colorName]: colorValue,
        };
        setColors(newColors);
        updateCSSVariables(newColors);
        localStorage.setItem('colors', JSON.stringify(newColors));
    };

    const handleSave = async () => {
        try {
            await axios.post('/api/colors/save-colors', { colors });
            alert('Colors saved successfully!');
        } catch (error) {
            console.error('Error saving colors:', error);
            alert('Failed to save colors.');
        }
    };

    return (
        <ColorContext.Provider value={{ colors, handleChange, handleSave }}>
            {children}
        </ColorContext.Provider>
    );
};