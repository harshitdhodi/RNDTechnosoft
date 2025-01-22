import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SitemapForm = () => {
  const [urlInput, setUrlInput] = useState('https://rndtechnosoft.com/');
  const [changefreqInput, setChangefreqInput] = useState("");
  const [priorityInput, setPriorityInput] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/sitemap/createSitemap', {
        url: urlInput,
        changeFreq: changefreqInput,
        priority: priorityInput,
      });


      navigate('/sitemap');
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast.error('URL already exist in the sitemap!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <ToastContainer />
      <div className="mb-4">
        <label htmlFor="url" className="block font-semibold mb-2">
          URL
        </label>
        <input
          id="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        >
        </input>
      </div>
      <div className="mb-4">
        <label htmlFor="changefreq" className="block font-semibold mb-2">
          Change Frequency
        </label>
        <select
          id="changefreq"
          value={changefreqInput}
          onChange={(e) => setChangefreqInput(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        >
          <option value="">Select Change Frequency</option>
          <option value="always">Always</option>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="priority" className="block font-semibold mb-2">
          Priority
        </label>
        <input
          type="number"
          id="priority"
          value={priorityInput}
          onChange={(e) => setPriorityInput(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          min="0"
          max="1"
          step="0.01"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Add
      </button>
    </form>
  );
};

export default SitemapForm;
