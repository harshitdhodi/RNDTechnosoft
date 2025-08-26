import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { z } from 'zod';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SubsectionsComponent from "../Pages/SubsectionEditor";
import QuestionsComponent from "../Pages/QuestionEditor";

// Content type mapping
const contentTypeMap = [
  { type: 'webSolution', name: 'Web Solutions', hasSubsections: true, hasQuestions: true },
  { type: 'homecard1', name: 'Home Card 1', hasSubsections: false, hasQuestions: false },
  { type: 'bookcall', name: 'Book a Call', hasSubsections: false, hasQuestions: false },
  { type: 'whyPartnerus', name: 'Why Partner Us?', hasSubsections: true, hasQuestions: false },
  { type: 'globalsolution', name: 'Global Solutions', hasSubsections: true, hasQuestions: false },
  { type: 'challengesface', name: 'Challenges We Face', hasSubsections: false, hasQuestions: true },
  { type: 'ourservices', name: 'Our Services', hasSubsections: true, hasQuestions: false },
  { type: 'homecard2', name: 'Home Card 2', hasSubsections: false, hasQuestions: false },
  { type: 'premiumtemplates', name: 'Premium Templates', hasSubsections: false, hasQuestions: false },
  { type: 'weareexpertsin', name: 'We are experts in', hasSubsections: true, hasQuestions: false },
  { type: 'everyplan', name: 'What you\'ll get with every plan', hasSubsections: true, hasQuestions: false }
];

// Zod validation schema
const contentSchema = z.object({
  heading: z.string()
    .min(3, "Heading must be at least 3 characters")
    .max(200, "Heading must not exceed 200 characters")
    .refine(val => val.trim() !== '', "Heading cannot be empty or only spaces"),
  subheading: z.string()
    .max(300, "Subheading must not exceed 300 characters")
    .refine(val => val.trim() !== '', "Subheading cannot be only spaces")
    .optional(),
  description: z.string()
    .max(5000, "Description must not exceed 5000 characters")
    .refine(val => val.trim() !== '', "Description cannot be only spaces")
    .optional(),
  videoAlt: z.string()
    .max(200, "Video alt text must not exceed 200 characters")
    .refine(val => val.trim() !== '', "Video alt text cannot be only spaces")
    .optional(),
  videotitle: z.string()
    .max(200, "Video title must not exceed 200 characters")
    .refine(val => val.trim() !== '', "Video title cannot be only spaces")
    .optional(),
  photoAlt: z.string()
    .max(200, "Photo alt text must not exceed 200 characters")
    .refine(val => val.trim() !== '', "Photo alt text cannot be only spaces")
    .optional(),
  imgtitle: z.string()
    .max(200, "Image title must not exceed 200 characters")
    .refine(val => val.trim() !== '', "Image title cannot be only spaces")
    .optional(),
  status: z.boolean()
});

const fileValidation = {
  image: (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (file.size > maxSize) {
      return "Image size must be less than 5MB";
    }
    if (!allowedTypes.includes(file.type)) {
      return "Only JPEG, JPG, PNG, and WebP images are allowed";
    }
    return null;
  },
  video: (file) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
    
    if (file.size > maxSize) {
      return "Video size must be less than 100MB";
    }
    if (!allowedTypes.includes(file.type)) {
      return "Only MP4, AVI, MOV, WMV, and WebM videos are allowed";
    }
    return null;
  }
};

