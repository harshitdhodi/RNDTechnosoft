import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaStarOfLife } from "react-icons/fa6";
import { X } from "lucide-react";
import axios from "axios";
import "../../../src/quill.css"
const AutocompleteInput = ({
  value,
  onChange,
  suggestions,
  placeholder,
  loading,
  disabled,
  resetKey,
  fieldName, // Add this prop to specify the actual field name
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    setSearch(value);
  }, [value, resetKey]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = suggestions
    ?.filter((item) => item.toLowerCase().startsWith(search.toLowerCase()))
    .slice(0, 10);

  return (
    <div ref={wrapperRef} className="relative mb-4">
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
          onChange({ target: { name: fieldName, value: e.target.value } }); // Use fieldName instead of placeholder
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={loading ? "Loading cities..." : placeholder}
        disabled={disabled || loading}
        className="w-full px-3 py-1 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-yellow-400 transition-colors duration-300"
      />
      {isOpen && filteredSuggestions?.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-slate-800 border border-white/20 rounded-lg shadow-lg max-h-40 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-3 hover:bg-white/10 cursor-pointer text-white/90 transition-colors duration-200"
              onClick={() => {
                onChange({ target: { name: fieldName, value: suggestion } }); // Use fieldName instead of placeholder
                setSearch(suggestion);
                setIsOpen(false);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ContactForm = React.memo(({ isModal = false, onSubmit, loading }) => {
  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    city: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmId: "",
    gclid: "",
    gcidSource: "",
    utmContent: "",
    utmTerm: "",
    ipaddress: "",
  };

  const initialErrorState = {
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    city: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);
  const [category, setCategory] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const budgetOptions = [
    "INR 1 Cr. and Above",
    "INR 50 Lacs - 1 Cr.",
    "INR 25 Lacs - 50 Lacs.",
    "INR 15 Lacs - 25 Lacs.",
    "INR 5 Lacs - 15 Lacs.",
  ];

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]*$/.test(value)) return 'Name should only contain letters';
        return '';

      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';

      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) return 'Phone number must be exactly 10 digits';
        return '';

      case 'service':
        if (!value.trim()) return 'Please select a service';
        return '';

      case 'budget':
        if (!value.trim()) return 'Please select a budget range';
        return '';

      case 'city':
        if (!value.trim()) return 'Please select a city';
        return '';

      default:
        return '';
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`/api/services/getCategory`, {
          withCredentials: true,
        });
        setCategory(response.data.map((item) => item.category));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchAllCities = async () => {
      setLoadingCities(true);
      try {
        const response = await axios.get(
          "https://countriesnow.space/api/v0.1/countries"
        );
        const allCities = response.data.data.reduce((acc, country) => {
          if (country.cities) {
            acc.push(...country.cities);
          }
          return acc;
        }, []);
        const uniqueCities = [...new Set(allCities)].sort();
        setCities(uniqueCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCategory();
    fetchAllCities();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For phone numbers, only allow digits and limit to 10 characters
    if (name === 'phone' && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field and update errors
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate all required fields
    Object.keys(formData).forEach(field => {
      if (['name', 'email', 'phone', 'service', 'budget', 'city'].includes(field)) {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
    setFormData(initialFormState);
    setErrors(initialErrorState);
    setResetKey((prev) => prev + 1);
    setShowSuccessMessage(true);
    
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-8 rounded-xl shadow-2xl border transition-transform duration-300 ${
        isModal
          ? "w-full max-w-md mx-auto bg-black"
          : "bg-white/10 backdrop-blur-lg border-white/10"
      }`}
    >
      <h3 className="text-2xl font-bold mb-6 text-white text-center">
        Get Started Today
      </h3>

      {["name", "email", "phone"].map((field) => (
        <div key={field} className="mb-4">
          <input
            name={field}
            type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
            placeholder={
              field.charAt(0).toUpperCase() +
              field.slice(1) +
              (field === "phone" ? " No." : "")
            }
            value={formData[field]}
            onChange={handleInputChange}
            className={`w-full px-3 py-1 rounded-lg bg-white/5 border ${
              errors[field] ? 'border-red-500' : 'border-white/20'
            } text-white placeholder:text-white/50 focus:outline-none focus:border-yellow-400 transition-colors duration-300`}
            maxLength={field === "phone" ? 10 : undefined}
            required
          />
          {errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
          )}
        </div>
      ))}

      <div className="mb-4">
        <AutocompleteInput
          value={formData.city}
          onChange={handleInputChange}
          suggestions={cities}
          placeholder="City"
          loading={loadingCities}
          fieldName="city"
          resetKey={resetKey}
        />
        {errors.city && (
          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
        )}
      </div>

      <div className="mb-4">
        <AutocompleteInput
          value={formData.service}
          onChange={handleInputChange}
          suggestions={category}
          placeholder="Service"
          fieldName="service"
          resetKey={resetKey}
        />
        {errors.service && (
          <p className="text-red-500 text-sm mt-1">{errors.service}</p>
        )}
      </div>

      <div className="mb-4">
        <AutocompleteInput
          value={formData.budget}
          onChange={handleInputChange}
          suggestions={budgetOptions}
          placeholder="Your Monthly Budget(INR)"
          fieldName="budget"
          resetKey={resetKey}
        />
        {errors.budget && (
          <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || Object.keys(errors).some(key => errors[key])}
        className={`w-full py-3 ${
          loading || Object.keys(errors).some(key => errors[key])
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600"
        } text-black font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg`}
      >
        {loading ? "Submitting..." : "Let's Connect"}
      </button>

      {showSuccessMessage && (
        <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-500 text-sm">
              Thank you for your submission! We'll get back to you soon.
            </p>
          </div>
        </div>
      )}
    </form>
  );
});

const HeroSection = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [heroSection, setHeroSection] = useState({});
  const [clientIp, setClientIp] = useState("");
  const [utmParams, setUtmParams] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for form submission

  const location = useLocation();

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

  useEffect(() => {
    const fetchHeroSection = async () => {
      try {
        const slug = location.pathname.split("/").filter(Boolean).pop();
        const response = await axios.get(`/api/heroSection/front/${slug}`, {
          withCredentials: true,
        });
        setHeroSection(response.data);
        setTimeout(() => setIsLoading(false), 1000);
      } catch (error) {
        console.error("Error fetching hero section:", error);
        setIsLoading(false);
      }
    };

    fetchHeroSection();
  }, [location]);

  const handleFormSubmit = async (formData) => {
    setLoading(true); // Set loading to true
    const completeFormData = {
      ...formData,
      ipaddress: clientIp, // Add client IP
      utmSource: utmParams.utm_source,
      utmMedium: utmParams.utm_medium,
      utmCampaign: utmParams.utm_campaign,
      utmId: utmParams.utm_id,
      gclid: utmParams.gclid,
      gcidSource: utmParams.gcid_source,
      utmContent: utmParams.utm_content,
      utmTerm: utmParams.utm_term,
    };
    try {
      const response = await axios.post(
        "/api/herosectioninquiry/createHomesectionInquiry",
        completeFormData
      );
      setSuccessMessage(response.data.message);
      setIsMessageVisible(true); // Show success message modal
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting your form. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const Modal = useCallback(
    () => (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 ${
          isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`relative w-full max-w-md transform transition-all duration-300 flex flex-col items-center justify-center ${
            isModalOpen ? "scale-100" : "scale-95"
          }`}
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute -bottom-10 z-10 bg-[#1111119f] p-1 rounded-full hover:bg-white/20 transition-colors duration-300"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <ContactForm
            isModal={true}
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        </div>
      </div>
    ),
    [isModalOpen, loading]
  );

  const SkeletonLoader = () => (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen flex items-center justify-between text-white">
      <div className="flex flex-col md:flex-row w-11/12 lg:w-4/5 mx-auto gap-12 py-20">
        {/* Left Side Skeleton */}
        <div className="md:w-[60%] space-y-6 animate-pulse">
          <div className="h-12 bg-slate-700 rounded-lg w-3/4"></div>
          <div className="h-8 bg-slate-700 rounded-lg w-full"></div>
          <div className="h-8 bg-slate-700 rounded-lg w-5/6"></div>
          <div className="h-8 bg-slate-700 rounded-lg w-4/5"></div>
          <div className="h-8 bg-slate-700 rounded-lg w-2/3"></div>
        </div>

        {/* Right Side Skeleton */}
        <div className="md:w-[25%] animate-pulse">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl space-y-4">
            <div className="h-8 bg-slate-700 rounded-lg"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) return <SkeletonLoader />;

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black md:min-h-[80vh] py-4 flex items-center justify-between text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative flex flex-col md:flex-row  justify-center gap-10 xl:gap-40 w-11/12 pt-16 lg:w-4/5 mx-auto sm:my-32 my-5 ">
        <div className="md:w-[50%] space-y-8">
          <div className="inline-flex items-center w-auto rounded-full bg-white px-3 gap-2 py-2 pr-4">
            {/* <span className="h-2 w-2 rounded-full bg-blue-500"></span> */}
            <span className=" text-[16px] font-medium bg-yellow-500 rounded-full text-white
             px-8 py-3 sm:py-0 ">
              Best
            </span>
            <span className="ml-2 text-[16px] pr-4 text-gray-700">
            {heroSection.title}
            </span>
          </div>
          <ReactQuill
            readOnly={true}
            value={heroSection.heading}
            modules={{ toolbar: false }}
            theme="bubble"
            className="quill-content text-white"
          />
        <Link to="/contact">   
        <button
           className=" px-8 py-2 bg-gradient-to-r from-yellow-300 to-yellow-500 text-black font-semibold rounded-full hover:from-yellow-400 hover:to-yellow-500 transform hover:scale-105 transition-all duration-300 shadow-lg "
         >
           Reaquest Proposal
         </button>
        </Link>
          {/* <button
            onClick={() => setIsModalOpen(true)}
            className="md:hidden px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105 transition-all duration-300 shadow-lg w-full"
          >
            Get in Touch
          </button> */}
        </div>

        <div className="hidden md:block xl:w-[25%] w-[40%] relative">
          <div className="absolute -top-4 -left-4 z-10">
            <FaStarOfLife className="text-yellow-400 text-4xl animate-[spin_5s_linear_infinite]" />
          </div>
          <ContactForm onSubmit={handleFormSubmit} loading={loading} />
        </div>
      </div>
      <Modal />
    </div>
  );
};

export default HeroSection;
