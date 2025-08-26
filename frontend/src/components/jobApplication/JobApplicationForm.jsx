import { useState } from "react";
import axios from "axios"; // Import axios for API requests
import PersonalInfoSection from "./PersonalInfoSection";
import HealthBackgroundSection from "./HealthBackgrpundSection";
import EmploymentInfoSection from "./EmployeeInfoSection";
import SalaryInfoSection from "./SalaryInfoSection";


export default function JobApplicationForm() {
    const initialState ={
    date: "",
    positionApplied: "",
    firstName: "",
    dateOfBirth: "",
    maritalStatus: "",
    mobileNumber: "",
    currentLocation: "",
    email: "",
    majorIllness: "",
    smoke: "",
    alcohol: "",
    differentlyAbled: "",
   
    currentOrganisation: "",
    currentDesignation: "",
    reportToDesignation: "",
    reportToName: "",
    peopleReporting: "",
    totalExperience: "",
    fixedSalary: "",
    bonusIncentive: "",
    totalSalary: "",
    expectedSalary: "",
    noticePeriod: "",
    resume: null,  // To hold the resume file
  };
  const [formData, setFormData] = useState(initialState);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0], // Store the file in state
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to handle file uploads
    const formDataToSend = new FormData();

    // Append all form fields to the FormData object
    for (const key in formData) {
      if (formData[key] && key !== "resume") {
        formDataToSend.append(key, formData[key]);
      }
    }

    // Append the resume file if present
    if (formData.resume) {
      formDataToSend.append("resume", formData.resume);
    }

    try {
      // Make the POST request to the backend
      const response = await axios.post("/api/jobApplication/addJob", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",  // Important for file uploads
        },
      });
      console.log("Job application submitted successfully", response.data);
      setFormData(initialState);
      // Trigger the success alert
      setAlertMessage("Your job application has been submitted successfully!");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 10000);  // Alert disappears after 3 seconds
    } catch (error) {
      console.error("Error submitting job application", error);
      // Trigger the error alert
      setAlertMessage("Error submitting job application.");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 10000);  // Alert disappears after 3 seconds
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  lg:pt-32 from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold pt-10 text-gray-900 sm:text-4xl">Job Application Form</h1>
          <p className="mt-3 text-lg text-gray-500">Please fill out the form below to apply for the position</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput label="Date" type="date" name="date" value={formData.date} onChange={handleChange} />
                <TextInput
                  label="Position Applied"
                  name="positionApplied"
                  value={formData.positionApplied}
                  onChange={handleChange}
                  placeholder="Enter position you're applying for"
                />
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <PersonalInfoSection formData={formData} onChange={handleChange} />

          {/* Health and Background Section */}
          <HealthBackgroundSection formData={formData} onChange={handleChange} />

          {/* Employment Information Section */}
          <EmploymentInfoSection formData={formData} onChange={handleChange} />

          {/* Salary Information Section */}
          <SalaryInfoSection formData={formData} onChange={handleChange} />

          {/* Resume File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Resume</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="mt-1 block w-full rounded-md bg-white border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors duration-200"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-black  bg-[#f3ca0d]  md:py-4 md:text-lg md:px-10 shadow-lg
              shadow-black/40 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>

      {/* Custom Alert */}
      {showAlert && (
        <div className="custom-alert">
          <div className="custom-alert-content">
            <h2>{alertMessage}</h2>
            <button
              className="close-btn"
              onClick={() => setShowAlert(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Custom Alert Styles and Animation */}
      <style jsx>{`
        .custom-alert {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: rgba(0, 0, 0, 0.5);
          width: 80%;
          max-width: 400px;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .custom-alert-content {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          animation: bounceIn 0.5s ease-in-out;
        }

        .custom-alert h2 {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }

        .custom-alert p {
          margin: 10px 0;
          font-size: 16px;
        }

        .custom-alert .close-btn {
          padding: 10px 20px;
          font-size: 16px;
          background-color: #f3ca0d;
          border: none;
          color: white;
          cursor: pointer;
          border-radius: 5px;
          margin-top: 10px;
        }

        .custom-alert .close-btn:hover {
          background-color: #f1b507;
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// Reusable form components
function TextInput({ label, name, value, onChange, type = "text", placeholder = "", required = false }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors duration-200"
      />
    </div>
  );
}

