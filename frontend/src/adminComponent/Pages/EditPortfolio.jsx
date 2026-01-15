import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditPortfolio = () => {
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
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [initialPhotoAlt, setInitialPhotoAlt] = useState("");
  const [initialImgtitle, setInitialImgtitle] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { slugs } = useParams();
  const navigate = useNavigate();

  const validationRules = {
    title: { min: 3, max: 100, required: true },
    link: { min: 0, max: 200, required: false },
    details: { min: 10, max: 5000, required: true },
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

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/Portfolio/getAll', { withCredentials: true });
      setCategories(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories");
    }
  };

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`/api/Portfolio/getPortfolioById?slugs=${slugs}`, { withCredentials: true });
      const portfolio = response.data.data;
      setTitle(portfolio.title);
      setDetails(portfolio.details);
      setLink(portfolio.link);
      setStatus(portfolio.status);
      setSlug(portfolio.slug);

      if (portfolio.photo && portfolio.photo.length > 0) {
        setInitialPhoto(portfolio.photo[0]);
        setInitialPhotoAlt(portfolio.alt && portfolio.alt[0] ? portfolio.alt[0] : "");
        setInitialImgtitle(portfolio.imgtitle && portfolio.imgtitle[0] ? portfolio.imgtitle[0] : "");
      }

      try {
        const categoryResponse = await axios.get(`/api/portfolio/getSpecificCategory?categoryId=${portfolio.categories}`, { withCredentials: true });
        setParentCategoryId(categoryResponse.data.slug);
      } catch (error) {
        console.error('Error fetching parent category:', error);
      }

      try {
        const subCategoryResponse = await axios.get(`/api/portfolio/getSpecificSubcategory?categoryId=${portfolio.categories}&subCategoryId=${portfolio.subcategories}`, { withCredentials: true });
        setSubCategoryId(subCategoryResponse.data.slug);
      } catch (error) {
        console.error('Error fetching subcategory:', error);
      }

      try {
        const subSubCategoryResponse = await axios.get(`/api/portfolio/getSpecificSubSubcategory?categoryId=${portfolio.categories}&subCategoryId=${portfolio.subcategories}&subSubCategoryId=${portfolio.subSubcategories}`, { withCredentials: true });
        setSubSubCategoryId(subSubCategoryResponse.data.slug);
      } catch (error) {
        console.error('Error fetching sub-subcategory:', error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch portfolio");
    }
  };

  useEffect(() => {
    fetchPortfolio();
    fetchCategories();
  }, [slugs]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      toast.error(`${file.name}: ${error}`);
      e.target.value = '';
      return;
    }

    // if (photo || initialPhoto) {
    //   const shouldReplace = window.confirm("An image already exists. Do you want to replace it with the new image?");
    //   if (!shouldReplace) {
    //     e.target.value = '';
    //     return;
    //   }
    //   handleDeletePhoto();
    // }

    setPhoto(file);
    setPhotoAlt("");
    setImgtitle("");
    e.target.value = '';
  };

  const handleDeletePhoto = () => {
    if (initialPhoto) {
      axios.delete(`/api/Portfolio/${slugs}/image/${initialPhoto}/0`, { withCredentials: true })
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

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('link', link);
      formData.append('details', details);
      formData.append('slug', slug);
      formData.append('status', status);
      formData.append('categories', parentCategoryId);
      formData.append('subcategories', subCategoryId);
      formData.append('subSubcategories', subSubCategoryId);

      if (photo) {
        formData.append('photo', photo);
        formData.append('alt', photoAlt);
        formData.append('imgtitle', imgtitle);
      } else if (initialPhoto) {
        formData.append('alt', initialPhotoAlt);
        formData.append('imgtitle', initialImgtitle);
      }

      await axios.put(`/api/portfolio/updatePortfolio?slugs=${slugs}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      toast.success("Portfolio updated successfully!");
      navigate('/portfolio');
    } catch (error) {
      console.error(error);
      toast.error("Failed to update portfolio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategoryOptions = (category) => (
    <option key={category._id} value={category.slug}>
      {category.category}
    </option>
  );

  const renderSubCategoryOptions = (subCategory) => (
    <option key={subCategory._id} value={subCategory.slug}>
      {subCategory.category}
    </option>
  );

  const renderSubSubCategoryOptions = (subSubCategory) => (
    <option key={subSubCategory._id} value={subSubCategory.slug}>
      {subSubCategory.category}
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

  const getSubCategories = (categoryId) => {
    const category = categories.find(category => category.slug === categoryId);
    return category?.subCategories || [];
  };

  const getSubSubCategories = (categoryId, subCategoryId) => {
    const category = categories.find(category => category.slug === categoryId);
    const subCategory = category?.subCategories.find(sub => sub.slug === subCategoryId);
    return subCategory?.subSubCategories || [];
  };

  useEffect(() => {
    setSlug(title.replace(/\s+/g, '-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
    );
  }, [title]);

  useEffect(() => {
    setSlug(slug.toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
    );
  }, [slug]);

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
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center mb-6">Edit Portfolio</h1>
      
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

      {getSubCategories(parentCategoryId).length > 0 && (
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
            {getSubCategories(parentCategoryId).map(renderSubCategoryOptions)}
          </select>
        </div>
      )}

      {getSubSubCategories(parentCategoryId, subCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="subSubCategory" className="block font-semibold mb-2">
            Sub-Subcategory (optional)
          </label>
          <select
            id="subSubCategory"
            value={subSubCategoryId}
            onChange={(e) => setSubSubCategoryId(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Sub-Subcategory</option>
            {getSubSubCategories(parentCategoryId, subCategoryId).map(renderSubSubCategoryOptions)}
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
        {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default EditPortfolio;