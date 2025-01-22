import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

const EditSubmenuForm = () => {
  const [pagename, setPagename] = useState("");
  const [alt, setAlt] = useState("");
  const [imgtitle, setImgtitle] = useState("");

  const [details, setDetails] = useState(""); // Submenu details field
  const [photo, setPhoto] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(); // State to store current photo
  const [priority, setPriority] = useState(); // State to store selected priority
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [parentMenu, setParentMenu] = useState(""); // State for selected parent menu
  const [parentMenuOptions, setParentMenuOptions] = useState([]); // State for parent menu options
  const [error, setError] = useState(""); // State for error messages
  const { id } = useParams();
  const navigate = useNavigate();


  console.log(photo,priorityOptions)
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchSubmenu();
        await fetchParentMenus(); // Fetch parent menus for dropdown
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later.");
      }
    };

    fetchData();
  }, [id]); // Ensure `id` is included in dependency array

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
    setCurrentPhoto(URL.createObjectURL(e.target.files[0])); // Set the preview image URL
  };

  const fetchSubmenu = async () => {
    try {
      const response = await axios.get(`/api/submenulisting/getSubMenuListingById?id=${id}`, { withCredentials: true });
    
      const { count, submenuListing } = response.data; // Assuming your response structure includes both count and menuListing

      setPagename(submenuListing.pagename);
      setAlt(submenuListing.alt);
      setImgtitle(submenuListing.imgtitle);
      setDetails(submenuListing.details);
      setPriority(submenuListing.priority);
      setParentMenu(submenuListing.parent);
      setCurrentPhoto(`/api/logo/download/${submenuListing.photo}`); // Set current photo if available
    
      // Update priority options based on count
      if (count > 0) {
        const options = Array.from({ length: count }, (_, i) => i + 1);
        setPriorityOptions(options);
      } else {
        setPriorityOptions([1]);
      }
    } catch (error) {
      console.error("Error fetching submenu:", error);
      setError("Error fetching submenu details. Please try again later.");
    }
  };

  const fetchParentMenus = async () => {
    try {
      const response = await axios.get('/api/menulisting/getMenulisting', { withCredentials: true });
      setParentMenuOptions(response.data.menus);
    } catch (error) {
      console.error("Error fetching parent menus:", error);
      setError("Error fetching parent menus. Please try again later.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!pagename || !alt  || !imgtitle || !details || !parentMenu || priority === undefined) {
      setError("All fields are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('pagename', pagename);
      formData.append('alt', alt);
      formData.append('imgtitle', imgtitle);
      formData.append('details', details); // Include details field
      formData.append('parentMenu', parentMenu); // Include parent menu
      if (photo) {
        formData.append('photo', photo);
      }
      formData.append('priority', priority);

      await axios.put(`/api/submenulisting/updateSubMenuListing?id=${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      navigate('/menulisting');
    } catch (error) {
      console.error("Error updating submenu:", error);
      setError("Error updating submenu. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit Submenu</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
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
          Image title Text
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
      <div className="mb-4">
        <label htmlFor="details" className="block font-semibold mb-2">
          Details
        </label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
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

export default EditSubmenuForm;
