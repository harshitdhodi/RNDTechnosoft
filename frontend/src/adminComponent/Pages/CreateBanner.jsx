import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CreateBannerForm = () => {
  const [pageType, setPageType] = useState("");
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [photo, setPhoto] = useState(null);
  const [alt, setAlt] = useState("");
  const [imgTitle, setImgTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const notifySuccess = () => toast.success("Banner created successfully!");
  const notifyError = (message) => toast.error(message);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pageType || !heading) {
      notifyError("Page Type and Heading are required!");
      return;
    }

    const formData = new FormData();
    formData.append("pageType", pageType);
    formData.append("heading", heading);
    formData.append("subheading", subheading);
    if (photo) {
      formData.append("photo", photo);
    }
    formData.append("alt", alt);
    formData.append("imgTitle", imgTitle);

    setLoading(true);
    try {
      await axios.post("/api/pageHeading/createHeading", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      notifySuccess();
      setTimeout(() => navigate("/banner"), 2000); // Redirect to banners table after 2 seconds
    } catch (error) {
      console.error(error);
      notifyError("Failed to create banner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-xl font-bold text-gray-700 font-serif uppercase mb-6">
        Create New Banner
      </h1>
      <form onSubmit={handleSubmit} className="border border-gray-200 shadow-lg p-6 rounded">
        <div className="grid md:grid-cols-2 md:gap-4 grid-cols-1">
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
              Page Type
            </label>
            <input
              type="text"
              value={pageType}
              onChange={(e) => setPageType(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
              placeholder="Enter page type (e.g., contactus)"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
              Heading
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
              placeholder="Enter heading"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
              Subheading
            </label>
            <input
              type="text"
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
              placeholder="Enter sub 탈heading"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
              Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
              Alt Text
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
              placeholder="Enter alt text for image"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
              Image Title
            </label>
            <input
              type="text"
              value={imgTitle}
              onChange={(e) => setImgTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
              placeholder="Enter image title"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating..." : "Create Banner"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/banner")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition duration-300 font-serif"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBannerForm;