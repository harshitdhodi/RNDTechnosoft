// components/HeadingSection.jsx
import React from 'react';

const HeadingSection = ({ heading, subheading, setHeading, setSubheading, saveHeadings }) => {
  const handleHeadingChange = (e) => setHeading(e.target.value);
  const handleSubheadingChange = (e) => setSubheading(e.target.value);

  return (
    <div className="mb-8 border border-gray-200 shadow-lg p-4 rounded">
      <div className="grid md:grid-cols-2 md:gap-2 grid-cols-1">
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Heading</label>
          <input
            type="text"
            value={heading}
            onChange={handleHeadingChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Sub heading</label>
          <input
            type="text"
            value={subheading}
            onChange={handleSubheadingChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
          />
        </div>
      </div>
      <button
        onClick={saveHeadings}
        className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif"
      >
        Save
      </button>
    </div>
  );
};

export default HeadingSection;