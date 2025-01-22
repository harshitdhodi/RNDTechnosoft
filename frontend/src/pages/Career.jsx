import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Search,
  ChevronDown,
  ChevronRight,
  MapPin,
  Clock,
  X,
} from "lucide-react";
import Modal from "react-modal";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

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
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">
            {heading}
          </h1>
          <p className="text-xl md:text-2xl text-yellow-100 font-serif">
            {subheading}
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
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
      // Disable scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Enable scrolling
      document.body.style.overflow = "";
    }

    // Cleanup function to ensure scrolling is re-enabled if the component is unmounted
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <img
        src={`/api/image/download/${job.photo}`}
        alt={`${job.department} department`}
        className="w-full h-[17rem] "
      />
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {job.jobtitle}
            </h2>
            {/* <p className="text-lg text-gray-600 mb-2">{job.department}</p> */}
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center text-sm text-gray-500">
                <MapPin size={16} className="mr-1" /> {job.jobType}
              </span>
              <span className="flex items-center text-sm text-gray-500">
                <Clock size={16} className="mr-1" /> {job.employmentType}
              </span>
            </div>
          </div>
        </div>
        <p className="text-gray-700 mb-4">
          <ReactQuill
            readOnly={true}
            value={job.description}
            modules={{ toolbar: false }}
            theme="bubble"
            className="quill"
          />
        </p>
        {/* {expanded && (
                    <div className="mt-4">
                        <h3 className="font-semibold text-gray-800 mb-2">Requirements:</h3>
                        <p className="text-gray-700">{job.requirements}</p>
                    </div>
                )} */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 h-[2cm] my-auto">
          <button
            onClick={onApply}
            className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-full flex items-center justify-center transition duration-300 mb-3 sm:mb-0"
          >
            Apply Now
            <ChevronRight className="ml-2" size={18} />
          </button>
          <button
            onClick={openModal}
            className="w-full sm:w-auto text-yellow-400 hover:text-yellow-600 font-semibold flex items-center justify-center transition duration-300"
          >
            Learn More
            {/* <ChevronDown className="ml-1" size={18} /> */}
          </button>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Job Requirements"
        className="fixed inset-0 bg-white p-8 max-w-lg mx-auto my-16 rounded-lg shadow-lg overflow-auto max-h-[80vh] "
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        <div className="flex justify-between items-center relative">
          <h2 className="text-2xl font-bold mb-4">
            Requirements for {job.jobtitle}
          </h2>
          <button
            onClick={closeModal}
            aria-label="Close"
            className=" absolute -top-4 -right-6 text-black hover:text-yellow-500"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="text-gray-700">
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
          className="mt-4 bg-yellow-400 hover:bg-yellow-600 text-white py-2 px-4 rounded-full transition duration-300"
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
  const [clientIp, setClientIp] = useState("");
  const [utmParams, setUtmParams] = useState({});
  const navigate = useNavigate();

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
    try {
      await axios.post(
        "/api/careerInquiries/createCareerInquiry",
        {
          name,
          email,
          mobileNo,
          resume,
          message,
          ipaddress: clientIp,
          ...utmParams,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // alert('Application submitted successfully!');
      navigate("/thankyou");
      onClose();
      setName("");
      setEmail("");
      setMobileNo("");
      setMessage("");
      setResume(null);
    } catch (err) {
      console.error("Failed to submit application", err);
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
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
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg w-full"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

const CareerPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
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
        <div className="mb-12 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap w-full  justify-start space-x-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setFilterDepartment(dept)}
                className={`px-4 py-2 rounded-full border border-gray-300 
                            ${
                              filterDepartment === dept
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            }`}
              >
                {dept}
              </button>
            ))}
          </div>
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="absolute right-3 top-2.5 text-gray-400">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
        <p className="text-gray-400">
    Can’t find the job you want? Send your resume to <span className="hover:text-blue-900 transition-all duration-300 text-gray-500 "><a href="mailto:hr@rndtechnosoft.com">hr@rndtechnosoft.com</a></span> and we’ll contact you when a new position opens.
</p>

        {filteredJobs.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 my-16">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onApply={() => openModal(job)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-xl text-gray-600">
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
