// JobApplicationModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const JobApplicationModal = ({ isOpen, onClose, job }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [message, setMessage] = useState('');
  const [resume, setResume] = useState(null);
  const [linkedin, setLinkedin] = useState('');
  const [clientIp, setClientIp] = useState('');
  const [utmParams, setUtmParams] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClientIp = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        setClientIp(response.data.ip);
      } catch (error) {
        console.error('Error fetching IP address', error);
      }
    };

    fetchClientIp();

    const params = new URLSearchParams(window.location.search);
    setUtmParams({
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_id: params.get('utm_id') || '',
      gclid: params.get('gclid') || '',
      gcid_source: params.get('gcid_source') || '',
      utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || '',
    });
  }, []);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        '/api/careerInquiries/createCareerInquiry',
        {
          name,
          email,
          mobileNo,
          resume,
          message,
          linkedin,
          ipaddress: clientIp,
          path: window.location.pathname.slice(1),
          jobTitle: job?.jobtitle || 'General Application',
          ...utmParams,
        },
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      onClose();
      setName('');
      setEmail('');
      setMobileNo('');
      setMessage('');
      setResume(null);
      setLinkedin('');
    } catch (err) {
      console.error('Failed to submit application', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 sm:px-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-xl w-full relative shadow-xl">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-yellow-500 transition"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          Apply for <span className="text-yellow-500">{job?.jobtitle || 'General Application'}</span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Phone Number</label>
            <input
              type="text"
              name="mobileNo"
              placeholder="1234567890"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              LinkedIn Profile <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              type="url"
              name="linkedin"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="https://linkedin.com/in/your-profile"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Upload Resume/Portfolio</label>
            <input
              type="file"
              name="resume"
              onChange={handleFileChange}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-800 hover:file:bg-yellow-200"
              accept=".pdf,.doc,.docx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Project Details</label>
            <textarea
              name="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              placeholder="Tell us about your background, interest, or relevant experience..."
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
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationModal;