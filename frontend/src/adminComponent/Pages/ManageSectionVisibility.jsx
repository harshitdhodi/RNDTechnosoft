import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageSectionVisibility() {
  const [content, setContent] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`/api/content`, { withCredentials: true });
        setContent(response.data);
      } catch (error) {
        console.error("Error fetching content data:", error);
      }
    };

    fetchContent();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const response = await axios.put(`/api/content/toggleStatus?id=${id}`, null, { withCredentials: true });

      setContent((prevContent) =>
        prevContent.map((item) =>
          item._id === id ? { ...item, status: response.data.status } : item
        )
      );
    } catch (error) {
      console.error("Error toggling content status:", error);
    }
  };

  return (
    <div className="mx-auto p-6 ">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Content Visibility</h1>
      <ul className="space-y-4">
        {content.map((item) => (
          <li key={item._id} className="flex justify-between items-center border-b pb-4">
            <span className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: item.heading }}></span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={item.status}
                onChange={() => toggleStatus(item._id)}
                className="sr-only" // Hides the default checkbox
              />
              <div className={`w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${item.status ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div className={`dot absolute w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ease-in-out ${item.status ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
