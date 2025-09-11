import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaPlus, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link for navigation
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import ReactQuill styles
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeAnimationsTable = () => {
  const [homeAnimations, setHomeAnimations] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewData, setPreviewData] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const notify = (message, type = 'success') => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!heading.trim()) newErrors.heading = 'Heading is required';
    if (!subheading.trim()) newErrors.subheading = 'Subheading is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveHeadings = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      notify('Please fill in all required fields', 'error');
      return;
    }

    setIsSaving(true);
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
      notify('Headings saved successfully!');
      await fetchHeadings(); // Refresh the data
    } catch (error) {
      console.error('Save failed:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save headings. Please try again.';
      notify(errorMessage, 'error');
    } finally {
      setIsSaving(false);
    }
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

  // Preview Modal Component
  const PreviewModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    const renderHtmlContent = (html) => {
      return { __html: html || "" };
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">Animation Preview</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Media */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-700">Video Preview</h3>
                  <div className="bg-black rounded-lg overflow-hidden">
                    <video controls className="w-full h-auto max-h-64 object-cover">
                      <source src={getImageUrl(data.video)} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-700">Featured Image</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={getImageUrl(data.photo)}
                      alt={data.photoAltName || 'Preview image'}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3 bg-gray-50">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Alt Text:</span> {data.photoAltName || 'Not provided'}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Title:</span> {data.photoTitleName || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {data.authPhoto && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-700">Author</h3>
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={getImageUrl(data.authPhoto)}
                        alt="Author"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {data.author && (
                        <div>
                          <p className="font-medium text-gray-800">
                            {data.author.split(',')[0].trim()}
                          </p>
                          {data.author.includes(',') && (
                            <p className="text-sm text-gray-600">
                              {data.author.split(',').slice(1).join(',').trim()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column - Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-700">Title</h3>
                  <p className="text-xl font-medium text-gray-900">{data.title || "-"}</p>
                </div>
                
                {data.subtitle && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-700">Subtitle</h3>
                    <p className="text-gray-800">{data.subtitle}</p>
                  </div>
                )}
                
                {data.description && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-700">Description</h3>
                    <div 
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={renderHtmlContent(data.description)}
                    />
                  </div>
                )}
                
                {Array.isArray(data.iconPhoto) && data.iconPhoto.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-700">Icons & Features</h3>
                    <div className="space-y-3">
                      {data.iconPhoto.map((photo, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          {photo && (
                            <img
                              src={getImageUrl(photo)}
                              alt={data.iconPhotoAltName?.[index] || `Icon ${index + 1}`}
                              className="w-8 h-8 flex-shrink-0 object-contain"
                            />
                          )}
                          {data.iconTitle?.[index] && (
                            <div 
                              className="prose max-w-none text-gray-700"
                              dangerouslySetInnerHTML={renderHtmlContent(data.iconTitle[index])}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {data.paragraph && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-700">Additional Information</h3>
                    <div 
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={renderHtmlContent(data.paragraph)}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <Link
                to={`/homeanimation/updateHomeanimation/${data._id}`}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Animation
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-[95%] mx-auto my-8">
      <ToastContainer />
      <form onSubmit={saveHeadings} className="mb-8 border border-gray-200 shadow-lg p-4 rounded">
        <div className="grid md:grid-cols-2 md:gap-4 grid-cols-1">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
              Heading <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => {
                setHeading(e.target.value);
                if (errors.heading) setErrors(prev => ({ ...prev, heading: null }));
              }}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none transition duration-300 ${
                errors.heading ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Enter heading"
            />
            {errors.heading && (
              <p className="mt-1 text-sm text-red-500">{errors.heading}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
              Sub heading <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subheading}
              onChange={(e) => {
                setSubheading(e.target.value);
                if (errors.subheading) setErrors(prev => ({ ...prev, subheading: null }));
              }}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none transition duration-300 ${
                errors.subheading ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Enter subheading"
            />
            {errors.subheading && (
              <p className="mt-1 text-sm text-red-500">{errors.subheading}</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className={`px-4 py-2 rounded transition duration-300 font-serif ${
            isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-slate-700 hover:bg-slate-900 text-white'
          }`}
        >
          {isSaving ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : 'Save Changes'}
        </button>
      </form>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Home Animations</h2>
        <Link
          to={`/homeanimation/createHomeanimation`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center whitespace-nowrap"
        >
          <FaPlus className="mr-2" /> Add New
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Video
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Photo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Subtitle
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                Icons
              </th>
              {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
                Optional Section
              </th> */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sticky right-0 bg-gray-50 z-10">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {homeAnimations?.map((animation) => (
              <tr key={animation._id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <video controls className="w-20 h-20 object-cover rounded">
                    <source src={getImageUrl(animation.video)} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <img
                    src={getImageUrl(animation.photo)}
                    alt={animation.photoAltName}
                    title={animation.photoTitleName}
                    className="w-20 h-20 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {animation.title || "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {animation.subtitle || "-"}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">
                  <div className="line-clamp-2" dangerouslySetInnerHTML={{ __html: animation.description || "-" }} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                  {Array.isArray(animation.iconPhoto) && animation.iconPhoto.length > 0 ? (
                    <div className="flex space-x-2">
                      {animation.iconPhoto.slice(0, 2).map((photo, index) => (
                        <img
                          key={index}
                          src={getImageUrl(photo)}
                          alt={animation.iconPhotoAltName?.[index] || ''}
                          className="w-8 h-8 object-cover rounded-full"
                        />
                      ))}
                      {animation.iconPhoto.length > 2 && (
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-xs">
                          +{animation.iconPhoto.length - 2}
                        </span>
                      )}
                    </div>
                  ) : "-"}
                </td>
                {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                  {animation.optionalSection || "-"}
                </td> */}
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium sticky right-0 bg-white z-10">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setPreviewData(animation);
                        setIsPreviewOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                      title="Preview"
                    >
                      <FaEye className="w-5 h-5" />
                    </button>
                    <Link
                      to={`/homeanimation/updateHomeanimation/${animation._id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit"
                    >
                      <FaEdit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(animation._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FaTrashAlt className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        data={previewData} 
      />
    </div>
  );
};

export default HomeAnimationsTable;
