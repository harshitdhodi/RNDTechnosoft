// components/HeadingSection.jsx
import React from 'react';

const HeadingSection = ({ 
  heading, 
  subheading, 
  setHeading, 
  setSubheading, 
  saveHeadings,
  errors = {},
  loading = false
}) => {
  const handleHeadingChange = (e) => setHeading(e.target.value);
  const handleSubheadingChange = (e) => setSubheading(e.target.value);

  return (
    <div className="mb-8 border border-gray-200 shadow-lg p-4 rounded">
      <div className="grid md:grid-cols-2 md:gap-2 grid-cols-1">
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
            Heading {errors.heading && <span className="text-red-500 text-sm font-normal">({errors.heading})</span>}
          </label>
          <input
            type="text"
            value={heading}
            onChange={handleHeadingChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ${
              errors.heading ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
            Sub heading {errors.subheading && <span className="text-red-500 text-sm font-normal">({errors.subheading})</span>}
          </label>
          <input
            type="text"
            value={subheading}
            onChange={handleSubheadingChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ${
              errors.subheading ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
      </div>
      <button
        onClick={saveHeadings}
        disabled={loading}
        className={`px-4 py-2 ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-slate-700 hover:bg-slate-900'
        } text-white rounded transition duration-300 font-serif flex items-center justify-center`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </>
        ) : (
          'Save'
        )}
      </button>
    </div>
  );
};

export default HeadingSection;