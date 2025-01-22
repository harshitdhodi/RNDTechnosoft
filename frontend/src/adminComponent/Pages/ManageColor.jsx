// src/components/ColorPicker.js
import React, { useContext } from 'react';
import { FaPalette } from 'react-icons/fa';
import { ColorContext } from '../../contexts/ColourContext';

const ColorPicker = () => {
  const { colors, handleChange, handleSave } = useContext(ColorContext);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center">
        <FaPalette className="mr-2" /> Color Picker
      </h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <label className="block text-gray-700 font-semibold w-1/3">
            Primary Color:
          </label>
          <input
            type="color"
            value={colors.primary}
            onChange={(e) => handleChange('primary', e.target.value)}
            className="ml-4 w-1/2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex items-center">
          <label className="block text-gray-700 font-semibold w-1/3">
            Secondary Color:
          </label>
          <input
            type="color"
            value={colors.secondary}
            onChange={(e) => handleChange('secondary', e.target.value)}
            className="ml-4 w-1/2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex items-center">
          <label className="block text-gray-700 font-semibold w-1/3">
            Accent Color 1:
          </label>
          <input
            type="color"
            value={colors.accent1}
            onChange={(e) => handleChange('accent1', e.target.value)}
            className="ml-4 w-1/2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex items-center">
          <label className="block text-gray-700 font-semibold w-1/3">
            Accent Color 2:
          </label>
          <input
            type="color"
            value={colors.accent2}
            onChange={(e) => handleChange('accent2', e.target.value)}
            className="ml-4 w-1/2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
      <button
        onClick={handleSave}
        className="mt-6 w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Save
      </button>
    </div>
  );
};

export default ColorPicker;
