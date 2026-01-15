import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X } from 'lucide-react';

export default function TechBanner({ serviceGridRef, pageType }) {
  const [heading, setHeading] = useState("");
  const [subHeading, setsubHeading] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [alt, setAlt] = useState("");
  const [imgTitle, setImgTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState(null);
  const [linkedin, setLinkedin] = useState("");
  const [clientIp, setClientIp] = useState("");
  const [utmParams, setUtmParams] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { slug } = useParams();

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  useEffect(() => {
    const fetchHeadings = async () => {
      try {
        const response = await axios.get(`/api/pageHeading/heading?pageType=${pageType}`, {
          withCredentials: true,
        });
        const { heading, subheading, photo, alt, imgTitle } = response.data;
        setHeading(heading || "");
        setsubHeading(subheading || "");
        setPhoto(photo || null);
        setAlt(alt || "");
        setImgTitle(imgTitle || "");
      } catch (error) {
        console.error(error);
      }
    };

    const fetchClientIp = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        setClientIp(response.data.ip);
      } catch (error) {
        console.error("Error fetching IP address", error);
      }
    };

    fetchHeadings();
    fetchClientIp();

    const params = new URLSearchParams(window.location.search);
    setUtmParams({
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_id: params.get("utm_id") || "",
      gclid: params.get("gclid") || "",
      gcid_source: params.get("gcid_source") || "",
      utm_content: params.get("utm_content") || "",
      utm_term: params.get("utm_term") || "",
    });
  }, [pageType]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('mobileNo', mobileNo);
      formData.append('message', message);
      formData.append('linkedin', linkedin);
      formData.append('path', slug || window.location.pathname);
      formData.append('jobTitle', 'General Application');
      formData.append('ipaddress', clientIp);
      formData.append('resume', resume);
      
      // Append UTM parameters
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      await axios.post(
        "/api/careerInquiries/createCareerInquiry",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      navigate("/thankyou");
      handleCloseModal();
      // Reset form
      setName("");
      setEmail("");
      setMobileNo("");
      setMessage("");
      setResume(null);
      setLinkedin("");
    } catch (err) {
      console.error("Failed to submit application", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-[70vh]">
      <img
        src={`/api/logo/download/${photo}`} 
        alt={alt}
        title={imgTitle}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center px-4 
                      pt-24 sm:pt-28 md:pt-32 xl:pt-36 2xl:pt-40 pb-12 sm:pb-16 xl:pb-20 text-center">
        
        <h1 className="text-white font-semibold text-3xl md:text-4xl max-w-3xl leading-tight">
          {heading}
        </h1>

        <p className="text-white mt-3 text-base sm:text-lg md:text-xl max-w-xl md:max-w-2xl xl:max-w-3xl text-justify lg:text-center">
          {subHeading}
        </p>

        <div className="flex gap-3 sm:gap-4 mt-4 flex-wrap justify-center">
          <a
            href="/contact"
            className="btn-yellow"
          >
            Get in Touch
          </a>
          <button
            onClick={handleOpenModal}
            className="btn-yellow"
          >
             {slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Developer'}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full relative">
            <button className="absolute top-3 right-3" onClick={handleCloseModal}>
              <X size={24} />
            </button>
            <h2 className="text-2xl font-semibold mb-4">
              Apply for {slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Position'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name <span className="text-red-500">*</span></label>
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
                <label className="block text-sm font-medium mb-1">Phone Number <span className="text-red-500">*</span></label>
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
                <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
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
                <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
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
                <label className="block text-sm font-medium mb-1">Upload Resume <span className="text-red-500">*</span></label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  className="w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Message <span className="text-red-500">*</span></label>
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
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}