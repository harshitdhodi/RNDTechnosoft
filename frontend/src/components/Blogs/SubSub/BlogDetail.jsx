import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function BlogDetail() {
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const location = useLocation();
  const navigate = useNavigate(); // Initialize the useNavigate hook
  // Fetch blog data based on the slug from the URL
  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true); // Start loading
      try {
        const slug = location.pathname.split("/").filter(Boolean).pop();
        const response = await axios.get(`/api/news/getNewsBySlug/${slug}`);
        setBlogData(response.data);
      } catch (error) {
        setError("Error fetching blog data");
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchBlogData();
  }, [location]);

  // Fetch latest blogs
  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const response = await axios.get("/api/news/getLatestBlogs");
        setLatestBlogs(response.data.blogs);
      } catch (error) {
        setError("Error fetching latest blogs");
        console.error("Error fetching latest blogs:", error);
      }
    };

    fetchLatestBlogs();
  }, [location]);

  // Handle blog click
  const handleBlogClick = async (slug) => {
    try {
      await axios.put(`/api/news/updateBlogVisits?slug=${slug}`);
      navigate(`/blog/${slug}`);
    } catch (error) {
      console.error("Error updating visits:", error);
    }
  };
  // Conditional rendering based on state
  if (loading) return null;
  if (error) return <p>{error}</p>;
  if (!blogData) return <p>No data found</p>;

  // Destructuring safely
  const { details } = blogData || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10 sm:pt-20 px-4 sm:px-8 md:px-16 lg:px-32 mb-6">
      {/* Left section */}
      <div className="col-span-1 md:col-span-2 lg:col-span-2">
        <div className="mb-4">
          <p className="text-sm md:text-lg text-black mb-2">
            {details ? (
              <div dangerouslySetInnerHTML={{ __html: details }} />
            ) : (
              "Easily manage your design projects with our convenient portal. Provide important details like"
            )}
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="col-span-1 md:col-span-1 lg:col-span-1 h-fit border-[3px] rounded-xl">
        <h2 className="text-lg md:text-xl lg:text-2xl font-serif text-center font-bold mt-4 mb-4">
          Latest Blogs
        </h2>
        <div className="flex mb-10 flex-col gap-4">
          {latestBlogs.map((blog) => (
            <div
              key={blog._id}
              onClick={() => handleBlogClick(blog.slug)} // Handle click for navigation
              className="cursor-pointer flex items-center mx-4 p-4 m-1 bg-white border-b border-gray-200 hover:bg-gray-100 transition-colors duration-300 rounded-2xl shadow-lg"
            >
              {blog.photo && blog.photo.length > 0 && (
                <img
                  src={`/api/image/download/${blog.photo[0]}`}
                  alt={blog.title}
                  className="w-16 h-16 rounded-md object-cover"
                />
              )}
              <div>
                <h3 className="text-sm md:text-md lg:text-md font-semibold line-clamp-2">
                  {blog.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
