import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCoreValue = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoAlt, setPhotoAlt] = useState("");
  const [imgtitle, setImgtitle] = useState("");
  const [status, setStatus] = useState("active");
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [initialPhotoAlt, setInitialPhotoAlt] = useState("");
  const [initialImgtitle, setInitialImgtitle] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const validationRules = {
    title: { min: 3, max: 100, required: true },
    description: { min: 10, max: 5000, required: true },
    alt: { min: 3, max: 100, required: true },
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

  const validateForm = () => {
    const newErrors = {};

    newErrors.title = validateField('title', title);
    newErrors.description = validateField('description', description);

    if (photo || initialPhoto) {
      const altError = validateField('alt', photo ? photoAlt : initialPhotoAlt);
      const titleError = validateField('imgtitle', photo ? imgtitle : initialImgtitle);
      
      if (altError) newErrors.alt = altError;
      if (titleError) newErrors.imgtitle = titleError;
    }

    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
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

  const fetchCoreValue = async () => {
    try {
      const response = await axios.get(`/api/corevalue/getCoreValueById?id=${id}`, { withCredentials: true });
      const coreValue = response.data;
      setTitle(coreValue.title);
      setDescription(coreValue.description);
      setStatus(coreValue.status);

      if (coreValue.photo && coreValue.photo.length > 0) {
        setInitialPhoto(coreValue.photo[0]);
        setInitialPhotoAlt(coreValue.alt && coreValue.alt[0] ? coreValue.alt[0] : "");
        setInitialImgtitle(coreValue.imgtitle && coreValue.imgtitle[0] ? coreValue.imgtitle[0] : "");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch core value");
    }
  };

  useEffect(() => {
    fetchCoreValue();
  }, []);

  const handlePhotoChange = (e) => {
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
      handleDeletePhoto();
    }

    setPhoto(file);
    setPhotoAlt("");
    setImgtitle("");
    e.target.value = '';
  };

  const handleDeletePhoto = () => {
    if (initialPhoto) {
      axios.delete(`/api/corevalue/${id}/image/${initialPhoto}/0`, { withCredentials: true })
        .then(() => {
          setInitialPhoto(null);
          setInitialPhotoAlt("");
          setInitialImgtitle("");
        })
        .catch(error => {
          console.error(error);
          toast.error("Failed to delete image");
        });
    }
    setPhoto(null);
    setPhotoAlt("");
    setImgtitle("");
    clearFieldError('alt');
    clearFieldError('imgtitle');
    toast.success("Image removed successfully");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    if (!photo && !initialPhoto) {
      toast.error("Exactly one image is required");
      return;
    }

    setIsSubmitting(true);

    try {
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

      await axios.put(`/api/corevalue/updateCorevalue?id=${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      toast.success("Core Value updated successfully!");
      navigate('/corevalue');
    } catch (error) {
      console.error(error);
      toast.error("Failed to update core value");
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
    <form onSubmit={handleSubmit} className="p-4">
      <ToastContainer />
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center mb-6">Edit Core Value</h1>
      
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
            errors.title ? 'border-red-500' : ''
          }`}
        />
        {getCharacterCountDisplay(title, 'title')}
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
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
          className={`quill ${errors.description ? 'border-red-500' : ''}`}
        />
        {getCharacterCountDisplay(description, 'description')}
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="photo" className="block font-semibold">
          Photo (Max 1 image, 5MB) <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 mb-2">
        The image size should be 317 × 310 pixels, and the appearance should be circular.
        </p>
        <input
          type="file"
          name="photo"
          id="photo"
          onChange={handlePhotoChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          accept="image/*"
        />
        
        {(photo || initialPhoto) && (
          <div className="mt-4">
            <h4 className="font-semibold text-gray-700 mb-2">Selected Image:</h4>
            <div className="relative w-56 border rounded-lg p-2">
              <button
                type="button"
                className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none z-10"
                onClick={handleDeletePhoto}
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
                    errors.alt ? 'border-red-500' : ''
                  }`}
                  placeholder="Describe this image..."
                />
                {getCharacterCountDisplay(photo ? photoAlt : initialPhotoAlt, 'alt')}
                {errors.alt && (
                  <p className="text-red-500 text-xs mt-1">{errors.alt}</p>
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
                    errors.imgtitle ? 'border-red-500' : ''
                  }`}
                  placeholder="Image title..."
                />
                {getCharacterCountDisplay(photo ? imgtitle : initialImgtitle, 'imgtitle')}
                {errors.imgtitle && (
                  <p className="text-red-500 text-xs mt-1">{errors.imgtitle}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="status" className="block font-semibold mb-2">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <button 
        type="submit"
        disabled={isSubmitting}
        className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Updating Core Value...' : 'Update Core Value'}
      </button>
    </form>
  );
};

export default EditCoreValue;