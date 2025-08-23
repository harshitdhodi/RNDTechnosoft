import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

const GetInTouchCard = () => {
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
  const [status, setStatus] = useState("active");

  const [contentId, setContentId] = useState("");
  const [videotitle, setVideotitle] = useState("")
  const [imgtitle, setImgtitle] = useState([])

  const [initialPhotos, setInitialPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [initialphotoAlts, setInitialPhotoAlts] = useState([]);
  const [initialVideoAlt, setInitialVideoAlt] = useState("");
  const [initialImgtitle, setInitialImgtitle] = useState([]);
  const [initialVideo, setInitialVideo] = useState("")
  const [initialVideotitle, setInitialVideotitle] = useState("")

  // Validation states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchContentDetails();
  }, []);

  // Success and error notification functions
  const notifySuccess = (message) => {
    toast.success(message);
  };

  const notifyError = (message) => {
    toast.error(message);
  };

  const fetchContentDetails = async () => {
    try {
      const response = await axios.get(`/api/content/types/bookcall`, {
        withCredentials: true,
      });
      const content = response.data[0];
      setHeading(content.heading || "");
      setSubheading(content.subheading || "");
      setDescription(content.description || "");
      setInitialPhotos(content.photo || []);
      setStatus(content.status || "active");

      setInitialPhotoAlts(content.photoAlt || []);
      setInitialVideo(content.video || "");
      setInitialVideoAlt(content.videoAlt || "");
      setInitialImgtitle(content.imgtitle || [])
      setInitialVideotitle(content.videotitle || "")

      setQuestions(
        content.questions && content.questions.length > 0
          ? content.questions
          : [{ question: "", answer: "" }]
      );
      setSubsections(
        content.subsections && content.subsections.length > 0
          ? content.subsections
          : [{ photo: "", photoAlt: "", title: "", description: "" }]
      );
      setContentId(content._id || "");
      notifySuccess('Content loaded successfully');
    } catch (error) {
      notifyError('Error loading content. Please try again.');
      console.error('Fetch error:', error);
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

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!heading || heading.trim() === '' || heading === '<p><br></p>') {
      newErrors.heading = 'Heading is required';
    }

    if (!subheading || subheading.trim() === '' || subheading === '<p><br></p>') {
      newErrors.subheading = 'Subheading is required';
    }

    if (!description || description.trim() === '' || description === '<p><br></p>') {
      newErrors.description = 'Description is required';
    }

    // Alt text validation for current photo
    if (initialPhotos && initialPhotos.length > 0) {
      if (!initialphotoAlts[0] || initialphotoAlts[0].trim() === '') {
        newErrors.photoAlt = 'Alt text is required for accessibility';
      }
      if (!initialImgtitle[0] || initialImgtitle[0].trim() === '') {
        newErrors.imgTitle = 'Image title is required';
      }
    }

    // Alt text validation for new photo
    if (photo && photo.length > 0) {
      if (!photoAlts[0] || photoAlts[0].trim() === '') {
        newErrors.newPhotoAlt = 'Alt text is required for accessibility';
      }
      if (!imgtitle[0] || imgtitle[0].trim() === '') {
        newErrors.newImgTitle = 'Image title is required';
      }
    }

    // Video alt text validation
    if ((video || initialVideo) && !videoAlt && !initialVideoAlt) {
      newErrors.videoAlt = 'Video alt text is required for accessibility';
    }

    // Video title validation
    if ((video || initialVideo) && !videotitle && !initialVideotitle) {
      newErrors.videotitle = 'Video title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      notifyError('Please fix all validation errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("heading", heading);
      formData.append("subheading", subheading);
      formData.append("description", description);
      formData.append("status", status);

      formData.append('video', video || initialVideo);
      formData.append('videoAlt', videoAlt || initialVideoAlt);
      formData.append('videotitle', videotitle || initialVideotitle);

      const combinedAlts = [...initialphotoAlts, ...photoAlts];
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

      const response = await axios.put(`/api/content/bookcall`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      notifySuccess('Content updated successfully!');
      setTimeout(() => {
        navigate(`/edit-card`);
      }, 1500);

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        notifyError(`Update failed: ${error.response.data.message}`);
      } else {
        notifyError('Failed to update content. Please try again.');
      }
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Only take the first file for single image
    
    if (!file) return;
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      notifyError("Please select only image files");
      e.target.value = ''; // Clear the input
      return;
    }

    // Check if there are already photos (initial + new)
    const hasCurrentPhoto = initialPhotos && initialPhotos.length > 0;
    const hasNewPhoto = photo && photo.length > 0;
    
    if (hasCurrentPhoto || hasNewPhoto) {
      const shouldReplace = window.confirm("⚠️ WARNING: Only one image is allowed. The current image will be replaced with the new image. This action cannot be undone. Do you want to continue?");
      if (!shouldReplace) {
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Delete existing initial photos from backend if they exist
      if (hasCurrentPhoto) {
        try {
          await axios.delete(`/api/content/deletePhotoAndAltText/${contentId}/${initialPhotos[0]}/0`, { withCredentials: true });
          notifySuccess("Previous image deleted successfully!");
        } catch (error) {
          console.error('Error deleting existing image:', error);
          notifyError("Failed to delete previous image");
        }
      }
      
      // Clear all existing photos and related data
      setInitialPhotos([]);
      setInitialPhotoAlts([]);
      setInitialImgtitle([]);
      setPhoto([]);
      setPhotoAlts([]);
      setImgtitle([]);
    }

    // Set new single photo
    setPhoto([file]);
    setPhotoAlts(['']); // Initialize with empty alt text
    setImgtitle(['']); // Initialize with empty title
    
    // Clear the file input
    e.target.value = '';
  };

  const handleVideoChange = async (e) => {
    const selectedVideo = e.target.files[0];
    
    if (!selectedVideo) return;
    
    // Validate file is a video
    if (!selectedVideo.type.startsWith('video/')) {
      notifyError("Please select only video files");
      e.target.value = ''; // Clear the input
      return;
    }
    
    const hasCurrentVideo = initialVideo;
    const hasNewVideo = video;
    
    if (hasCurrentVideo || hasNewVideo) {
      const shouldReplace = window.confirm('⚠️ WARNING: Only one video is allowed. The current video will be replaced with the new video. This action cannot be undone. Do you want to continue?');
      
      if (!shouldReplace) {
        e.target.value = '';
        return;
      }
      
      // Delete existing video from backend if it exists
      if (hasCurrentVideo && !hasNewVideo) {
        try {
          await axios.delete(`/api/content/${contentId}/video/${initialVideo}`, { withCredentials: true });
          notifySuccess("Previous video deleted successfully!");
        } catch (error) {
          console.error('Error deleting existing video:', error);
          notifyError("Failed to delete previous video");
        }
      }
      
      // Clear existing video data
      setInitialVideo('');
      setInitialVideoAlt('');
      setInitialVideotitle('');
    }
    
    setVideo(selectedVideo);
    setVideoAlt(''); // Reset alt text
    setVideotitle(''); // Reset title
    
    // Clear the file input
    e.target.value = '';
  };

  const handleInitialAltTextChange = (e, index) => {
    const newPhotoAlts = [...initialphotoAlts];
    newPhotoAlts[index] = e.target.value;
    setInitialPhotoAlts(newPhotoAlts);
    
    // Clear error when user starts typing
    if (errors.photoAlt) {
      const newErrors = { ...errors };
      delete newErrors.photoAlt;
      setErrors(newErrors);
    }
  };

  const handleNewAltTextChange = (e, index) => {
    const newPhotoAlts = [...photoAlts];
    newPhotoAlts[index] = e.target.value;
    setPhotoAlts(newPhotoAlts);
    
    // Clear error when user starts typing
    if (errors.newPhotoAlt) {
      const newErrors = { ...errors };
      delete newErrors.newPhotoAlt;
      setErrors(newErrors);
    }
  };

  const handleInitialImgtitleChange = (e, index) => {
    const newImgtitles = [...initialImgtitle];
    newImgtitles[index] = e.target.value;
    setInitialImgtitle(newImgtitles);
    
    // Clear error when user starts typing
    if (errors.imgTitle) {
      const newErrors = { ...errors };
      delete newErrors.imgTitle;
      setErrors(newErrors);
    }
  };

  const handleNewImgtitleChange = (e, index) => {
    const newImgtitles = [...imgtitle];
    newImgtitles[index] = e.target.value;
    setImgtitle(newImgtitles);
    
    // Clear error when user starts typing
    if (errors.newImgTitle) {
      const newErrors = { ...errors };
      delete newErrors.newImgTitle;
      setErrors(newErrors);
    }
  };

  const handleDeleteInitialPhoto = async (e, photoFilename, index) => {
    e.preventDefault();
    
    const confirmDelete = window.confirm('Are you sure you want to delete this image? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `/api/content/deletePhotoAndAltText/${contentId}/${photoFilename}/${index}`, 
        { withCredentials: true }
      );
      
      setInitialPhotos([]);
      setInitialPhotoAlts([]);
      setInitialImgtitle([]);
      
      notifySuccess('Image deleted successfully');
    } catch (error) {
      notifyError('Failed to delete image. Please try again.');
      console.error('Delete error:', error);
    }
  };

  const handleDeleteNewPhoto = (e, index) => {
    e.preventDefault();
    
    const confirmDelete = window.confirm('Are you sure you want to remove this image?');
    if (!confirmDelete) return;

    setPhoto([]);
    setPhotoAlts([]);
    setImgtitle([]);
    
    notifySuccess('Image removed successfully');
  };

  const handleDeleteVideo = async (e) => {
    e.preventDefault();
    
    const confirmDelete = window.confirm('Are you sure you want to delete this video? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      if (initialVideo) {
        await axios.delete(`/api/content/${contentId}/video/${initialVideo}`, {
          withCredentials: true,
        });
        setInitialVideo('');
        setInitialVideoAlt('');
        setInitialVideotitle('');
      } else {
        setVideo(null);
        setVideoAlt('');
        setVideotitle('');
      }
      
      notifySuccess('Video deleted successfully');
    } catch (error) {
      notifyError('Failed to delete video. Please try again.');
      console.error('Error deleting video:', error);
    }
  };

  // Clear errors when user starts typing in ReactQuill fields
  const handleHeadingChange = (value) => {
    setHeading(value);
    if (errors.heading) {
      const newErrors = { ...errors };
      delete newErrors.heading;
      setErrors(newErrors);
    }
  };

  const handleSubheadingChange = (value) => {
    setSubheading(value);
    if (errors.subheading) {
      const newErrors = { ...errors };
      delete newErrors.subheading;
      setErrors(newErrors);
    }
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
    if (errors.description) {
      const newErrors = { ...errors };
      delete newErrors.description;
      setErrors(newErrors);
    }
  };

  const handleVideoAltChange = (e) => {
    setVideoAlt(e.target.value);
    if (errors.videoAlt) {
      const newErrors = { ...errors };
      delete newErrors.videoAlt;
      setErrors(newErrors);
    }
  };

  const handleVideotitleChange = (e) => {
    setVideotitle(e.target.value);
    if (errors.videotitle) {
      const newErrors = { ...errors };
      delete newErrors.videotitle;
      setErrors(newErrors);
    }
  };

  return (
    <div>
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
      <form onSubmit={handleSubmit} className="p-4">
        <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center mb-6">
          Edit Content
        </h1>

        {/* Heading */}
        <div className="mb-4">
          <label htmlFor="heading" className="block font-semibold mb-2">
            Heading <span className="text-red-500">*</span>
          </label>
          <ReactQuill
            value={heading}
            onChange={handleHeadingChange}
            className="bg-white"
            modules={modules}
          />
          {errors.heading && (
            <p className="text-red-500 text-sm mt-1">{errors.heading}</p>
          )}
        </div>

        {/* Subheading */}
        <div className="mb-4">
          <label htmlFor="subheading" className="block font-semibold mb-2">
            Subheading <span className="text-red-500">*</span>
          </label>
          <ReactQuill
            value={subheading}
            onChange={handleSubheadingChange}
            className="bg-white"
            modules={modules}
          />
          {errors.subheading && (
            <p className="text-red-500 text-sm mt-1">{errors.subheading}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-8">
          <label htmlFor="description" className="block font-semibold mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <ReactQuill
            value={description}
            onChange={handleDescriptionChange}
            className="bg-white"
            modules={modules}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Current Photo */}
        {initialPhotos && initialPhotos.length > 0 && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">Current Image</label>
            <div className="relative w-56">
              <img
                src={`/api/image/download/${initialPhotos[0]}`}
                alt={initialphotoAlts[0] || 'Current photo'}
                className="w-56 h-32 object-cover border rounded"
              />
              <div className="mt-2">
                <label htmlFor="alt-current" className="block">
                  Alternative Text <span className="text-red-500">*</span>:
                  <input
                    type="text"
                    id="alt-current"
                    value={initialphotoAlts[0] || ''}
                    onChange={(e) => handleInitialAltTextChange(e, 0)}
                    className={`w-full p-2 border rounded focus:outline-none ${
                      errors.photoAlt ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter alt text for accessibility"
                  />
                  {errors.photoAlt && (
                    <p className="text-red-500 text-xs mt-1">{errors.photoAlt}</p>
                  )}
                </label>
              </div>
              <div className="mt-2">
                <label htmlFor="imgtitle-current" className="block">
                  Title Text <span className="text-red-500">*</span>:
                  <input
                    type="text"
                    id="imgtitle-current"
                    value={initialImgtitle[0] || ''}
                    onChange={(e) => handleInitialImgtitleChange(e, 0)}
                    className={`w-full p-2 border rounded focus:outline-none ${
                      errors.imgTitle ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter image title"
                  />
                  {errors.imgTitle && (
                    <p className="text-red-500 text-xs mt-1">{errors.imgTitle}</p>
                  )}
                </label>
              </div>
              <button
                type="button"
                onClick={(e) => handleDeleteInitialPhoto(e, initialPhotos[0], 0)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center hover:bg-red-600"
                title="Delete image"
              >
                <span className="text-xs">✕</span>
              </button>
            </div>
          </div>
        )}

        {/* Add/Replace Image */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">
            {initialPhotos && initialPhotos.length > 0 ? 'Replace Image' : 'Add Image'}
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="p-2 border rounded w-full"
          />
          <p className="text-sm text-gray-600 mt-1">
            Only one image can be uploaded. Uploading a new image will replace the current one.
          </p>
          {(initialPhotos && initialPhotos.length > 0 || photo.length > 0) && (
            <p className="text-sm text-amber-600 mt-1 font-medium">
              ⚠️ Selecting a new image will automatically delete and replace the current image.
            </p>
          )}

          {/* Display new photo being added */}
          {photo && photo.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-green-600 mb-2">New Image (to be saved):</h4>
              <div className="relative w-56">
                <img
                  src={URL.createObjectURL(photo[0])}
                  alt="New photo"
                  className="w-56 h-32 object-cover border-2 border-green-300 rounded"
                />
                <div className="mt-2">
                  <label htmlFor="alt-new" className="block">
                    Alternative Text <span className="text-red-500">*</span>:
                    <input
                      type="text"
                      id="alt-new"
                      value={photoAlts[0] || ""}
                      onChange={(e) => handleNewAltTextChange(e, 0)}
                      className={`w-full p-2 border rounded focus:outline-none ${
                        errors.newPhotoAlt ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter alt text for accessibility"
                    />
                    {errors.newPhotoAlt && (
                      <p className="text-red-500 text-xs mt-1">{errors.newPhotoAlt}</p>
                    )}
                  </label>
                </div>
                <div className="mt-2">
                  <label htmlFor="imgtitle-new" className="block">
                    Title Text <span className="text-red-500">*</span>:
                    <input
                      type="text"
                      id="imgtitle-new"
                      value={imgtitle[0] || ""}
                      onChange={(e) => handleNewImgtitleChange(e, 0)}
                      className={`w-full p-2 border rounded focus:outline-none ${
                        errors.newImgTitle ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter image title"
                    />
                    {errors.newImgTitle && (
                      <p className="text-red-500 text-xs mt-1">{errors.newImgTitle}</p>
                    )}
                  </label>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDeleteNewPhoto(e, 0)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center hover:bg-red-600"
                  title="Remove image"
                >
                  <span className="text-xs">✕</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Video Upload */}
        <div className="mb-4">
          <label htmlFor="video" className="block font-semibold mb-2">
            {(initialVideo || video) ? 'Replace Video' : 'Upload Video'}
          </label>
          <input
            type="file"
            id="video"
            onChange={handleVideoChange}
            accept="video/*"
            className="p-2 border rounded w-full"
          />
          <p className="text-sm text-gray-600 mt-1">
            Only one video can be uploaded. Uploading a new video will replace the current one.
          </p>
          {(initialVideo || video) && (
            <p className="text-sm text-amber-600 mt-1 font-medium">
              ⚠️ Selecting a new video will automatically delete and replace the current video.
            </p>
          )}

          {(video || initialVideo) && (
            <div className="mt-4">
              <label className="block font-semibold mb-2">
                {video ? 'New Video (to be saved):' : 'Current Video:'}
              </label>
              <div className="relative w-56">
                <video
                  src={video ? URL.createObjectURL(video) : `/api/video/download/${initialVideo}`}
                  controls
                  className={`w-56 h-32 object-cover border rounded ${
                    video ? 'border-2 border-green-300' : ''
                  }`}
                />
                <div className="mt-2">
                  <label htmlFor="videoAlt" className="block">
                    Video Alt Text <span className="text-red-500">*</span>:
                    <input
                      type="text"
                      id="videoAlt"
                      value={videoAlt || initialVideoAlt}
                      onChange={handleVideoAltChange}
                      className={`w-full p-2 border rounded focus:outline-none ${
                        errors.videoAlt ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter video alt text for accessibility"
                    />
                    {errors.videoAlt && (
                      <p className="text-red-500 text-xs mt-1">{errors.videoAlt}</p>
                    )}
                  </label>
                </div>
                <div className="mt-2">
                  <label htmlFor="videotitle" className="block">
                    Video Title <span className="text-red-500">*</span>:
                    <input
                      type="text"
                      id="videotitle"
                      value={videotitle || initialVideotitle}
                      onChange={handleVideotitleChange}
                      className={`w-full p-2 border rounded focus:outline-none ${
                        errors.videotitle ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter video title"
                    />
                    {errors.videotitle && (
                      <p className="text-red-500 text-xs mt-1">{errors.videotitle}</p>
                    )}
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleDeleteVideo}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center hover:bg-red-600"
                  title="Delete video"
                >
                  <span className="text-xs">✕</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="mb-6">
          <label htmlFor="status" className="block font-semibold mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`py-3 px-6 rounded font-semibold text-white transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 focus:bg-blue-600'
            }`}
          >
            {isSubmitting ? 'Updating...' : 'Update Details'}
          </button>
        </div>

        {/* Required fields note */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Fields marked with <span className="text-red-500">*</span> are required
          </p>
        </div>
      </form>
    </div>
  );
};

export default GetInTouchCard;