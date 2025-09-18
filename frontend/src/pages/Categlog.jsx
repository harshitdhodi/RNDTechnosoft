import React, { useState } from 'react';
import axios from 'axios';
import { X, Download, Eye } from 'lucide-react';

const CateglogButton = ({ isMobileMenuOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `/api/catalogue/inquiry`,
        {
          ...formData,
          path: "https://rndtechnosoft.com/"+window.location.pathname.slice(1),
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      setIsOpen(false);
      setShowSuccessModal(true);
      setFormData({
        name: '',
        email: '',
        mobileNo: '',
      });
    } catch (err) {
      console.error('Failed to submit form', err);
      alert('Failed to submit the form. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCatalogue = () => {
    // Open catalogue in a new tab
    const API_URL = process.env.NODE_ENV === 'development' 
      ? 'https://rndtechnosoft.com' 
      : '';
    window.open(`${API_URL}/portfolio`, '_blank');
    setShowSuccessModal(false);
  };

  const handleDownloadCatalogue = () => {
    const API_URL = process.env.NODE_ENV === 'development' 
      ? 'https://rndtechnosoft.com' 
      : '';
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = `/api/download/portfolio`;
    link.setAttribute('download', 'RND_Technosoft_Portfolio.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowSuccessModal(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`fixed right-0 w-12 h-32 rounded-sm top-1/2 -translate-y-1/2 bg-[#f3ca0d] text-black text-xl font-semibold flex items-center justify-center shadow-lg z-40 hover:text-white transition-transform hover:scale-105 ${
          isMobileMenuOpen ? 'hidden' : ''
        }`}
      >
        <span className="writing-mode-vertical">Catalogue</span>
      </button>

      {/* Form Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 sm:px-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-xl">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-yellow-500 transition"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
              Request Catalogue
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="mobileNo"
                  placeholder="1234567890"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                  maxLength={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition ${
                  loading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Submitting...' : 'Request Catalogue'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 sm:px-6">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative shadow-xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">Your request has been submitted successfully.</p>
            
            <div className="space-y-3">
              <button
                onClick={handleViewCatalogue}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition"
              >
                <Eye size={18} /> View Catalogue
              </button>
              <button
                onClick={handleDownloadCatalogue}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition"
              >
                <Download size={18} /> Download Catalogue
              </button>
            </div>
            
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CateglogButton;