<<<<<<< HEAD
import React, { useState } from "react";
=======
import React, { useState, useEffect } from "react";
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewCoreValueForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
<<<<<<< HEAD
  const [photo, setPhoto] = useState(null);
  const [photoAlt, setPhotoAlt] = useState("");
  const [imgtitle, setImgtitle] = useState("");
  const [status, setStatus] = useState("active");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    if (photo) {
      const altError = validateField('alt', photoAlt);
      const titleError = validateField('imgtitle', imgtitle);
      
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      toast.error(`${file.name}: ${error}`);
      e.target.value = '';
      return;
    }

    if (photo) {
      const shouldReplace = window.confirm("An image already exists. Do you want to replace it with the new image?");
      if (!shouldReplace) {
        e.target.value = '';
        return;
      }
      handleDeleteImage();
    }

    setPhoto(file);
    setPhotoAlt("");
    setImgtitle("");
    e.target.value = '';
  };

  const handleDeleteImage = () => {
    setPhoto(null);
    setPhotoAlt("");
    setImgtitle("");
    clearFieldError('alt');
    clearFieldError('imgtitle');
    toast.success("Image removed successfully");
=======
  const [photos, setPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [imgtitle, setImgtitle] = useState([]);
  const [status, setStatus] = useState("active");
  const navigate = useNavigate();

 
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      toast.error("You can only upload up to 5 photos");
      return;
    }
    setPhotos([...photos, ...files]);
    const newPhotoAlts = Array.from({ length: files.length }, () => "");
    setPhotoAlts([...photoAlts, ...newPhotoAlts]);
    const newImgtitles = Array.from({ length: files.length }, () => "");
    setImgtitle([...imgtitle, ...newImgtitles]);
  };

  const handleDeleteImage = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    setPhotoAlts((prevPhotoAlts) => prevPhotoAlts.filter((_, i) => i !== index));
    setImgtitle((prevImgtitle) => prevImgtitle.filter((_, i) => i !== index));

>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    if (!photo) {
      toast.error("Exactly one image is required");
      return;
    }

    setIsSubmitting(true);

=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
<<<<<<< HEAD
      formData.append('photo', photo);
      formData.append('alt', photoAlt);
      formData.append('imgtitle', imgtitle);
      formData.append('status', status);

      await axios.post('/api/corevalue/createCoreValue', formData, {
=======
      photos.forEach((photo, index) => {
        formData.append(`photo`, photo);
        formData.append(`alt`, photoAlts[index]);
        formData.append(`imgtitle`, imgtitle[index]);
      });
      formData.append('status', status);

      const response = await axios.post('/api/corevalue/createCoreValue', formData, {
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

<<<<<<< HEAD
      toast.success("Core Value added successfully!");
      setTitle("");
      setDescription("");
      setPhoto(null);
      setPhotoAlt("");
      setImgtitle("");
      setStatus("active");
      setErrors({});
      navigate('/CoreValue');
    } catch (error) {
      console.error(error);
      toast.error("Failed to add core value");
    } finally {
      setIsSubmitting(false);
    }
  };

=======
      // Reset form state
      setTitle("");
      setDescription("");
      setPhotos([]);
      setStatus("active");
      setPhotoAlts([]);
      setImgtitle([]);
      navigate('/CoreValue');
    } catch (error) {
      console.error(error);
    }
  };
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
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
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center mb-6">Add Core Value</h1>
      
      <div className="mb-4">
        <label htmlFor="title" className="block font-semibold mb-2">
          Title <span className="text-red-500">*</span>
=======
  return (
    <form onSubmit={handleSubmit} className="p-4">
      <ToastContainer/>
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Add Core Value</h1>
      <div className="mb-4">
        <label htmlFor="title" className="block font-semibold mb-2">
          Title
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        </label>
        <input
          type="text"
          id="title"
          value={title}
<<<<<<< HEAD
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
        <label htmlFor="photo" className="block font-semibold mb-2">
          Photo (Max 1 image, 5MB) <span className="text-red-500">*</span>
=======
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
          modules={modules} 
          className="quill"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="photo" className="block font-semibold mb-2">
          Photos
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        </label>
        <input
          type="file"
          name="photo"
          id="photo"
<<<<<<< HEAD
          onChange={handlePhotoChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          accept="image/*"
        />
        <p className="text-sm text-gray-500 mt-1">
          Accepted formats: JPG, PNG, GIF, WEBP. Maximum 1 image, 5MB.
        </p>
        
        {photo && (
          <div className="mt-4">
            <h4 className="font-semibold text-gray-700 mb-2">Selected Image:</h4>
            <div className="relative w-56 border rounded-lg p-2">
              <button
                type="button"
                className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-600 focus:outline-none z-10"
                onClick={handleDeleteImage}
                title="Remove image"
              >
                <span className="text-xs font-bold">×</span>
              </button>
              <img
                src={URL.createObjectURL(photo)}
                alt=""
                className="h-32 w-52 object-cover rounded"
              />
              
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">
                  Alt Text <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={photoAlt}
                  onChange={(e) => {
                    setPhotoAlt(e.target.value);
                    clearFieldError('alt');
                  }}
                  className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${
                    errors.alt ? 'border-red-500' : ''
                  }`}
                  placeholder="Describe this image..."
                />
                {getCharacterCountDisplay(photoAlt, 'alt')}
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
                  value={imgtitle}
                  onChange={(e) => {
                    setImgtitle(e.target.value);
                    clearFieldError('imgtitle');
                  }}
                  className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${
                    errors.imgtitle ? 'border-red-500' : ''
                  }`}
                  placeholder="Image title..."
                />
                {getCharacterCountDisplay(imgtitle, 'imgtitle')}
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
        {isSubmitting ? 'Adding Core Value...' : 'Add Core Value'}
      </button>
=======
          multiple
          onChange={handlePhotoChange}
          className="border rounded focus:outline-none"
          accept="image/*"
        />
        {photos.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative w-56">
                <button
                  type="button"
                  className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex justify-center items-center"
                  onClick={() => handleDeleteImage(index)}
                >
                  X
                </button>
                <img
                  src={URL.createObjectURL(photo)}
                  alt={photoAlts[index]}
                  className="w-56 h-32 object-cover"
                />
                <label>Alternative Text :
                <input
                  type="text"
                  placeholder="Enter Alt Text"
                  value={photoAlts[index]}
                  onChange={(e) => {
                    const newPhotoAlts = [...photoAlts];
                    newPhotoAlts[index] = e.target.value;
                    setPhotoAlts(newPhotoAlts);
                  }}
                  className="block w-full mt-1 p-1 border rounded focus:outline-none"
                />
                </label>
                <label>Title Text :
                <input
                  type="text"
                  placeholder="Enter Title Text"
                  value={imgtitle[index]}
                  onChange={(e) => {
                    const newImgtitles = [...imgtitle];
                    newImgtitles[index] = e.target.value;
                    setImgtitle(newImgtitles);
                  }}
                  className="block w-full mt-1 p-1 border rounded focus:outline-none"
                />
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-8">
        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
          Submit
        </button>
      </div>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    </form>
  );
};

<<<<<<< HEAD
export default NewCoreValueForm;
=======
export default NewCoreValueForm;
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
