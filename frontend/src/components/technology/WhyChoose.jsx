import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import img1 from '../../images/HowRnd/agile.png';
import axios from 'axios';
import { X } from 'lucide-react';

// JobApplicationModal component (copied from CareerPage)
const JobApplicationModal = ({ job, isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [message, setMessage] = useState('');
  const [resume, setResume] = useState(null);
  const [linkedin, setLinkedin] = useState('');
  const [clientIp, setClientIp] = useState('');
  const [utmParams, setUtmParams] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {slug}= useParams();

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

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
          path: slug,
          jobTitle: job?.jobtitle,
          ipaddress: clientIp,
          ...utmParams,
        },
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      navigate('/thankyou');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full relative">
        <button className="absolute top-3 right-3" onClick={onClose}>
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-4">
          Apply for {job.jobtitle}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="mobileNo"
              value={mobileNo}
              placeholder="1234567890"
              onChange={(e) => setMobileNo(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              LinkedIn Profile
            </label>
            <input
              type="url"
              name="linkedin"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="https://linkedin.com/in/your-profile"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Upload Resume
            </label>
            <input
              type="file"
              name="resume"
              onChange={handleFileChange}
              className="w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className={`bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg w-full ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

const WhyChooseSection = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for JobApplicationModal

  // Function to normalize heading tags to <h2>
  const normalizeHeading = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = DOMPurify.sanitize(html, {
      FORBID_ATTR: ['style', 'class'],
      FORBID_TAGS: ['h1', 'h3', 'h5'],
      ADD_TAGS: ['h2'],
    });
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return `<h2>${textContent}</h2>`;
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/technologySecData/get/${slug}?type=Why Choose`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result[0]);
        console.log('Fetched data for slug:', result[0]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Modal open/close functions
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Quill configuration
  const quillConfig = {
    readOnly: true,
    theme: null,
    modules: {
      toolbar: false,
    },
  };

  // Render loading state
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error || !data) {
    return (
      <div className="text-center py-16 text-red-500">
        Error: {error || 'No data found'}
      </div>
    );
  }

  // Job data for the modal
  const job = {
    jobtitle: data?.technologyId?.imgTitle || 'React JS Developer', // Fallback title
    // Add other fields if required by JobApplicationModal (e.g., department, jobType, etc.)
  };

  return (
    <div className="bg-gray-50 px-4">
      <div className="max-w-8xl services-landing max-w-8xl 2xl:px-28 mx-auto services-landing">
        {/* Header Section */}
        <div className="max-w-6xl 2xl:w-[80%] mx-auto">
          <div className="mb-12">
            <ReactQuill
              value={DOMPurify.sanitize(data.heading, {
                FORBID_ATTR: ['style', 'class'],
                ADD_TAGS: ['h2'],
              })}
              {...quillConfig}
              className="quill-heading border-none"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12 max-w-8xl xl:mx-24  mx-auto sm:px-6 lg:px-8">
          {data.card.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              role="article"
              aria-label={`Feature: ${feature.heading || 'Feature Card'}`}
            >
              {/* Image */}
              <div className="mb-4 flex justify-start group-hover:scale-105 transition-transform duration-300">
                {feature.photo ? (
                  <img
                    src={`/api/logo/download/${feature.photo}`}
                    alt={feature.altName || DOMPurify.sanitize(feature.heading, { ALLOWED_TAGS: [] }) || 'Feature image'}
                    title={feature.imgTitle || DOMPurify.sanitize(feature.heading, { ALLOWED_TAGS: [] })}
                    className="w-16 h-16 object-contain"
                    loading="lazy"
                    onError={(e) => {
                      console.error(`Failed to load image: /api/logo/download/${feature.photo}`);
                      e.target.src = img1; // Fallback to dummy image
                    }}
                  />
                ) : (
                  <img
                    src={img1}
                    alt="Fallback icon"
                    className="object-contain w-16 h-16"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Feature Heading */}
              <ReactQuill
                value={normalizeHeading(feature.heading)}
                {...quillConfig}
                className="quill-heading2 text-lg font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 border-none"
              />

              {/* Feature Description */}
              <ReactQuill
                value={DOMPurify.sanitize(feature.subHeading, {
                  FORBID_ATTR: ['style', 'class'],
                  ADD_TAGS: ['p'],
                })}
                {...quillConfig}
                className="quill-description text-gray-600 text-sm leading-relaxed border-none"
              />

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/10 to-indigo-100/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center pb-8">
          <button
            onClick={openModal} // Open JobApplicationModal on click
            className="btn-yellow"
          >
            Hire {data?.technologyId?.imgTitle || 'React JS'} Developer
          </button>
        </div>

        {/* Job Application Modal */}
        <JobApplicationModal
          job={job}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};

export default WhyChooseSection;