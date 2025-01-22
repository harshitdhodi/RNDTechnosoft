import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CgCalendarDates } from "react-icons/cg";
import { FaEye } from "react-icons/fa";

export default function HowRndHelp() {
  const [blogData, setBlogData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchBlogData = async () => {
      try {
        setBlogData([]); // Clear previous data
        const response = await axios.get(
          `/api/news/getCategoryBlogsBySlug/${slug}`,
          { withCredentials: true }
        );
        // Update state with the fetched data
        setBlogData(response.data.blogs);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchBlogData();
  }, [location, slug]);

  // Filter blog data based on the search term
  const filteredData = blogData.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 4); // Increase the number of visible cards
  };

  const handleReadMore = async (blogslug) => {
    try {
      await axios.put(`/api/news/updateBlogVisits?slug=${blogslug}`);
      navigate(`/blog/${blogslug}`);
    } catch (error) {
      console.error("Error updating visits:", error);
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Search section */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search blogs..."
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pb-20">
        {filteredData.slice(0, visibleCount).map((blog) => (
          <div
            key={blog._id}
            className="relative blog-card border border-lg border-black rounded-xl p-4 sm:p-6 flex flex-col gap-3 items-center bg-white shadow-lg transition-transform duration-300 hover:shadow-xl hover:scale-105"
          >
            <img
              src={`/api/image/download/${blog.photo[0]}`}
              alt={blog.alt[0]}
              title={blog.imgtitle[0]}
              className="w-full h-48 sm:h-40 lg:h-48 rounded-md object-cover mb-2"
            />
            <div className="flex flex-col items-center">
              <h3 className="text-lg md:text-xl font-semibold line-clamp-2 mb-2">
                {blog.title}
              </h3>
              <p className="text-sm md:text-md text-black line-clamp-2 mb-2">
                {blog?.details ? (
                  <div dangerouslySetInnerHTML={{ __html: blog.details }} />
                ) : (
                  "Easily manage your design projects with our convenient portal. Provide important details like"
                )}
              </p>

              <button
                onClick={() => handleReadMore(blog.slug)} // Use blog.slug to navigate
                className="relative mt-3 py-1 px-4 text-mg font-bold bg-[#f3ca0d] text-white rounded-3xl overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#f3ca0d] to-yellow-800 transform origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                <span className="relative z-10">Read More</span>
              </button>
            </div>
            <div className="flex justify-between w-full items-center">
              <div className="flex gap-2 items-center  text-gray-500">
                <CgCalendarDates size={20} />
                <p>
                  {format(new Date(blog.date), "MMMM d, yyyy")}
                </p>
              </div>
              <div className="flex gap-2 items-center  text-gray-500">
                <FaEye />
                <p > {blog.visits || 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < filteredData.length && (
        <div className="flex justify-center mt-5">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-[#333] text-white font-medium rounded hover:bg-[#334]"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