const EditExtraPage = () => {
  const { contentType } = useParams();
  const [photo, setPhoto] = useState([]);
  const [video, setVideo] = useState("");
  const [videoAlt, setVideoAlt] = useState("");
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([{ question: "", answer: "" }]);
  const [subsections, setSubsections] = useState([
    { photo: "", photoAlt: "", title: "", description: "" },
  ]);
  const [status, setStatus] = useState(false);
  const [contentId, setContentId] = useState("");
  const [videotitle, setVideotitle] = useState("");
  const [imgtitle, setImgtitle] = useState([]);
  const [initialPhotos, setInitialPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [initialPhotoAlts, setInitialPhotoAlts] = useState([]);
  const [initialVideoAlt, setInitialVideoAlt] = useState("");
  const [initialImgtitle, setInitialImgtitle] = useState([]);
  const [initialVideo, setInitialVideo] = useState("");
  const [initialVideotitle, setInitialVideotitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [enableSubsections, setEnableSubsections] = useState(false);
  const [enableQuestions, setEnableQuestions] = useState(false);
  const [headingCount, setHeadingCount] = useState(0);
  const [subheadingCount, setSubheadingCount] = useState(0);
  const [descriptionCount, setDescriptionCount] = useState(0);

  // Get content type info
  const getContentTypeInfo = () => {
    const contentTypeInfo = contentTypeMap.find(item => item.type === contentType);
    return contentTypeInfo || { name: 'Content', hasSubsections: false, hasQuestions: false };
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchContentDetails();
  }, []);

  useEffect(() => {
    // Update character counts
    setHeadingCount(heading.replace(/<[^>]*>/g, '').length);
    setSubheadingCount(subheading.replace(/<[^>]*>/g, '').length);
    setDescriptionCount(description.replace(/<[^>]*>/g, '').length);
  }, [heading, subheading, description]);

  const fetchContentDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/content/types/${contentType}`, {
        withCredentials: true,
      });
      const content = response.data[0];
      setHeading(content.heading || "");
      setSubheading(content.subheading || "");
      setDescription(content.description || "");
      setInitialPhotos(content.photo || []);
      setStatus(content.status || false);
      setInitialPhotoAlts(content.photoAlt || []);
      setInitialVideo(content.video || "");
      setInitialVideoAlt(content.videoAlt || "");
      setInitialImgtitle(content.imgtitle || []);
      setInitialVideotitle(content.videotitle || "");
      setQuestions(
        content.questions?.length > 0
          ? content.questions
          : [{ question: "", answer: "" }]
      );
      setSubsections(
        content.subsections?.length > 0
          ? content.subsections
          : [{ photo: "", photoAlt: "", title: "", description: "" }]
      );
      setContentId(content._id || "");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch content details");
    } finally {
      setLoading(false);
    }
  };

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

  const validateForm = () => {
    try {
      const formData = {
        heading: heading.replace(/<[^>]*>/g, ''),
        subheading: subheading?.replace(/<[^>]*>/g, '') || '',
        description: description?.replace(/<[^>]*>/g, '') || '',
        videoAlt: videoAlt || initialVideoAlt,
        videotitle: videotitle || initialVideotitle,
        photoAlt: photoAlts[0] || initialPhotoAlts[0] || '',
        imgtitle: imgtitle[0] || initialImgtitle[0] || '',
        status: Boolean(status)
      };
      
      contentSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      const fieldErrors = {};
      if (error.errors) {
        error.errors.forEach(err => {
          fieldErrors[err.path[0]] = err.message;
        });
      }
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("heading", heading);
      formData.append("subheading", subheading);
      formData.append("description", description);
      formData.append("status", status);
      formData.append('video', video || initialVideo);
      formData.append('videoAlt', videoAlt || initialVideoAlt);
      formData.append('videotitle', videotitle || initialVideotitle);

      const combinedAlts = [...initialPhotoAlts, ...photoAlts];
      const combinedImgtitle = [...initialImgtitle, ...imgtitle];

      photo.forEach((p) => {
        formData.append('photo', p);
      });

      combinedAlts.forEach((a) => {
        formData.append('photoAlt', a);
      });

      combinedImgtitle.forEach((m) => {
        formData.append('imgtitle', m);
      });

      await axios.put(`/api/content/${contentType}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast.success("Content updated successfully!");
      setTimeout(() => {
        navigate(`/extrapages/${contentType}`);
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update content");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      const error = fileValidation.image(selectedFile);
      if (error) {
        toast.error(error);
        return;
      }
      
      setPhoto([selectedFile]);
      setPhotoAlts([""]);
      setImgtitle([""]);
    }
  };

  const handleVideoChange = (e) => {
    const selectedVideo = e.target.files[0];
    if (selectedVideo) {
      const error = fileValidation.video(selectedVideo);
      if (error) {
        toast.error(error);
        return;
      }
      setVideo(selectedVideo);
    }
  };

  const handleInitialAltTextChange = (e, index) => {
    const newPhotoAlts = [...initialPhotoAlts];
    newPhotoAlts[index] = e.target.value;
    setInitialPhotoAlts(newPhotoAlts);
  };

  const handleNewAltTextChange = (e, index) => {
    const newPhotoAlts = [...photoAlts];
    newPhotoAlts[index] = e.target.value;
    setPhotoAlts(newPhotoAlts);
  };

  const handleInitialImgtitleChange = (e, index) => {
    const newImgtitles = [...initialImgtitle];
    newImgtitles[index] = e.target.value;
    setInitialImgtitle(newImgtitles);
  };

  const handleNewImgtitleChange = (e, index) => {
    const newImgtitles = [...imgtitle];
    newImgtitles[index] = e.target.value;
    setImgtitle(newImgtitles);
  };

  const handleDeleteInitialPhoto = async (e, photoFilename, index) => {
    e.preventDefault();
    try {
      await axios.delete(
        `/api/content/deletePhotoAndAltText/${contentId}/${photoFilename}/${index}`, 
        { withCredentials: true }
      );
      
      setInitialPhotos([]);
      setInitialPhotoAlts([]);
      setInitialImgtitle([]);
      
      toast.success("Photo deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete photo");
    }
  };

  const handleDeleteNewPhoto = (e, index) => {
    e.preventDefault();
    setPhoto([]);
    setPhotoAlts([]);
    setImgtitle([]);
  };

  const handleDeleteVideo = async (e) => {
    e.preventDefault();
    try {
      if (initialVideo) {
        await axios.delete(`/api/content/${contentId}/video/${initialVideo}`, {
          withCredentials: true,
        });
      }
      
      setVideo(null);
      setInitialVideo("");
      setVideoAlt("");
      setInitialVideoAlt("");
      setVideotitle("");
      setInitialVideotitle("");
      
      toast.success("Video deleted successfully");
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error("Failed to delete video");
    }
  };

  if (loading && !contentId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="max-w-6xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8 border-b pb-4">
            Edit {getContentTypeInfo().name}
          </h1>

          {/* Heading */}
          <div className="mb-6">
            <label htmlFor="heading" className="block text-sm font-semibold text-gray-700 mb-2">
              Heading <span className="text-red-500">*</span>
            </label>
            <div className="min-h-[120px]">
              <ReactQuill
                value={heading}
                onChange={setHeading}
                placeholder="Enter your heading here..."
                className="bg-white"
                modules={modules}
                style={{ height: '80px' }}
              />
              <p className="text-sm text-gray-500 mt-2">
                Characters: {headingCount}/200
              </p>
            </div>
            {errors.heading && (
              <p className="text-red-500 text-sm mt-2">{errors.heading}</p>
            )}
          </div>

          {/* Subheading */}
          <div className="mb-6">
            <label htmlFor="subheading" className="block text-sm font-semibold text-gray-700 mb-2">
              Subheading
            </label>
            <div className="min-h-[120px]">
              <ReactQuill
                value={subheading}
                onChange={setSubheading}
                placeholder="Enter your subheading here..."
                className="bg-white"
                modules={modules}
                style={{ height: '80px' }}
              />
              <p className="text-sm text-gray-500 mt-2">
                Characters: {subheadingCount}/300
              </p>
            </div>
            {errors.subheading && (
              <p className="text-red-500 text-sm mt-2">{errors.subheading}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <div className="min-h-[200px]">
              <ReactQuill
                value={description}
                onChange={setDescription}
                placeholder="Enter your detailed description here..."
                className="bg-white"
                modules={modules}
                style={{ height: '160px' }}
              />
              <p className="text-sm text-gray-500 mt-2">
                Characters: {descriptionCount}/5000
              </p>
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm mt-2">{errors.description}</p>
            )}
          </div>

          {/* Current Photos */}
          {initialPhotos && initialPhotos.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Current Photo
              </label>
              <div className="max-w-md">
                <div className="relative bg-white border rounded-lg shadow-sm p-4">
                  <img
                    src={`/api/image/download/${initialPhotos[0]}`}
                    alt={initialPhotoAlts[0] || "Current photo"}
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Alternative Text:
                      </label>
                      <input
                        type="text"
                        value={initialPhotoAlts[0] || ""}
                        onChange={(e) => handleInitialAltTextChange(e, 0)}
                        placeholder="Describe this image for accessibility"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.photoAlt && (
                        <p className="text-red-500 text-sm mt-2">{errors.photoAlt}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Title Text:
                      </label>
                      <input
                        type="text"
                        value={initialImgtitle[0] || ""}
                        onChange={(e) => handleInitialImgtitleChange(e, 0)}
                        placeholder="Enter image title"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.imgtitle && (
                        <p className="text-red-500 text-sm mt-2">{errors.imgtitle}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteInitialPhoto(e, initialPhotos[0], 0)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex justify-center items-center transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add New Photo */}
          {(!initialPhotos || initialPhotos.length === 0) && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Add Photo
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Maximum file size: 5MB. Supported formats: JPEG, JPG, PNG, WebP
              </p>
              
              {photo.length > 0 && (
                <div className="max-w-md mt-4">
                  <div className="relative bg-white border rounded-lg shadow-sm p-4">
                    <img
                      src={URL.createObjectURL(photo[0])}
                      alt={photoAlts[0] || "New Photo"}
                      className="w-full h-48 object-cover rounded-md mb-3"
                    />
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Alternative Text:
                        </label>
                        <input
                          type="text"
                          value={photoAlts[0] || ""}
                          onChange={(e) => handleNewAltTextChange(e, 0)}
                          placeholder="Describe this image for accessibility"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.photoAlt && (
                          <p className="text-red-500 text-sm mt-2">{errors.photoAlt}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Title Text:
                        </label>
                        <input
                          type="text"
                          value={imgtitle[0] || ""}
                          onChange={(e) => handleNewImgtitleChange(e, 0)}
                          placeholder="Enter image title"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.imgtitle && (
                          <p className="text-red-500 text-sm mt-2">{errors.imgtitle}</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteNewPhoto(e, 0)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex justify-center items-center transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Video Upload */}
          <div className="mb-6">
            <label htmlFor="video" className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Video
            </label>
            <input
              type="file"
              id="video"
              onChange={handleVideoChange}
              accept="video/*"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Maximum file size: 100MB. Supported formats: MP4, AVI, MOV, WMV, WebM
            </p>
            
            {(video || initialVideo) && (
              <div className="mt-4 bg-white border rounded-lg shadow-sm p-4 max-w-md">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Current Video
                </label>
                <div className="relative">
                  <video
                    src={video ? URL.createObjectURL(video) : `/api/video/download/${initialVideo}`}
                    controls
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Video Alt Text:
                      </label>
                      <input
                        type="text"
                        value={videoAlt || initialVideoAlt}
                        onChange={(e) => setVideoAlt(e.target.value)}
                        placeholder="Describe this video for accessibility"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.videoAlt && (
                        <p className="text-red-500 text-sm mt-2">{errors.videoAlt}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Video Title:
                      </label>
                      <input
                        type="text"
                        value={videotitle || initialVideotitle}
                        onChange={(e) => setVideotitle(e.target.value)}
                        placeholder="Enter video title"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.videotitle && (
                        <p className="text-red-500 text-sm mt-2">{errors.videotitle}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteVideo}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex justify-center items-center transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="mb- 8">
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              value={status ? "active" : "inactive"}
              onChange={(e) => setStatus(e.target.value === "active")}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" disabled>Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-md font-semibold text-white transition-colors ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                'Update Details'
              )}
            </button>
          </div>
        </form>

        {/* Subsections Component */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Subsections</h2>
              {!getContentTypeInfo().hasSubsections && (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={enableSubsections}
                    onChange={(e) => setEnableSubsections(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Enable Subsections</span>
                </label>
              )}
            </div>
            {(getContentTypeInfo().hasSubsections || enableSubsections) ? (
              <SubsectionsComponent
                subsections={subsections}
                setSubsections={setSubsections}
                contentId={contentId}
              />
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Subsection editing is not available for this content type ({getContentTypeInfo().name}). Enable the toggle to add subsections.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Questions Component */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Questions</h2>
              {!getContentTypeInfo().hasQuestions && (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={enableQuestions}
                    onChange={(e) => setEnableQuestions(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Enable Questions</span>
                </label>
              )}
            </div>
            {(getContentTypeInfo().hasQuestions || enableQuestions) ? (
              <QuestionsComponent
                questions={questions}
                setQuestions={setQuestions}
                contentId={contentId}
              />
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Question editing is not available for this content type ({getContentTypeInfo().name}). Enable the toggle to add questions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditExtraPage;