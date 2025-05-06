import React, { useState, useEffect } from 'react';
import GetInTouch from './QuoteModel';

const QuoteButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup when component unmounts
    return () => document.body.classList.remove('overflow-hidden');
  }, [isModalOpen]);

  return (
    <div>
      <button
        className="px-8 py-2 bg-gradient-to-r from-yellow-300 to-yellow-500 text-black font-semibold rounded-full hover:from-yellow-400 hover:to-yellow-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
        onClick={openModal}
      >
        Get Quote
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Get in Touch Form"
        >
          <div className="relative w-1/2 h-[90%] overflow-y-auto">
            <GetInTouch closeModal={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteButton;
