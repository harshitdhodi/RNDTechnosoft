import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const HeroSection = ({ categoryId, subcategoryId, subsubcategoryId }) => {
    const [heading, setHeading] = useState("");
    const [title, setTitle] = useState("");
    const [subheading, setSubheading] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const notifySuccess = useCallback(() => {
        toast.success("Updated Successfully!");
    }, []);

    // Fetch headings from the API
    const fetchHeadings = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`/api/herosection/subsub/${categoryId}/${subcategoryId}/${subsubcategoryId}`, { withCredentials: true });
            const { heading = "", subheading = "", title = "" } = response.data || {};
            setHeading(heading);
            setTitle(title);
            setSubheading(subheading);
        } catch (error) {
            console.error(error);
            setError("Failed to fetch headings. Please try again later.");
            setHeading("");
            setSubheading("");
        } finally {
            setLoading(false);
        }
    }, [categoryId, subcategoryId, subsubcategoryId]);

    // Save headings to the API
    const saveHeadings = async () => {
        setLoading(true);
        setError("");
        try {
            await axios.put(`/api/herosection/subsub/${categoryId}/${subcategoryId}/${subsubcategoryId}`, {
                heading,
                title,
                subheading,
            }, { withCredentials: true });
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
        } else if (name === "title") {
            setTitle(value);
        }
    };

    // Fetch headings on component mount and when categoryId changes
    useEffect(() => {
        if (categoryId) {
            fetchHeadings();
        }
    }, [categoryId, fetchHeadings]);

    // Custom toolbar options
    const toolbarOptions = [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
    ];

    return (
        <div className="p-4 overflow-x-auto">
            <ToastContainer />
            <div className="mb-8 border border-gray-200 shadow-lg p-4 rounded">
                <div className="">
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
                            Tagline
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={handleInputChange}
                            disabled={loading}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
                            placeholder="Enter tagline"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
                            Paragraph
                        </label>
                        <div className="quill-container">
                            <ReactQuill
                                value={heading}
                                onChange={setHeading}
                                readOnly={loading}
                                className="custom-quill w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
                                placeholder="Enter paragraph"
                                modules={{ toolbar: toolbarOptions }}
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
                            Subheading
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
                    className={`px-4 py-2 rounded hover:bg-slate-900 transition duration-300 font-serif ${loading ? 'bg-gray-400' : 'bg-slate-700 text-white'}`}
                >
                    {loading ? "Saving..." : "Save"}
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default HeroSection;