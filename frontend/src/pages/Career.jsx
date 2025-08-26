import { useState, useEffect } from "react";
import {
  Briefcase,
  Search,
  ChevronRight,
  MapPin,
  Clock,
  X,
} from "lucide-react";
import Modal from "react-modal";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useLocation } from "react-router-dom";

Modal.setAppElement("#root");

const Banner = () => {
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");

  useEffect(() => {
    const fetchHeadings = async () => {
      try {
        const response = await axios.get(
          "/api/pageHeading/heading?pageType=career",
          { withCredentials: true }
        );
        const { heading, subheading } = response.data;
        setHeading(heading || "");
        setSubheading(subheading || "");
      } catch (error) {
        console.error(error);
      }
    };

    fetchHeadings();
  }, []);

  return (
    <div className="relative bg-gradient-to-r from-yellow-600 to-black h-80 md:h-[70vh]">
     <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative h-full flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-semibold text-white mb-4">
            {heading}
          </h1>
          <p className="text-xl md:text-2xl text-red-100 font-semibold">
            {subheading}
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 -mb-[1px]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#f3f4f6"
            fillOpacity="1"
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

const JobCard = ({ job, onApply }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    if (modalIsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalIsOpen]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden w-full max-w-md mx-auto h-full">
  <img
    src={`/api/image/download/${job.photo}`}
    alt={`${job.department} department`}
    className="w-full h-48 sm:h-56 md:h-64 object-cover"
  />
  <div className="p-5 flex flex-col flex-grow">
    <div className="mb-3">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1 leading-snug">
        {job.jobtitle}
      </h2>
      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
        <span className="flex items-center">
          <MapPin size={16} className="mr-1" /> {job.jobType}
        </span>
        <span className="flex items-center">
          <Clock size={16} className="mr-1" /> {job.employmentType}
        </span>
      </div>
    </div>

    <div className="text-gray-700 text-sm sm:text-base mb-4 flex-grow">
      <div
        dangerouslySetInnerHTML={{ __html: job.description }}
        className="prose prose-sm text-gray-700"
      />
    </div>


    <div className="flex flex-col sm:flex-row gap-3 mt-auto">
      <button
        onClick={onApply}
        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-full flex items-center justify-center transition"
      >
        Apply Now
        <ChevronRight className="ml-2" size={18} />
      </button>
      <button
        onClick={openModal}
        className="flex-1 text-yellow-500 hover:text-yellow-600 font-semibold py-2 px-4 rounded-full flex items-center justify-center transition border border-yellow-500"
      >
        Learn More
      </button>
    </div>
  </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Job Requirements"
        className="fixed inset-0 bg-white p-6 sm:p-8 max-w-lg mx-auto my-8 sm:my-16 rounded-lg shadow-lg overflow-auto max-h-[80vh]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        <div className="flex justify-between items-center relative">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Requirements for {job.jobtitle}
          </h2>
          <button
            onClick={closeModal}
            aria-label="Close"
            className="absolute -top-4 -right-4 text-black hover:text-yellow-500"
          >
            <X size={24} />
          </button>
        </div>
        <div className="text-gray-700 text-sm sm:text-base">
          <ReactQuill
            readOnly={true}
            value={job.requirement}
            modules={{ toolbar: false }}
            theme="bubble"
            className="quill"
          />
        </div>
        <button
          onClick={closeModal}
          className="mt-4 bg-yellow-400 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 w-full sm:w-auto"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

const JobApplicationModal = ({ job, isOpen, onClose }) => {
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
  const { pathname } = useLocation();
  const slug = pathname.slice(1, pathname.length);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  useEffect(() => {
    const fetchClientIp = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        setClientIp(response.data.ip);
      } catch (error) {
        console.error("Error fetching IP address", error);
      }
    };

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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "/api/careerInquiries/createCareerInquiry",
        {
          name,
          email,
          mobileNo,
          resume,
          message,
          linkedin,
          ipaddress: clientIp,
          path: slug,
          jobTitle: job.jobtitle,
          ...utmParams,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
<<<<<<< HEAD
      
=======

>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      navigate("/thankyou");
      onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 sm:px-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-xl w-full relative shadow-xl">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-yellow-500 transition"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          Apply for <span className="text-yellow-500">{job.jobtitle}</span>
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
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

          {/* Phone */}
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

          {/* Email */}
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

          {/* LinkedIn (optional) */}
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

          {/* Resume/Portfolio Upload */}
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

          {/* Message */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2.5 px-4 rounded-md text-sm transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

const CareerPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [careerOptions, setCareerOptions] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/api/careeroption/getActiveCareeroption`,
        { withCredentials: true }
      );
      const careerOptionsWithIds = response.data;
      setCareerOptions(careerOptionsWithIds);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredJobs = careerOptions.filter(
    (job) =>
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterDepartment === "All" || job.department === filterDepartment)
  );

  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const departments = [
    "All",
    ...new Set(careerOptions.map((job) => job.department)),
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Banner />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-4">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-start gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setFilterDepartment(dept)}
                className={`px-4 py-2 rounded-full border border-gray-300 text-sm font-medium
                            ${
                              filterDepartment === dept
                                ? "bg-black text-white"
                                : "bg-white text-black hover:bg-gray-100"
                            }`}
              >
                {dept}
              </button>
            ))}
          </div>
          <div className="w-full md:w-80">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-8">
          Can’t find the job you want? Send your resume to{" "}
          <a
            href="mailto:hr@rndtechnosoft.com"
            className="text-yellow-500 hover:text-yellow-600 transition-all duration-300"
          >
            hr@rndtechnosoft.com
          </a>{" "}
          and we’ll contact you when a new position opens.
        </p>

        {filteredJobs.length > 0 ? ( 
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-8">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onApply={() => openModal(job)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-lg text-gray-600">
              No job openings match your criteria.
            </p>
          </div>
        )}
      </div>

      {selectedJob && (
        <JobApplicationModal
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default CareerPage;