import React from 'react';

const CateglogButton = ({ isMobileMenuOpen }) => {
  return (
    <a
      href={`/portfolio`}
      className={`fixed right-0 w-12 h-32 rounded-sm top-1/2 -translate-y-1/2 bg-[#f3ca0d] text-black text-xl font-semibold flex items-center justify-center shadow-lg z-40 hover:text-white transition-transform hover:scale-105 ${
        isMobileMenuOpen ? 'hidden' : ''
      }`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="writing-mode-vertical">Catalogue</span>
    </a>
  );
};

export default CateglogButton;