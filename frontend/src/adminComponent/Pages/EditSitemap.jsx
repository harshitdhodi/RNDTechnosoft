import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditSitemap = () => {
  const { id: sitemapId } = useParams();
  const { type } = useParams();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [changeFreq, setChangeFreq] = useState("");
  const [priority, setPriority] = useState();

  useEffect(() => {
    const fetchSitemapData = async () => {
      try {
        let response;

        if (type === 'product-category') {
          response = await axios.get(`/api/product/fetchCategoryUrlPriorityFreqById?id=${sitemapId}`, { withCredentials: true });
        } else if (type === 'products') {
          response = await axios.get(`/api/product/fetchUrlPriorityFreqById?id=${sitemapId}`, { withCredentials: true });
        } else if (type === 'service-category') {
          response = await axios.get(`/api/services/fetchCategoryUrlPriorityFreqById?id=${sitemapId}`, { withCredentials: true });
        } else if (type === 'service') {
          response = await axios.get(`/api/services/fetchUrlPriorityFreqById?id=${sitemapId}`, { withCredentials: true });
        } else if (type === 'news-category') {
          response = await axios.get(`/api/news/fetchCategoryUrlPriorityFreqById?id=${sitemapId}`, { withCredentials: true });
        } else if (type === 'new') {
          response = await axios.get(`/api/news/fetchUrlPriorityFreqById?id=${sitemapId}`, { withCredentials: true });
        } else if (type === 'data') {
          response = await axios.get(`/api/sitemap/fetchUrlPriorityFreqById?id=${sitemapId}`, { withCredentials: true });
        }

        const { url, changeFreq, priority } = response.data;
        setUrl(url);
        setChangeFreq(changeFreq);
        setPriority(priority);
      } catch (error) {
        console.error('Error fetching sitemap data:', error);
      }
    };

    fetchSitemapData();
  }, [sitemapId, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sitemapData = {
        url: url,
        changeFreq: changeFreq,
        priority: priority,
      };

      let endpoint;

      if (type === 'productcategory') {
        endpoint = `/api/product/editCategoryUrlPriorityFreq?id=${sitemapId}`;
      } else if (type === 'product') {
        endpoint = `/api/product/editUrlPriorityFreq?id=${sitemapId}`;
      } else if (type === 'servicecategory') {
        endpoint = `/api/services/editCategoryUrlPriorityFreq?id=${sitemapId}`;
      } else if (type === 'services') {
        endpoint = `/api/services/editUrlPriorityFreq?id=${sitemapId}`;
      } else if (type === 'newscategory') {
        endpoint = `/api/news/editCategoryUrlPriorityFreq?id=${sitemapId}`;
      } else if (type === 'news') {
        endpoint = `/api/news/editUrlPriorityFreq?id=${sitemapId}`;
      } else if (type === 'data') {
        endpoint = `/api/sitemap/editUrlPriorityFreq?id=${sitemapId}`;
      }

      await axios.put(endpoint, sitemapData, { withCredentials: true });
      navigate('/sitemap');
    } catch (error) {
      console.error('Error updating sitemap:', error);
      toast.error('Failed to update sitemap.');
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
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={type !== 'data'}
          className="w-full p-2 border rounded focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="priority" className="block font-semibold mb-2">
          Priority
        </label>
        <input
          type="number"
          id="priority"
          min={0}
          max={1}
          step={0.01}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="changeFreq" className="block font-semibold mb-2">
          Change Frequency
        </label>
        <select
          id="changeFreq"
          value={changeFreq}
          onChange={(e) => setChangeFreq(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        >
          <option value="">Select Change Frequency</option>
          <option value="always">Always</option>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="never">Never</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Update Sitemap
      </button>
    </form>
  );
};

export default EditSitemap;
