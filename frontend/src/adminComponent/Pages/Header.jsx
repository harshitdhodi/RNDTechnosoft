import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditHeader = () => {
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [alt, setAlt] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchHeader();
  }, []);

  const notify = () => {
    toast.success("Updated Successfully!");
  };

  const fetchHeader = async () => {
    try {
      const response = await axios.get('/api/header/getHeader', { withCredentials: true });
      const header = response.data;

      // Set values, or default to empty strings if undefined or null
      setPhoneNo(header.phoneNo || "");
      setEmail(header.email || "");
      setAlt(header.alt || "");
      
      // Set preview photo only if photo is available
      if (header.photo) {
        setPreviewPhoto(`/api/header/download/${header.photo}`);
      } else {
        setPreviewPhoto("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
    setPreviewPhoto(URL.createObjectURL(e.target.files[0])); // Set the preview image URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('photo', photo);

      const headerData = {
        phoneNo,
        email,
        alt
      };

      // Append other fields to FormData if needed
      for (const key in headerData) {
        formData.append(key, headerData[key]);
      }

      const response = await axios.put('/api/header/updateHeader', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data' // Ensure multipart/form-data headers
        }
      });
      notify();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Header Settings</h1>
      <ToastContainer />
      <div className="mb-4">
        <label htmlFor="phoneNo" className="block font-semibold mb-2">
          Phone Number
        </label>
        <input
          type="text"
          id="phoneNo"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block font-semibold mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
    
      <div className="mb-4">
        <label className="block font-semibold mb-2">Current Image</label>
        {previewPhoto && (
          <img
            src={previewPhoto}
            alt="Current"
            className="w-56 h-32 object-cover"
          />
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="alt" className="block font-semibold mb-2">
          Alt Text
        </label>
        <input
          type="text"
          id="alt"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block font-semibold mb-2">
          Upload New Image
        </label>
        <input
          type="file"
          id="photo"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full p-2 border rounded focus:outline-none"
        />
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditHeader;
