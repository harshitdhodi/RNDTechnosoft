import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link for navigation
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import ReactQuill styles
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeAnimationsTable = () => {
  const [homeAnimations, setHomeAnimations] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");


  const notify = () => {
    toast.success("Updated Successfully!");
  };

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=homeanimation', { withCredentials: true });
      const { heading, subheading } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
    } catch (error) {
      console.error(error);
    }
  };

  const saveHeadings = async () => {
    const formData = new FormData();
    formData.append("pagetype", 'homeanimation');
    formData.append("heading", heading);
    formData.append("subheading", subheading);
    try {
      await axios.put('/api/pageHeading/updateHeading?pageType=homeanimation', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      notify();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHeadings();
  }, []);

  useEffect(() => {
    fetchHomeAnimations();
  }, []);

  const handleHeadingChange = (e) => setHeading(e.target.value);
  const handleSubheadingChange = (e) => setSubheading(e.target.value);

  const fetchHomeAnimations = async () => {
    try {
      const response = await axios.get(
        "/api/home/getHomeAnimations"
      );
      setHomeAnimations(response.data.data); // Access the array inside the data field
    } catch (error) {
      console.error("Error fetching home animations:", error);
    }
  };

  const handleEdit = (id) => {
    // Redirect to update page with ID using Link
    // This function is just for handling edit, not used in Link
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/home/delete?id=${id}`);
      fetchHomeAnimations(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting home animation:", error);
    }
  };

  const getImageUrl = (filename) =>
    `/api/image/download/${filename}`;
  // const getVideoUrl = (filename) => `http://localhost:3006/api/video/download/${filename}`;

  return (
    <div className="w-[95%] mx-auto my-8">
      <ToastContainer />
      <div className="mb-8 border border-gray-200 shadow-lg p-4 rounded">
        <div className="grid md:grid-cols-2 md:gap-2 grid-cols-1">
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Heading</label>
            <input
              type="text"
              value={heading}
              onChange={handleHeadingChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Sub heading</label>
            <input
              type="text"
              value={subheading}
              onChange={handleSubheadingChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
            />
          </div>
        </div>
        <button
          onClick={saveHeadings}
          className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif"
        >
          Save
        </button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Home Animations</h2>
        <Link
          to={`/homeanimation/createHomeanimation`} // Generate a unique ID for the new entry
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add New
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Video
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Photo
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Subtitle
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Icons
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Optional Section
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {homeAnimations ? (
              homeAnimations.map((animation) => (
                <tr key={animation._id}>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <video controls className="w-24 h-24 object-cover">
                      <source
                        src={getImageUrl(animation.video)}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <img
                      src={getImageUrl(animation.photo)}
                      alt={animation.photoAltName}
                      title={animation.photoTitleName}
                      className="w-24 h-24 object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {animation.title}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {animation.subtitle || "-"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <ReactQuill
                      value={animation.description || "-"}
                      readOnly
                      theme="bubble"
                      className="w-full border-gray-300 rounded-md shadow-sm"
                    />
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {/* Check if iconPhoto and iconTitle are arrays and map over them */}
                    {Array.isArray(animation.iconPhoto) &&
                    animation.iconPhoto.length > 0 ? (
                      animation.iconPhoto.map((photo, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <img
                            src={getImageUrl(photo)}
                            alt={
                              Array.isArray(animation.iconPhotoAltName)
                                ? animation.iconPhotoAltName[index]
                                : ""
                            }
                            title={
                              Array.isArray(animation.iconPhotoTitleName)
                                ? animation.iconPhotoTitleName[index]
                                : ""
                            }
                            className="w-12 h-12 object-cover mr-2"
                          />{" "}
                          <ReactQuill
                            value={animation.iconTitle[index] || ""}
                            readOnly
                            theme="bubble"
                            className="w-full border-gray-300 rounded-md shadow-sm"
                          />
                        </div>
                      ))
                    ) : (
                      <p>No icons available</p>
                    )}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <div className="mb-4">
                      <h4 className="font-semibold">Paragraph:</h4>
                      <ReactQuill
                        value={animation.paragraph || "-"}
                        readOnly
                        theme="bubble"
                        className="w-64 border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">Author:</h4>
                      <ReactQuill
                        value={animation.author || "-"}
                        readOnly
                        theme="bubble"
                        className="w-64 border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                    {animation.authPhoto && (
                      <img
                        src={getImageUrl(animation.authPhoto)}
                        alt={animation.authPhotoAltName}
                        title={animation.authPhotoTitleName}
                        className="w-12 h-12 object-cover"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <Link
                      to={`/homeanimation/editHomeanimation/${animation._id}`}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(animation._id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No animations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomeAnimationsTable;
