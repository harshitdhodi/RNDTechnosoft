import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
<<<<<<< HEAD
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

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
<<<<<<< HEAD
  const [status, setStatus] = useState("active");

  const [contentId, setContentId] = useState("");
=======
  const [status, setStatus] = useState(false);

  const [contentId, setContentId] = useState("");

>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const [videotitle, setVideotitle] = useState("")
  const [imgtitle, setImgtitle] = useState([])

  const [initialPhotos, setInitialPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [initialphotoAlts, setInitialPhotoAlts] = useState([]);
  const [initialVideoAlt, setInitialVideoAlt] = useState("");
  const [initialImgtitle, setInitialImgtitle] = useState([]);
  const [initialVideo, setInitialVideo] = useState("")
  const [initialVideotitle, setInitialVideotitle] = useState("")
<<<<<<< HEAD

  // Validation states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const navigate = useNavigate();

  useEffect(() => {
    fetchContentDetails();
  }, []);

<<<<<<< HEAD
  // Success and error notification functions
  const notifySuccess = (message) => {
    toast.success(message);
  };

  const notifyError = (message) => {
    toast.error(message);
  };
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

  const fetchContentDetails = async () => {
    try {
      const response = await axios.get(`/api/content/types/bookcall`, {
        withCredentials: true,
      });
      const content = response.data[0];
      setHeading(content.heading || "");
      setSubheading(content.subheading || "");
      setDescription(content.description || "");
<<<<<<< HEAD
      setInitialPhotos(content.photo || []);
      setStatus(content.status || "active");

      setInitialPhotoAlts(content.photoAlt || []);
      setInitialVideo(content.video || "");
      setInitialVideoAlt(content.videoAlt || "");
      setInitialImgtitle(content.imgtitle || [])
      setInitialVideotitle(content.videotitle || "")

      setQuestions(
        content.questions && content.questions.length > 0
=======
      setInitialPhotos(content.photo);
      setStatus(content.status);

      setInitialPhotoAlts(content.photoAlt);
      setInitialVideo(content.video);

      setInitialVideoAlt(content.videoAlt);
      setInitialImgtitle(content.imgtitle)
      setInitialVideotitle(content.videotitle)
      setQuestions(
        content.questions.length > 0
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          ? content.questions
          : [{ question: "", answer: "" }]
      );
      setSubsections(
<<<<<<< HEAD
        content.subsections && content.subsections.length > 0
=======
        content.subsections.length > 0
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          ? content.subsections
          : [{ photo: "", photoAlt: "", title: "", description: "" }]
      );
      setContentId(content._id || "");
<<<<<<< HEAD
      notifySuccess('Content loaded successfully');
    } catch (error) {
      notifyError('Error loading content. Please try again.');
      console.error('Fetch error:', error);
=======
    } catch (error) {
      console.error(error);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
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

<<<<<<< HEAD
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

=======
  const handleSubmit = async (e) => {
    e.preventDefault();
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    try {
      const formData = new FormData();
      formData.append("heading", heading);
      formData.append("subheading", subheading);
      formData.append("description", description);
      formData.append("status", status);

<<<<<<< HEAD
      formData.append('video', video || initialVideo);
      formData.append('videoAlt', videoAlt || initialVideoAlt);
      formData.append('videotitle', videotitle || initialVideotitle);
=======

      formData.append('video', video || initialVideo);
      formData.append('videoAlt', videoAlt || initialVideoAlt);
      formData.append('videotitle', videotitle || initialVideotitle); // Ensure this line is correct

>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

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

<<<<<<< HEAD
      const response = await axios.put(`/api/content/bookcall`, formData, {
=======
      // Log formData to the console
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      await axios.put(`/api/content/bookcall`, formData, {
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

<<<<<<< HEAD
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
=======
      navigate(`/edit-card`);
    } catch (error) {
      console.error(error);
    }
  };



  const handleFileChange = (e) => {
    const newPhotos = Array.from(e.target.files);
    setPhoto([...photo, ...newPhotos]);
  };

  const handleVideoChange = (e) => {
    const selectedVideo = e.target.files[0];
    console.log(selectedVideo)
    setVideo(selectedVideo);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  };

  const handleInitialAltTextChange = (e, index) => {
    const newPhotoAlts = [...initialphotoAlts];
    newPhotoAlts[index] = e.target.value;
    setInitialPhotoAlts(newPhotoAlts);
<<<<<<< HEAD
    
    // Clear error when user starts typing
    if (errors.photoAlt) {
      const newErrors = { ...errors };
      delete newErrors.photoAlt;
      setErrors(newErrors);
    }
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  };

  const handleNewAltTextChange = (e, index) => {
    const newPhotoAlts = [...photoAlts];
    newPhotoAlts[index] = e.target.value;
    setPhotoAlts(newPhotoAlts);
<<<<<<< HEAD
    
    // Clear error when user starts typing
    if (errors.newPhotoAlt) {
      const newErrors = { ...errors };
      delete newErrors.newPhotoAlt;
      setErrors(newErrors);
    }
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  };

  const handleInitialImgtitleChange = (e, index) => {
    const newImgtitles = [...initialImgtitle];
    newImgtitles[index] = e.target.value;
    setInitialImgtitle(newImgtitles);
<<<<<<< HEAD
    
    // Clear error when user starts typing
    if (errors.imgTitle) {
      const newErrors = { ...errors };
      delete newErrors.imgTitle;
      setErrors(newErrors);
    }
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  };

  const handleNewImgtitleChange = (e, index) => {
    const newImgtitles = [...imgtitle];
    newImgtitles[index] = e.target.value;
    setImgtitle(newImgtitles);
<<<<<<< HEAD
    
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
=======
  };




  const handleDeleteInitialPhoto = async (e, photoFilename, index) => {
    e.preventDefault();
    await axios.delete(
      `/api/content/deletePhotoAndAltText/${contentId}/${photoFilename}/${index}`, { withCredentials: true })
      .then(response => {
        const updatedPhotos = initialPhotos.filter(photo => photo !== photoFilename);
        setInitialPhotos(updatedPhotos);
        const updatedPhotoAlts = [...initialphotoAlts];
        updatedPhotoAlts.splice(index, 1);
        setInitialPhotoAlts(updatedPhotoAlts);
        const updatedImgtitle = [...initialImgtitle];
        updatedImgtitle.splice(index, 1);
        setInitialImgtitle(updatedImgtitle);
      })
      .catch(error => {
        console.error(error);
      });
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  };

  const handleDeleteNewPhoto = (e, index) => {
    e.preventDefault();
<<<<<<< HEAD
    
    const confirmDelete = window.confirm('Are you sure you want to remove this image?');
    if (!confirmDelete) return;

    setPhoto([]);
    setPhotoAlts([]);
    setImgtitle([]);
    
    notifySuccess('Image removed successfully');
=======
    const updatedPhotos = [...photo];
    updatedPhotos.splice(index, 1);
    setPhoto(updatedPhotos);
    const updatedPhotoAlts = [...photoAlts];
    updatedPhotoAlts.splice(index, 1);
    setPhotoAlts(updatedPhotoAlts);
    const updatedImgtitle = [...imgtitle];
    updatedImgtitle.splice(index, 1);
    setPhotoAlts(updatedImgtitle);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  };

  const handleDeleteVideo = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    
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
=======
    try {
      const videoFilename = video.name; // Get the current video filename
      await axios.delete(`/api/content/${contentId}/video/${videoFilename}`, {
        withCredentials: true,
      });
      // Reset video state
      setVideo(null);
      setVideoAlt(""); // Optionally reset alt text
    } catch (error) {
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      console.error('Error deleting video:', error);
    }
  };

<<<<<<< HEAD
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
=======
  return (
    <div>
      <form onSubmit={handleSubmit} className="p-4">
        <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit Testimonial</h1>
        {/* Heading */}
        <div className="mb-4">
          <label htmlFor="heading" className="block font-semibold mb-2">
            Heading
          </label>

          <ReactQuill
            value={heading}
            onChange={setHeading}
            className="bg-white"
            modules={modules} // Include modules for image handling

          />
        </div>
        {/* Subheading */}
        <div className="mb-4">
          <label htmlFor="subheading" className="block font-semibold mb-2">
            Subheading
          </label>

          <ReactQuill
            value={subheading}
            onChange={setSubheading}
            className="bg-white"
            modules={modules} // Include modules for image handling

          />
        </div>


        {/* Description */}
        <div className="mb-8">
          <label htmlFor="description" className="block font-semibold mb-2">
            Description
          </label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            className="bg-white"
            modules={modules} // Include modules for image handling

          />
        </div>




        <div className="mb-4">
          <label className="block font-semibold mb-2">Current Photos</label>
          <div className="flex flex-wrap gap-4">
            {initialPhotos.map((photo, index) => (
              <div key={index} className="relative w-56">
                <img
                  src={`/api/image/download/${photo}`}
                  alt={`Photo ${index + 1}`}
                  className="w-56 h-32 object-cover"
                />
                <label htmlFor={`alt-${index}`} className="block mt-2">
                  Alternative Text:
                  <input
                    type="text"
                    id={`alt-${index}`}
                    value={initialphotoAlts[index]}
                    onChange={(e) => handleInitialAltTextChange(e, index)}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </label>
                <label htmlFor={`alt-${index}`} className="block mt-2">
                  Title Text:
                  <input
                    type="text"
                    id={`imgtitle-${index}`}
                    value={initialImgtitle[index]}
                    onChange={(e) => handleInitialImgtitleChange(e, index)}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </label>
                <button
                  onClick={(e) => handleDeleteInitialPhoto(e, photo, index)}
                  className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 flex justify-center items-center"
                >
                  <span className="text-xs">X</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Add New Photos</label>
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="p-2 border rounded"
          />
          <div className="flex flex-wrap gap-4 mt-4">
            {photo.map((file, index) => (
              <div key={index} className="relative w-56">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`New Photo ${index + 1}`}
                  className="w-56 h-32 object-cover"
                />
                <label htmlFor={`imgtitle-new-${index}`} className="block mt-2">
                  Alternative Text:
                  <input
                    type="text"
                    id={`alt-new-${index}`}
                    value={photoAlts[index] || ""}
                    onChange={(e) => handleNewAltTextChange(e, index)}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </label>
                <label htmlFor={`imgtitle-new-${index}`} className="block mt-2">
                  Title Text:
                  <input
                    type="text"
                    id={`imgtitle-new-${index}`}
                    value={imgtitle[index] || ""}
                    onChange={(e) => handleNewImgtitleChange(e, index)}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </label>
                <button
                  onClick={(e) => handleDeleteNewPhoto(e, index)}
                  className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 flex justify-center items-center"
                >
                  <span className="text-xs">X</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="video" className="block font-semibold mb-2">
            Upload Video
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          </label>
          <input
            type="file"
            id="video"
            onChange={handleVideoChange}
            accept="video/*"
<<<<<<< HEAD
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
=======
            className="p-2 border rounded"
          />
          {(video || initialVideo) && (
            <div className="mt-4">
              <label className="block font-semibold mb-2">Current Video</label>
              <div className="relative w-56">
                <video
                  src={video ? URL.createObjectURL(video) : `/api/video/download/${initialVideo}`} // Update this to match your API endpoint for video
                  controls
                  className="w-56 h-32 object-cover"
                />
                <label htmlFor="videoAlt" className="block mt-2">
                  Video Alt Text:
                  <input
                    type="text"
                    id="videoAlt"
                    value={videoAlt || initialVideoAlt}
                    onChange={(e) => setVideoAlt(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </label>
                <label htmlFor="videotitle" className="block mt-2">
                  title Text:
                  <input
                    type="text"
                    id="videotitle"
                    value={videotitle || initialVideotitle}
                    onChange={(e) => setVideotitle(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </label>
                <button
                  onClick={handleDeleteVideo}
                  className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 flex justify-center items-center"
                >
                  <span className="text-xs">X</span>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
                </button>
              </div>
            </div>
          )}
        </div>

<<<<<<< HEAD
        {/* Status */}
        <div className="mb-6">
          <label htmlFor="status" className="block font-semibold mb-2">
            Status <span className="text-red-500">*</span>
=======

        <div className="mb-4">
          <label htmlFor="status" className="block font-semibold mb-2">
            Status
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
<<<<<<< HEAD
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
=======
            className="w-full p-2 border rounded focus:outline-none"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

<<<<<<< HEAD
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
=======
        <div className="mt-8 text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Update Detsils
          </button>
        </div>
      </form>

    </div>

  );
};

export default GetInTouchCard;
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
