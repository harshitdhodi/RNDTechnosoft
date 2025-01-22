import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCalendar } from 'react-icons/fa';
import { FaTags } from 'react-icons/fa';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';

const BlogHeader = () => {
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  useEffect(() => {
    // Fetch the data from the API
    const fetchBlogData = async () => {
      try {
        const slug = location.pathname.split('/').filter(Boolean).pop();
        const response = await axios.get(`/api/news/getNewsBySlug/${slug}`, { withCredentials: true });

        setBlogData(response.data);
      } catch (error) {
        setError('Error fetching data');
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [location]);

  if (loading) return null;
  if (error) return <p>{error}</p>;
  if (!blogData) return <p>No data found</p>;

  const { title, date, categoryName, serviceCategoryName, photo, imgtitle, alt } = blogData;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-[#333]  pt-16 pb-8 p-4 md:pt-44 md:pb-16 md:p-6 ">
      <div className="flex-1 md:ml-5">
        <h1 className="text-2xl md:text-4xl font-serif font-bold text-white mb-2">{title}</h1>
        <div className="flex flex-col md:flex-row items-start md:items-center text-md text-white gap-4">
          <div className='flex items-center gap-2 mb-2 md:mb-0'>
            <FaCalendar />
            <span>{format(new Date(date), 'MMMM d, yyyy')}</span>
          </div>
          <div className='flex items-center gap-2'>
            <FaTags />
            <span>{serviceCategoryName}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex justify-center mt-4 md:mt-0">
        <div className="w-full md:w-96 h-60 md:h-80">
          {photo && photo.length > 0 && (
            <img
              src={`/api/image/download/${photo[0]}`}
              alt={alt[0]}
              title={imgtitle[0]}
              className="rounded-lg w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;
