import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Custom CSS to ensure Quill editor styling
const quillStyles = `
  .ql-container {
    background-color: white;
    border-radius: 0.25rem;
    min-height: 200px;
  }
  .ql-editor {
    min-height: 150px;
    font-size: 1rem;
    line-height: 1.5;
  }
  .ql-toolbar {
    border-radius: 0.25rem 0.25rem 0 0;
  }
  .ql-container .ql-editor p,
  .ql-container .ql-editor h1,
  .ql-container .ql-editor h2,
  .ql-container .ql-editor h3 {
    margin-bottom: 0.5rem;
  }
`;

const CreateCaseStudy = () => {
  const { id } = useParams(); // Get id from URL params
  const navigate = useNavigate(); // For navigation after submit
  const [formData, setFormData] = useState({
    heading: "",
    subHeading: "",
    altImg: "",
    imgTitle: "",
    details: "",
    industryCategory: "",
  });
  const [photo, setPhoto] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Quill configuration with text and background color
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "color",
    "background",
    "link",
    "image",
    "video",
  ];

  // Fetch Industry Categories
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await axios.get("/api/industries/getAll");
        setIndustries(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching industries:", err);
        setError("Failed to load industry categories.");
      }
    };
    fetchIndustries();
  }, []);

  // Fetch Case Study by ID if editing
  useEffect(() => {
    if (id) {
      const fetchCaseStudy = async () => {
        setIsLoading(true);
        try {
          const res = await axios.get(`/api/caseStudy/${id}`);
          const caseStudy = res.data?.data || {};
          setFormData({
            heading: caseStudy.heading || "",
            subHeading: caseStudy.subHeading || "",
            altImg: caseStudy.altImg || "",
            imgTitle: caseStudy.imgTitle || "",
            details: caseStudy.details || "",
            industryCategory: caseStudy.industryCategory?._id || "",
          });
        } catch (err) {
          console.error("Error fetching case study:", err);
          setError("Failed to load case study data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchCaseStudy();
    }
  }, [id]);

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setPhoto(file);
    } else {
      alert("Please upload a valid image file.");
      setPhoto(null);
    }
  };

  // Handle Quill editor
  const handleDetailsChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      details: value,
    }));
  };

  // Reset form after successful submission
  const resetForm = () => {
    setFormData({
      heading: "",
      subHeading: "",
      altImg: "",
      imgTitle: "",
      details: "",
      industryCategory: "",
    });
    setPhoto(null);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      }
      if (photo) {
        data.append("photo", photo);
      }

      let res;
      if (id) {
        // Update case study
        res = await axios.put(`/api/caseStudy/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Case Study updated successfully");
      } else {
        // Create case study
        res = await axios.post("/api/caseStudy", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Case Study added successfully");
        resetForm();
      }
      navigate("/case-study"); // Redirect to case studies list after submit
      return res.data;
    } catch (err) {
      console.error("Error submitting form:", err);
      const errorMessage =
        err.response?.data?.message || "Error submitting form. Please try again.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <style>{quillStyles}</style>
      <h1 className="text-2xl font-semibold mb-6">
        {id ? "Edit Case Study" : "Create Case Study"}
      </h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading && id && <div className="text-center">Loading case study...</div>}
      {!isLoading && (
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          {/* Industry Dropdown */}
          <div>
            <label htmlFor="industryCategory" className="block font-medium mb-1">
              Industry Category
            </label>
            <select
              id="industryCategory"
              name="industryCategory"
              value={formData.industryCategory}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              disabled={isLoading}
            >
              <option value="">Select Industry</option>
              {industries.map((industry) => (
                <option key={industry._id} value={industry._id}>
                  {industry.category}
                </option>
              ))}
            </select>
          </div>

          {/* Heading */}
          <div>
            <label htmlFor="heading" className="block font-medium mb-1">
              Heading
            </label>
            <input
              id="heading"
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              disabled={isLoading}
            />
          </div>

          {/* Subheading */}
          <div>
            <label htmlFor="subHeading" className="block font-medium mb-1">
              Subheading
            </label>
            <textarea
              id="subHeading"
              name="subHeading"
              value={formData.subHeading}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows="4"
              disabled={isLoading}
            />
          </div>

          {/* Alt & Title */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="altImg" className="block font-medium mb-1">
                Alt Text
              </label>
              <input
                id="altImg"
                type="text"
                name="altImg"
                value={formData.altImg}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="imgTitle" className="block font-medium mb-1">
                Image Title
              </label>
              <input
                id="imgTitle"
                type="text"
                name="imgTitle"
                value={formData.imgTitle}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="photo" className="block font-medium mb-1">
              Image
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full"
              disabled={isLoading}
              required={!id} // Image not required for updates
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <label htmlFor="details" className="block font-medium mb-1">
              Details
            </label>
            <ReactQuill
              id="details"
              value={formData.details}
              onChange={handleDetailsChange}
              modules={quillModules}
              formats={quillFormats}
              readOnly={isLoading}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : id ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateCaseStudy;