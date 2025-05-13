import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

const EditNavbar = () => {
  const [pagename, setPagename] = useState("");

  const [priority, setPriority] = useState(0); // State to store selected priority
  const [priorityOptions, setPriorityOptions] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuListing();
  }, []);


  const fetchMenuListing = async () => {
    try {
      const response = await axios.get(`
/api/navbar/getMenulistingById?id=${id}`, { withCredentials: true });
      const { count, menuListing } = response.data; // Assuming your response structure includes both count and menuListing

      setPagename(menuListing.pagename);

      setPriority(menuListing.priority)


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
      formData.append('priority', priority);
      const response = await axios.put(`
/api/navbar/updateMenulisting?id=${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });


      navigate('/navbar-data');
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

export default EditNavbar;
