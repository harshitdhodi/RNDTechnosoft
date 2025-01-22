import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

const EditMenuListingForm = () => {
  const [pagename, setPagename] = useState("");
  const [alt, setAlt] = useState("");
  const [imgtitle, setImgtitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(); // State to store current photo
  const [priority, setPriority] = useState(); // State to store selected priority
  const [priorityOptions, setPriorityOptions] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuListing();
  }, []);

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
    setCurrentPhoto(URL.createObjectURL(e.target.files[0])); // Set the preview image URL
  };

  const fetchMenuListing = async () => {
    try {
      const response = await axios.get(`/api/menulisting/getMenulistingById?id=${id}`, { withCredentials: true });
      const { count, menuListing } = response.data; // Assuming your response structure includes both count and menuListing

      setPagename(menuListing.pagename);
      setAlt(menuListing.alt);
      setImgtitle(menuListing.imgtitle);
      setPriority(menuListing.priority)
      setPhoto(menuListing.photo)
      setCurrentPhoto(`/api/logo/download/${menuListing.photo}`); // Set current photo if available

      // Update priority options based on count
      if (count > 0) {
        const options = Array.from({ length: count }, (_, i) => i + 1);
        setPriorityOptions(options);
      } else {
        setPriorityOptions([1]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('pagename', pagename);
      formData.append('alt', alt);
      formData.append('imgtitle', imgtitle);
      if (photo) {
        formData.append('photo', photo);
      }
      formData.append('priority', priority); 

      const response = await axios.put(`/api/menulisting/updateMenulisting?id=${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

  
      navigate('/menulisting');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
        <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit Menulisting</h1>
      <div className="mb-4">
        <label htmlFor="pagename" className="block font-semibold mb-2">
          Page Name
        </label>
        <input
          type="text"
          id="pagename"
          value={pagename}
          onChange={(e) => setPagename(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="alt" className="block font-semibold mb-2">
          Alternative Text
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
        <label htmlFor="imgtitle" className="block font-semibold mb-2">
          Image Title Text
        </label>
        <input
          type="text"
          id="imgtitle"
          value={imgtitle}
          onChange={(e) => setImgtitle(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
      {currentPhoto && (
        <div className="mb-4">
          <label className="block font-semibold mb-2">Current Photo</label>
          <img src={currentPhoto} alt="Current" className="w-56 h-32 object-cover" />
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="photo" className="block font-semibold mb-2">
          Upload New Photo
        </label>
        <input
          type="file"
          id="photo"
          onChange={handleFileChange}
          accept="photo/*"
          className="w-full p-2 border rounded focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="priority" className="block font-semibold mb-2">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          className="w-full p-2 border rounded focus:outline-none"
          required
        >
          {priorityOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
      >
        Save Changes
      </button>
    </form>
  );
};

export default EditMenuListingForm;
