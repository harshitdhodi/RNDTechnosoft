import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
=======
import { useNavigate } from "react-router-dom"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VisionForm = () => {
<<<<<<< HEAD
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [bannerphoto, setBannerPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState(null);
  const [imgTitle, setImgTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoAlt, setPhotoAlt] = useState("");
  const [imgtitle, setImgtitle] = useState("");
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [initialPhotoAlt, setInitialPhotoAlt] = useState("");
  const [initialImgtitle, setInitialImgtitle] = useState("");
  const [status, setStatus] = useState('active');
  const [headingErrors, setHeadingErrors] = useState({});
  const [aboutCompanyErrors, setAboutCompanyErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validationRules = {
    heading: { min: 3, max: 100, required: true },
    subheading: { min: 3, max: 150, required: true },
    title: { min: 60, max: 150, required: true },
    description: { min: 300, max: 2000, required: true },
    alt: { min: 3, max: 100, required: true },
    imgTitle: { min: 3, max: 100, required: true },
    imgtitle: { min: 3, max: 100, required: true }
  };

  const stripHtmlTags = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const validateField = (fieldName, value, customRules = null) => {
    const rules = customRules || validationRules[fieldName];
    if (!rules) return '';

    const textValue = fieldName === 'description' ? stripHtmlTags(value) : value;
    const length = textValue.length;

    if (rules.required && (!value || value.trim() === '')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }

    if (value && length < rules.min) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${rules.min} characters`;
    }

    if (value && length > rules.max) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be no more than ${rules.max} characters`;
    }

    return '';
  };

  const validateHeadingForm = () => {
    const errors = {};

    errors.heading = validateField('heading', heading);
    errors.subheading = validateField('subheading', subheading);

    if (bannerphoto || existingPhoto) {
      const altError = validateField('alt', alt);
      const imgTitleError = validateField('imgTitle', imgTitle);
      
      if (altError) errors.alt = altError;
      if (imgTitleError) errors.imgTitle = imgTitleError;
    }

    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });

    setHeadingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAboutCompanyForm = () => {
    const errors = {};

    errors.title = validateField('title', title);
    errors.description = validateField('description', description);

    if (!status) {
      errors.status = "Status is required";
    }

    if (photo || initialPhoto) {
      const altError = validateField('imgtitle', photo ? photoAlt : initialPhotoAlt);
      const titleError = validateField('imgtitle', photo ? imgtitle : initialImgtitle);
      
      if (altError) errors.alt = altError;
      if (titleError) errors.imgtitle = titleError;
    }

    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });

    setAboutCompanyErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearFieldError = (fieldName, section = 'aboutCompany') => {
    if (section === 'heading') {
      if (headingErrors[fieldName]) {
        setHeadingErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    } else {
      if (aboutCompanyErrors[fieldName]) {
        setAboutCompanyErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  };

  const validateImageFile = (file) => {
    if (!file.type.startsWith('image/')) {
      return 'Please select only image files';
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'Image size must be less than 5MB';
    }

    return '';
  };

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=aboutcompany', { withCredentials: true });
      const { heading, subheading, photo, alt, imgTitle } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
      setAlt(alt || '');
      setImgTitle(imgTitle || '');
      setExistingPhoto(photo);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch heading data");
    }
  };

  const saveHeadings = async () => {
    if (!validateHeadingForm()) {
      toast.error("Please fix the validation errors in the heading section");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("pagetype", 'aboutcompany');
    formData.append("heading", heading);
    formData.append("subheading", subheading);
    formData.append("alt", alt);
    formData.append("imgTitle", imgTitle);
    if (bannerphoto) formData.append("photo", bannerphoto);

    try {
      await axios.put('/api/pageHeading/updateHeading?pageType=aboutcompany', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Heading updated successfully!");
      if (bannerphoto) {
        setExistingPhoto(bannerphoto.name);
        setPhotoPreview(null);
        setBannerPhoto(null);
        await fetchHeadings();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update heading");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchAboutCompany = async () => {
    try {
      const response = await axios.get('/api/aboutcompany/getAboutcompany', { withCredentials: true });
      const mission = response.data.data || {};
      setTitle(mission.title || '');
      setDescription(mission.description || '');
      if (mission.photo && mission.photo.length > 0) {
        setInitialPhoto(mission.photo[0]);
        setInitialPhotoAlt(mission.alt && mission.alt[0] ? mission.alt[0] : "");
        setInitialImgtitle(mission.imgtitle && mission.imgtitle[0] ? mission.imgtitle[0] : "");
      }
      setStatus(mission.status || 'active');
    } catch (error) {
      console.error('Error fetching mission data:', error);
      toast.error("Failed to fetch about company data");
    }
  };

  useEffect(() => {
    fetchHeadings();
    fetchAboutCompany();
  }, []);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      toast.error(`${file.name}: ${error}`);
      e.target.value = '';
      return;
    }

    if (existingPhoto || photoPreview) {
      const shouldReplace = window.confirm("An image already exists. Do you want to replace it with the new image?");
      if (!shouldReplace) {
        e.target.value = '';
        return;
      }
      
      if (existingPhoto && !photoPreview) {
        try {
          await axios.delete(`/api/logo/delete/${existingPhoto}`, { withCredentials: true });
          toast.success("Previous heading image deleted successfully!");
        } catch (error) {
          console.error('Error deleting existing heading image:', error);
          toast.error("Failed to delete previous heading image");
        }
      }
      
      setExistingPhoto(null);
      setPhotoPreview(null);
    }

    setBannerPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    clearFieldError('alt', 'heading');
    clearFieldError('imgTitle', 'heading');
    e.target.value = '';
  };

  const handleAboutPhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      toast.error(`${file.name}: ${error}`);
      e.target.value = '';
      return;
    }

    if (photo || initialPhoto) {
      const shouldReplace = window.confirm("An image already exists. Do you want to replace it with the new image?");
      if (!shouldReplace) {
        e.target.value = '';
        return;
      }
      
      if (initialPhoto) {
        try {
          await axios.delete(`/api/aboutcompany/image/${initialPhoto}/0`, { withCredentials: true });
          toast.success("Previous image deleted successfully!");
        } catch (error) {
          console.error('Error deleting existing image:', error);
          toast.error("Failed to delete previous image");
        }
      }
      
      setInitialPhoto(null);
      setInitialPhotoAlt("");
      setInitialImgtitle("");
      setPhoto(null);
      setPhotoAlt("");
      setImgtitle("");
    }

    setPhoto(file);
    setPhotoAlt("");
    setImgtitle("");
    clearFieldError('alt');
    clearFieldError('imgtitle');
    e.target.value = '';
  };

  const handleDeleteAboutPhoto = async () => {
    if (initialPhoto) {
      try {
        await axios.delete(`/api/aboutcompany/image/${initialPhoto}/0`, { withCredentials: true });
        toast.success("Previous image deleted successfully!");
      } catch (error) {
        console.error('Error deleting existing image:', error);
        toast.error("Failed to delete previous image");
      }
    }
    setInitialPhoto(null);
    setInitialPhotoAlt("");
    setInitialImgtitle("");
    setPhoto(null);
    setPhotoAlt("");
    setImgtitle("");
    clearFieldError('alt');
    clearFieldError('imgtitle');
    toast.success("Image removed successfully");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAboutCompanyForm()) {
      toast.error("Please fix the validation errors in the about company section");
      return;
    }

    if (!photo && !initialPhoto) {
      toast.error("Exactly one image is required for the about company section");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('status', status);

    if (photo) {
      formData.append('photo', photo);
      formData.append('alt', photoAlt);
      formData.append('imgtitle', imgtitle);
    } else if (initialPhoto) {
      formData.append('alt', initialPhotoAlt);
      formData.append('imgtitle', initialImgtitle);
    }

    try {
      await axios.put('/api/aboutcompany/updateAboutcompany', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("About company updated successfully!");
      setPhoto(null);
      setPhotoAlt("");
      setImgtitle("");
      setAboutCompanyErrors({});
      await fetchAboutCompany();
    } catch (error) {
      console.error('Error updating mission:', error);
      toast.error("Failed to update about company");
    } finally {
      setIsSubmitting(false);
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

  const getCharacterCount = (value, fieldName) => {
    const textValue = fieldName === 'description' ? stripHtmlTags(value) : value;
    return textValue.length;
  };

  const getCharacterCountDisplay = (value, fieldName) => {
    const count = getCharacterCount(value, fieldName);
    const rules = validationRules[fieldName];
    if (!rules) return '';

    const isOverLimit = count > rules.max;
    const isUnderLimit = count < rules.min && count > 0;
    
    let colorClass = 'text-gray-500';
    if (isOverLimit) colorClass = 'text-red-500';
    else if (isUnderLimit) colorClass = 'text-amber-500';
    
    return (
      <div className={`text-sm ${colorClass}`}>
        {count}/{rules.max} characters
        {rules.min > 0 && count > 0 && count < rules.min && ` (minimum ${rules.min})`}
      </div>
    );
  };

  return (
    <div>
      <ToastContainer />
      <div className="mb-8 border border-gray-200 shadow-lg p-4 rounded">
        <h1 className="text-xl font-bold text-gray-700 font-serif uppercase text-center mb-6">Page Heading</h1>
        <div className="grid md:grid-cols-2 md:gap-2 grid-cols-1">
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
              Heading <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => {
                setHeading(e.target.value);
                clearFieldError('heading', 'heading');
              }}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ${
                headingErrors.heading ? 'border-red-500' : ''
              }`}
            />
            {getCharacterCountDisplay(heading, 'heading')}
            {headingErrors.heading && (
              <p className="text-red-500 text-sm mt-1">{headingErrors.heading}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
              Sub heading <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subheading}
              onChange={(e) => {
                setSubheading(e.target.value);
                clearFieldError('subheading', 'heading');
              }}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ${
                headingErrors.subheading ? 'border-red-500' : ''
              }`}
            />
            {getCharacterCountDisplay(subheading, 'subheading')}
            {headingErrors.subheading && (
              <p className="text-red-500 text-sm mt-1">{headingErrors.subheading}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
              {(existingPhoto || photoPreview) ? 'Replace Photo' : 'Add Photo'} <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              onChange={handlePhotoChange}
              accept="image/*"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
            />
            <p className="text-sm text-gray-500 mt-1">
              Accepted formats: JPG, PNG, GIF, WEBP. Maximum 1 image, 5MB.
            </p>
            {(existingPhoto || photoPreview) && (
              <p className="text-sm text-amber-600 mt-1 font-medium">
                ⚠️ Selecting a new photo will automatically delete and replace the current photo.
              </p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Current Photo</label>
            {photoPreview ? (
              <div>
                <p className="text-green-600 font-semibold mb-2">New Photo (to be saved):</p>
                <img
                  src={photoPreview}
                  alt=""
                  className="w-32 h-32 object-cover mt-2 border-2 border-green-300 rounded"
                />
              </div>
            ) : existingPhoto ? (
              <div>
                <p className="text-gray-600 mb-2">Saved Photo:</p>
                <img
                  src={`/api/logo/download/${existingPhoto}`}
                  alt=""
                  className="w-32 h-32 object-cover mt-2 rounded"
                />
              </div>
            ) : (
              <p className="text-gray-500 italic">No photo uploaded</p>
            )}
          </div>
        </div>
        {(existingPhoto || photoPreview) && (
          <>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
                Image Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={imgTitle}
                onChange={(e) => {
                  setImgTitle(e.target.value);
                  clearFieldError('imgTitle', 'heading');
                }}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ${
                  headingErrors.imgTitle ? 'border-red-500' : ''
                }`}
                placeholder="Image title..."
              />
              {getCharacterCountDisplay(imgTitle, 'imgTitle')}
              {headingErrors.imgTitle && (
                <p className="text-red-500 text-sm mt-1">{headingErrors.imgTitle}</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
                Alt Text <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => {
                  setAlt(e.target.value);
                  clearFieldError('alt', 'heading');
                }}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ${
                  headingErrors.alt ? 'border-red-500' : ''
                }`}
                placeholder="Describe this image..."
              />
              {getCharacterCountDisplay(alt, 'alt')}
              {headingErrors.alt && (
                <p className="text-red-500 text-sm mt-1">{headingErrors.alt}</p>
              )}
            </div>
          </>
        )}
        <button
          onClick={saveHeadings}
          disabled={isSubmitting}
          className={`px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Save Heading'}
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className='p-4 overflow-x-auto'>
        <h1 className='text-xl font-bold text-gray-700 font-serif uppercase text-center mb-6'>About Company</h1>
        <div className="mb-4">
          <label htmlFor="title" className="block font-semibold mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              clearFieldError('title');
            }}
            className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${
              aboutCompanyErrors.title ? 'border-red-500' : ''
            }`}
          />
          {getCharacterCountDisplay(title, 'title')}
          {aboutCompanyErrors.title && (
            <p className="text-red-500 text-sm mt-1">{aboutCompanyErrors.title}</p>
          )}
        </div>
        <div className="mb-8">
          <label htmlFor="description" className="block font-semibold mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <ReactQuill
            value={description}
            onChange={(value) => {
              setDescription(value);
              clearFieldError('description');
            }}
            modules={modules}
            className={`quill ${aboutCompanyErrors.description ? 'border-red-500' : ''}`}
          />
          {getCharacterCountDisplay(description, 'description')}
          {aboutCompanyErrors.description && (
            <p className="text-red-500 text-sm mt-1">{aboutCompanyErrors.description}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="photo" className="block font-semibold mb-2">
            {(initialPhoto || photo) ? 'Replace Image' : 'Add Image'} (Max 1 image, 5MB) <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="photo"
            id="photo"
            onChange={handleAboutPhotoChange}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            accept="image/*"
          />
          <p className="text-sm text-gray-500 mt-1">
            Accepted formats: JPG, PNG, GIF, WEBP. Maximum 1 image, 5MB.
          </p>
          {(initialPhoto || photo) && (
            <p className="text-sm text-amber-600 mt-1 font-medium">
              ⚠️ Selecting a new image will automatically delete and replace the current image.
            </p>
          )}
          
          {(photo || initialPhoto) && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Selected Image:</h4>
              <div className="relative w-56 border rounded-lg p-2">
                <button
                  type="button"
                  className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none z-10"
                  onClick={handleDeleteAboutPhoto}
                  title="Remove image"
                >
                  <span className="text-xs font-bold">×</span>
                </button>
                <img
                  src={photo ? URL.createObjectURL(photo) : `/api/image/download/${initialPhoto}`}
                  alt=""
                  className="h-32 w-52 object-cover rounded"
                />
                
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">
                    Alt Text <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={photo ? photoAlt : initialPhotoAlt}
                    onChange={(e) => {
                      if (photo) {
                        setPhotoAlt(e.target.value);
                      } else {
                        setInitialPhotoAlt(e.target.value);
                      }
                      clearFieldError('alt');
                    }}
                    className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${
                      aboutCompanyErrors.alt ? 'border-red-500' : ''
                    }`}
                    placeholder="Describe this image..."
                  />
                  {getCharacterCountDisplay(photo ? photoAlt : initialPhotoAlt, 'alt')}
                  {aboutCompanyErrors.alt && (
                    <p className="text-red-500 text-xs mt-1">{aboutCompanyErrors.alt}</p>
                  )}
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">
                    Image Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={photo ? imgtitle : initialImgtitle}
                    onChange={(e) => {
                      if (photo) {
                        setImgtitle(e.target.value);
                      } else {
                        setInitialImgtitle(e.target.value);
                      }
                      clearFieldError('imgtitle');
                    }}
                    className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${
                      aboutCompanyErrors.imgtitle ? 'border-red-500' : ''
                    }`}
                    placeholder="Image title..."
                  />
                  {getCharacterCountDisplay(photo ? imgtitle : initialImgtitle, 'imgtitle')}
                  {aboutCompanyErrors.imgtitle && (
                    <p className="text-red-500 text-xs mt-1">{aboutCompanyErrors.imgtitle}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {(!photo && !initialPhoto) && (
            <p className="text-gray-500 italic mt-2">No image uploaded</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block font-semibold mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              clearFieldError('status');
            }}
            className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${
              aboutCompanyErrors.status ? 'border-red-500' : ''
            }`}
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {aboutCompanyErrors.status && (
            <p className="text-red-500 text-sm mt-1">{aboutCompanyErrors.status}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Updating...' : 'Update About Company'}
        </button>
      </form>
    </div>
  );
};

export default VisionForm;
=======
    const [heading, setHeading] = useState("");
    const [subheading, setSubheading] = useState("");
    const [bannerphoto, setBannerPhoto] = useState(null); // State for uploaded photo
    const [photoPreview, setPhotoPreview] = useState(null); // State for preview of uploaded photo
    const [existingPhoto, setExistingPhoto] = useState(null); // State for existing photo from the backend
    const [imgTitle, setImgTitle] = useState("");
    const [alt, setAlt] = useState("");
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState([]);
    const [status, setStatus] = useState('');
    const [initialPhotos, setInitialPhotos] = useState([]);
    const [photoAlts, setPhotoAlts] = useState([]);
    const [imgtitle, setImgtitle] = useState([]);
    const [initialphotoAlts, setInitialPhotoAlts] = useState([]);
    const [initialImgtitle, setInitialImgtitle] = useState([]);

    const navigate = useNavigate()


    const notify = () => {
        toast.success("Updated Successfully!");
    };

    const fetchHeadings = async () => {
        try {
            const response = await axios.get('/api/pageHeading/heading?pageType=aboutcompany', { withCredentials: true });
            const { heading, subheading, photo, alt, imgTitle } = response.data;
            setHeading(heading || '');
            setSubheading(subheading || '');
            setAlt(alt || '');
            setImgTitle(imgTitle || '');
            setExistingPhoto(photo);
        } catch (error) {
            console.error(error);
        }
    };
    const saveHeadings = async () => {
        const formData = new FormData();
        formData.append("pagetype", 'aboutcompany');
        formData.append("heading", heading);
        formData.append("subheading", subheading);
        formData.append("alt", alt);
        formData.append("imgTitle", imgTitle);
        if (photo) formData.append("photo", bannerphoto); // Append photo if a new one is uploaded

        try {
            await axios.put('/api/pageHeading/updateHeading?pageType=aboutcompany', formData, {
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

    const handleHeadingChange = (e) => setHeading(e.target.value);
    const handleSubheadingChange = (e) => setSubheading(e.target.value);

    // Handle file change and set preview
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setBannerPhoto(file);
        setPhotoPreview(URL.createObjectURL(file)); // Generate preview URL for photo
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

    const fetchAboutCompany = async () => {
        try {
            const response = await axios.get('/api/aboutcompany/getAboutcompany', { withCredentials: true });
            const mission = response.data.data || {};
            setTitle(mission.title || '');
            setDescription(mission.description || '');
            setInitialPhotos(mission.photo || []);
            setStatus(mission.status || 'active');
            setInitialPhotoAlts(mission.alt || []);
            setInitialImgtitle(mission.imgtitle || [])
        } catch (error) {
            console.error('Error fetching mission data:', error);
        }
    };

    useEffect(() => {
        fetchAboutCompany();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('status', status);

        const combinedAlts = [...initialphotoAlts, ...photoAlts];
        const combinedImgtitle = [...initialImgtitle, ...imgtitle];

        photo.forEach((p) => {
            formData.append(`photo`, p);
        });

        combinedAlts.forEach((a) => {
            formData.append(`alt`, a);
        })

        combinedImgtitle.forEach((m) => {
            formData.append(`imgtitle`, m);
        })

        try {
            await axios.put('/api/aboutcompany/updateAboutcompany', formData, { withCredentials: true });
            notify();
            setPhoto([])
            setPhotoAlts([])
            setImgtitle([])
            await fetchAboutCompany(); // Fetch the updated data
        } catch (error) {
            console.error('Error updating mission:', error);
        }
    };
    const handleFileChange = (e) => {
        const newPhotos = Array.from(e.target.files);
        setPhoto([...photo, ...newPhotos]);
    };

    const handleInitialAltTextChange = (e, index) => {
        const newPhotoAlts = [...initialphotoAlts];
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
        setPhotoAlts(newImgtitles);
    };



    const handleDeleteNewPhoto = (e, index) => {
        e.preventDefault();
        const updatedPhotos = [...photo];
        updatedPhotos.splice(index, 1);
        setPhoto(updatedPhotos);
        const updatedPhotoAlts = [...initialphotoAlts];
        updatedPhotoAlts.splice(index, 1);
        setInitialPhotoAlts(updatedPhotoAlts);
        const updatedImgtitle = [...initialImgtitle];
        updatedImgtitle.splice(index, 1);
        setInitialImgtitle(updatedImgtitle);
    };

    const handleDeleteInitialPhoto = (e, photoFilename, index) => {
        e.preventDefault();
        axios.delete(`/api/aboutcompany/image/${photoFilename}/${index}`, { withCredentials: true })
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
    };

    return (
        <div>
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
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Photo</label>
                        <input
                            type="file"
                            onChange={handlePhotoChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
                        />
                    </div>
                    {/* Preview Section */}
                    <div className="mb-6">
                        {photoPreview ? (
                            <img
                                src={photoPreview}
                                alt="Preview"
                                className="w-32 h-32 object-cover mt-2"
                            />
                        ) : existingPhoto ? (
                            <img
                                src={`/api/logo/download/${existingPhoto}`}
                                alt="Existing photo"
                                className="w-32 h-32 object-cover mt-2"
                            />
                        ) : (
                            <p>No photo uploaded</p>
                        )}
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Image Title</label>
                    <input
                        type="text"
                        value={imgTitle}
                        onChange={(e) => setImgTitle(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Alt Text</label>
                    <input
                        type="text"
                        value={alt}
                        onChange={(e) => setAlt(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
                    />
                </div>

                <button
                    onClick={saveHeadings}
                    className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif"
                >
                    Save
                </button>
            </div>
            <form onSubmit={handleSubmit} className='p-4 overflow-x-auto'>
                <h1 className='text-xl font-bold  text-gray-700 font-serif uppercase text-center'>About Company</h1>
                <div className="mb-4">
                    <label htmlFor="title" className="block font-semibold mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none"
                        required
                    />
                </div>
                <div className="mb-8">
                    <label htmlFor="details" className="block font-semibold mb-2">
                        Description
                    </label>
                    <ReactQuill
                        value={description}
                        onChange={setDescription}
                        modules={modules} // Include modules for image handling
                        className="quill"
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
                                    Alternative Text :
                                    <input
                                        type="text"
                                        id={`alt-${index}`}
                                        value={initialphotoAlts[index]}
                                        onChange={(e) => handleInitialAltTextChange(e, index)}
                                        className="w-full p-2 border rounded focus:outline-none"
                                    />
                                </label>
                                <label htmlFor={`imgtitle-${index}`} className="block mt-2">
                                    Title Text :
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
                                    className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex justify-center items-center"
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

                                <label htmlFor={`alt-new-${index}`} className="block mt-2">
                                    Alternative Text :
                                    <input
                                        type="text"
                                        id={`alt-new-${index}`}
                                        value={photoAlts[index] || ""}
                                        onChange={(e) => handleNewAltTextChange(e, index)}
                                        className="w-full p-2 border rounded focus:outline-none"
                                    />
                                </label>
                                <button
                                    onClick={(e) => handleDeleteNewPhoto(e, index)}
                                    className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex
                justify-center items-center"
                                >
                                    <span className="text-xs">X</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="status" className="block font-semibold mb-2">
                        Status
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                >
                    Update Service
                </button>
            </form>
        </div>
    );
};

export default VisionForm;
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
