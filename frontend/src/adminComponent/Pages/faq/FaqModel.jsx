import React from 'react';
import { FaTimes } from "react-icons/fa";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const FaqModal = ({ isOpen, onRequestClose, selectedFAQ }) => {
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white p-8 rounded shadow-lg w-96 relative">
        <button onClick={onRequestClose} className="absolute top-5 right-5 text-gray-500 hover:text-gray-700">
          <FaTimes size={20} />
        </button>
        <h2 className="text-xl font-bold font-serif mb-4">FAQ</h2>
        {selectedFAQ && (
          <div className="">
            <div className="flex mt-2">
              <p className="mr-2 font-semibold font-serif">Question:</p>
              <p>{selectedFAQ.question}</p>
            </div>
            <div className="mt-2">
              <p className="mr-2 font-semibold font-serif">Answer:</p>
              <ReactQuill
                readOnly={true}
                value={selectedFAQ.answer}
                modules={{ toolbar: false }}
                theme="bubble"
                className="quill"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaqModal;