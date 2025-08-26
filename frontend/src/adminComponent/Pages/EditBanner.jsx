import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const modules = {
  toolbar: [
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    [{ 'direction': 'rtl' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  }
};

const EditPageHeading = () => {
  const { id: pageHeadingId } = useParams();
  const navigate = useNavigate();
  const [pageType, setPageType] = useState("");
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [alt, setAlt] = useState("");
  const [imgTitle, setImgTitle] = useState("");
  const [photo, setPhoto] = useState(null); // For new photo upload
  const [currentPhoto, setCurrentPhoto] = useState(""); // For existing photo
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPhoto(selectedFile);
    }
  };

  const handleDeleteCurrentPhoto = async () => {
    if (!currentPhoto) return;
    
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/pageHeading/updateHeading/${pageHeadingId}/photo`, { 
        withCredentials: true 
      });
      setCurrentPhoto("");
      toast.success('Photo deleted successfully');
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  const handleRemoveNewPhoto = () => {
    setPhoto(null);
  };

  useEffect(() => {
    const fetchPageHeadingData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/pageHeading/updateHeading/${pageHeadingId}`, { 
          withCredentials: true 
        });
        
        console.log('Page heading data:', response.data);
        
        const data = response.data.data || response.data;
        
        setPageType(data.pageType || "");
        setHeading(data.heading || "");
        setSubheading(data.subheading || "");
        setAlt(data.alt || "");
        setImgTitle(data.imgTitle || "");
        setCurrentPhoto(data.photo || "");
        
      } catch (error) {
        console.error('Error fetching page heading:', error);
        toast.error('Failed to load page heading data');
      } finally {
        setLoading(false);
      }
    };

    if (pageHeadingId) {
      fetchPageHeadingData();
    }
  }, [pageHeadingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pageType || !heading) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      const formData = new FormData();
      formData.append('pageType', pageType);
      formData.append('heading', heading);
      formData.append('subheading', subheading);
      formData.append('alt', alt);
      formData.append('imgTitle', imgTitle);
      
      if (photo) {
        formData.append('photo', photo);
      }

      console.log('Updating page heading with data:', {
        pageType,
        heading,
        subheading,
        alt,
        imgTitle,
        hasNewPhoto: !!photo
      });

      const response = await axios.put(
        `/api/pageHeading/updateHeading/${pageHeadingId}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );

      console.log('Update response:', response.data);
      toast.success('Page heading updated successfully!');
      
      setTimeout(() => {
        navigate('/banner');
      }, 1500);

    } catch (error) {
      console.error('Error updating page heading:', error);
      
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update page heading. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <ToastContainer />
      
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center mb-6">
        Edit Page Heading
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Page Type */}
        <div className="mb-4">
          <label htmlFor="pageType" className="block font-semibold mb-2 text-gray-700">
            Page Type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="pageType"
            value={pageType}
            onChange={(e) => setPageType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter page type"
            required
          />
        </div>

        {/* Heading */}
        <div className="mb-4">
          <label htmlFor="heading" className="block font-semibold mb-2 text-gray-700">
            Heading <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter the main heading"
            required
          />
        </div>

        {/* Subheading */}
        <div className="mb-6">
          <label htmlFor="subheading" className="block font-semibold mb-2 text-gray-700">
            Subheading
          </label>
          <ReactQuill
            value={subheading}
            onChange={setSubheading}
            modules={modules}
            className="bg-white rounded-lg"
            placeholder="Enter the subheading or description"
          />
        </div>

        {/* Alt Text */}
        <div className="mb-4">
          <label htmlFor="alt" className="block font-semibold mb-2 text-gray-700">
            Alt Text
          </label>
          <input
            type="text"
            id="alt"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter alt text for accessibility"
          />
        </div>

        {/* Image Title */}
        <div className="mb-6">
          <label htmlFor="imgTitle" className="block font-semibold mb-2 text-gray-700">
            Image Title
          </label>
          <input
            type="text"
            id="imgTitle"
            value={imgTitle}
            onChange={(e) => setImgTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter image title"
          />
        </div>

        {/* Current Photo */}
        {currentPhoto && (
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-700">
              Current Photo
            </label>
            <div className="relative inline-block">
              <img
                src={`/api/logo/download/${currentPhoto}`}
                alt={alt || "Current photo"}
                className="w-64 h-48 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={handleDeleteCurrentPhoto}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 w-8 h-8 flex justify-center items-center transition-colors"
                title="Delete current photo"
              >
                <span className="text-sm">×</span>
              </button>
            </div>
          </div>
        )}

        {/* Upload New Photo */}
        <div className="mb-6">
          <label htmlFor="photo" className="block font-semibold mb-2 text-gray-700">
            {currentPhoto ? 'Replace Photo' : 'Upload Photo'}
          </label>
          <input
            type="file"
            id="photo"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* Preview new photo */}
          {photo && (
            <div className="mt-4">
              <label className="block font-semibold mb-2 text-gray-700">
                New Photo Preview
              </label>
              <div className="relative inline-block">
                <img
                  src={URL.createObjectURL(photo)}
                  alt="New photo preview"
                  className="w-64 h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveNewPhoto}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 w-8 h-8 flex justify-center items-center transition-colors"
                  title="Remove new photo"
                >
                  <span className="text-sm">×</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className={`py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
              submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {submitting ? 'Updating...' : 'Update Page Heading'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/banner')}
            className="py-3 px-6 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPageHeading;