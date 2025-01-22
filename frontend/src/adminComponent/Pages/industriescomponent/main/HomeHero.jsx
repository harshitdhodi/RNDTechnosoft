import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const HeroSection = ({ categoryId }) => {
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const notifySuccess = useCallback(() => {
    toast.success("Updated Successfully!");
  }, []);

  const modules = {
    toolbar: [
      [{ font: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image", "video"],
      [{ direction: "rtl" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  // Fetch headings from the API
  const fetchHeadings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `/api/industiesHeroSection/${categoryId}`,
        {
          withCredentials: true,
        }
      );
      const { heading = "", subheading = "" } = response.data || {};
      setHeading(heading);
      setSubheading(subheading);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch headings. Please try again later.");
      setHeading("");
      setSubheading("");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  // Save headings to the API
  const saveHeadings = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.put(
        `/api/industiesHeroSection/main/${categoryId}`,
        {
          heading,
          subheading,
        },
        { withCredentials: true }
      );
      notifySuccess();
    } catch (error) {
      console.error(error);
      setError("Failed to save headings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for heading and subheading
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "heading") {
      setHeading(value);
    } else if (name === "subheading") {
      setSubheading(value);
    }
  };

  // Fetch headings on component mount and when categoryId changes
  useEffect(() => {
    if (categoryId) {
      fetchHeadings();
    }
  }, [categoryId, fetchHeadings]);

  return (
    <div className="p-4 overflow-x-auto">
      <ToastContainer />
      <div className="mb-8 border border-gray-200 shadow-lg p-4 rounded">
        <div className="grid md:grid-cols-2 md:gap-2 grid-cols-1">
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
              Heading
            </label>
            <ReactQuill
              value={heading}
              onChange={setHeading} // Directly update heading
              modules={modules}
              className="quill"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
              Middle Tagline
            </label>
            <input
              type="text"
              name="subheading"
              value={subheading}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
              placeholder="Enter subheading"
            />
          </div>
        </div>
        <button
          onClick={saveHeadings}
          disabled={loading}
          className={`px-4 py-2 rounded hover:bg-slate-900 transition duration-300 font-serif ${
            loading ? "bg-gray-400" : "bg-slate-700 text-white"
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default HeroSection;
