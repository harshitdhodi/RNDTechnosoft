import React, { useState, useEffect } from "react";
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewPortfolioForm = () => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [details, setDetails] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoAlt, setPhotoAlt] = useState("");
  const [imgtitle, setImgtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("active");
  const [categories, setCategories] = useState([]);
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subSubCategoryId, setSubSubCategoryId] = useState("");

  // Validation states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Validation rules
  const validationRules = {
    title: { min: 3, max: 100, required: true },
    link: { min: 0, max: 200, required: false },
    details: { min: 10, max: 5000, required: true },
    alt: { min: 3, max: 100, required: true },
    imgtitle: { min: 3, max: 100, required: true }
  };

  // Strip HTML tags for length validation
  const stripHtmlTags = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Validation functions
  const validateField = (fieldName, value, customRules = null) => {
    const rules = customRules || validationRules[fieldName];
    if (!rules) return '';

    const textValue = fieldName === 'details' ? stripHtmlTags(value) : value;
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
    newErrors.link = validateField('link', link);
    newErrors.details = validateField('details', details);

    if (!parentCategoryId) {
      newErrors.parentCategory = 'Parent category is required';
    }

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/portfolio/getall', { withCredentials: true });
      setCategories(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories");
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('link', link);
      formData.append('details', details);
      
      if (photo) {
        formData.append('photo', photo);
        formData.append('alt', photoAlt);
        formData.append('imgtitle', imgtitle);
      }

      formData.append('slug', slug);
      formData.append('status', status);
      formData.append('categories', parentCategoryId);
      formData.append('subcategories', subCategoryId);
      formData.append('subSubcategories', subSubCategoryId);

      const response = await axios.post('/api/Portfolio/insertPortfolio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      toast.success("Portfolio added successfully!");

      setTitle("");
      setLink("");
      setDetails("");
      setPhoto(null);
      setStatus("active");
      setParentCategoryId("");
      setSubCategoryId("");
      setSubSubCategoryId("");
      setPhotoAlt("");
      setImgtitle("");
      setErrors({});

      navigate('/Portfolio');
    } catch (error) {
      console.error(error);
      toast.error("Failed to add portfolio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategoryOptions = (category) => (
    <option key={category._id} value={category.slug}>
      {category.category}
    </option>
  );

  const handleParentCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setParentCategoryId(selectedCategoryId);
    setSubCategoryId("");
    setSubSubCategoryId("");
    clearFieldError('parentCategory');
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setSubCategoryId(selectedSubCategoryId);
    setSubSubCategoryId("");
  };

  const handleSubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setSubSubCategoryId(selectedSubSubCategoryId);
  };

  const findCategoryById = (categories, id) => {
    for (const category of categories) {
      if (category.slug === id) return category;
      if (category.subCategories) {
        const subCategory = findCategoryById(category.subCategories, id);
        if (subCategory) return subCategory;
      }
    }
    return null;
  };

  const findSubCategories = (categories, parentCategoryId) => {
    const parentCategory = findCategoryById(categories, parentCategoryId);
    return parentCategory ? parentCategory.subCategories || [] : [];
  };

  const findSubSubCategories = (categories, parentCategoryId, subCategoryId) => {
    const parentCategory = findCategoryById(categories, parentCategoryId);
    if (parentCategory && parentCategory.subCategories) {
      const subCategory = findCategoryById(parentCategory.subCategories, subCategoryId);
      return subCategory ? subCategory.subSubCategory || [] : [];
    }
    return [];
  };

  const subCategories = parentCategoryId ? findSubCategories(categories, parentCategoryId) : [];
  const subSubCategories = (parentCategoryId && subCategoryId) ? findSubSubCategories(categories, parentCategoryId, subCategoryId) : [];

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

  useEffect(() => {
    setSlug(title.replace(/\s+/g, '-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
    );
  }, [title])

  useEffect(() => {
    setSlug(slug.toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
    );
  }, [slug])

  const getCharacterCount = (value, fieldName) => {
    const textValue = fieldName === 'details' ? stripHtmlTags(value) : value;
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
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center mb-6">Add Portfolio</h1>
      
      <div className="mb-4">
        <label htmlFor="parentCategory" className="block font-semibold mb-2">
          Parent Category <span className="text-red-500">*</span>
        </label>
        <select
          id="parentCategory"
          value={parentCategoryId}
          onChange={handleParentCategoryChange}
          className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${
            errors.parentCategory ? 'border-red-500' : ''
          }`}
        >
          <option value="">Select Parent Category</option>
          {categories.map(renderCategoryOptions)}
        </select>
        {errors.parentCategory && (
          <p className="text-red-500 text-sm mt-1">{errors.parentCategory}</p>
        )}
      </div>

      {subCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="subCategory" className="block font-semibold mb-2">
            Subcategory (optional)
          </label>
          <select
            id="subCategory"
            value={subCategoryId}
            onChange={handleSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Subcategory</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory._id} value={subCategory.slug}>
                {subCategory.category}
              </option>
            ))}
          </select>
        </div>
      )}

      {subSubCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="subSubCategory" className="block font-semibold mb-2">
            Sub-Subcategory (optional)
          </label>
          <select
            id="subSubCategory"
            value={subSubCategoryId}
            onChange={handleSubSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Sub-Subcategory</option>
            {subSubCategories.map((subSubCategory) => (
              <option key={subSubCategory._id} value={subSubCategory.slug}>
                {subSubCategory.category}
              </option>
            ))}
          </select>
        </div>
      )}

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

      <div className="mb-4">
        <label htmlFor="link" className="block font-semibold mb-2">
          Website Link
        </label>
        <input
          type="url"
          id="link"
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
            clearFieldError('link');
          }}
          className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${
            errors.link ? 'border-red-500' : ''
          }`}
          placeholder="https://example.com"
        />
        {getCharacterCountDisplay(link, 'link')}
        {errors.link && (
          <p className="text-red-500 text-sm mt-1">{errors.link}</p>
        )}
      </div>

      <div className="mb-8">
        <label htmlFor="details" className="block font-semibold mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <ReactQuill
          value={details}
          onChange={(value) => {
            setDetails(value);
            clearFieldError('details');
          }}
          modules={modules}
          className={`quill ${errors.details ? 'border-red-500' : ''}`}
        />
        {getCharacterCountDisplay(details, 'details')}
        {errors.details && (
          <p className="text-red-500 text-sm mt-1">{errors.details}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="photo" className="block font-semibold mb-2">
          Photo (Max 1 image, 5MB)
        </label>
        <input
          type="file"
          name="photo"
          id="photo"
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
                className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none z-10"
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
        {isSubmitting ? 'Adding Portfolio...' : 'Add Portfolio'}
      </button>
    </form>
  );
};

export default NewPortfolioForm;