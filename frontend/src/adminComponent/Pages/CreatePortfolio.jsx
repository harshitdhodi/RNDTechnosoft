import React, { useState, useEffect } from "react";
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewPortfolioForm = () => {
  const [title, setTitle] = useState("");
<<<<<<< HEAD
  const [link, setLink] = useState("");
  const [details, setDetails] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoAlt, setPhotoAlt] = useState("");
  const [imgtitle, setImgtitle] = useState("");
=======
  const [link,setLink]=useState("")
  const [details, setDetails] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [imgtitle, setImgtitle] = useState([]);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("active");
  const [categories, setCategories] = useState([]);
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subSubCategoryId, setSubSubCategoryId] = useState("");
<<<<<<< HEAD

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

=======
  // // State for categories, parent, sub, and sub-sub categories with updated naming convention
  const [servicecategories, setServiceCategories] = useState([]);
  const [serviceparentCategoryId, setServiceParentCategoryId] = useState("");
  const [servicesubCategoryId, setServiceSubCategoryId] = useState("");
  const [servicesubSubCategoryId, setServiceSubSubCategoryId] = useState("");

 
  const [industriescategories, setIndustriesCategories] = useState([]);
  const [industriesparentCategoryId, setIndustriesParentCategoryId] = useState("");
  const [industriessubCategoryId, setIndustriesSubCategoryId] = useState("");
  const [industriessubSubCategoryId, setIndustriesSubSubCategoryId] = useState("");
  const navigate = useNavigate();

>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/portfolio/getall', { withCredentials: true });
      setCategories(response.data);
    } catch (error) {
      console.error(error);
<<<<<<< HEAD
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
=======
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      toast.error("You can only upload up to 5 photos");
      return;
    }
    setPhotos([...photos, ...files]);
    const newPhotoAlts = Array.from({ length: files.length }, () => "");
    setPhotoAlts([...photoAlts, ...newPhotoAlts]);
    const newImgtitle = Array.from({ length: files.length }, () => "");
    setImgtitle([...imgtitle, ...newImgtitle]);
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

    setIsSubmitting(true);

=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('link', link);
      formData.append('details', details);
<<<<<<< HEAD
      
      if (photo) {
        formData.append('photo', photo);
        formData.append('alt', photoAlt);
        formData.append('imgtitle', imgtitle);
      }

=======


      photos.forEach((photo, index) => {
        formData.append(`photo`, photo);
        formData.append(`alt`, photoAlts[index]);
        formData.append(`imgtitle`, imgtitle[index]);

      });
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      formData.append('slug', slug);
      formData.append('status', status);
      formData.append('categories', parentCategoryId);
      formData.append('subcategories', subCategoryId);
      formData.append('subSubcategories', subSubCategoryId);
<<<<<<< HEAD

=======
      formData.append('servicecategories', serviceparentCategoryId);
      formData.append('servicesubcategories', servicesubCategoryId);
      formData.append('servicesubSubcategories', servicesubSubCategoryId);
      formData.append('industrycategories', industriesparentCategoryId);
      formData.append('industrysubcategories', industriessubCategoryId);
      formData.append('industrysubSubcategories', industriessubSubCategoryId);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      const response = await axios.post('/api/Portfolio/insertPortfolio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

<<<<<<< HEAD
      toast.success("Portfolio added successfully!");

      setTitle("");
      setLink("");
      setDetails("");
      setPhoto(null);
=======


      // Reset form state
      setTitle("");
      setLink("");
      setDetails("");
      setPhotos([])
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      setStatus("active");
      setParentCategoryId("");
      setSubCategoryId("");
      setSubSubCategoryId("");
<<<<<<< HEAD
      setPhotoAlt("");
      setImgtitle("");
      setErrors({});

      navigate('/Portfolio');
    } catch (error) {
      console.error(error);
      toast.error("Failed to add portfolio");
    } finally {
      setIsSubmitting(false);
=======
      setPhotoAlts([]);
      setImgtitle([]);

      // Navigate to Portfolio page after successful submission
      navigate('/Portfolio');
    } catch (error) {
      console.error(error);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
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
<<<<<<< HEAD
    clearFieldError('parentCategory');
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
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

<<<<<<< HEAD
=======

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
=======
  useEffect(() => {
    fetchServiceCategories();
  }, []);

  // Fetch all service categories
  const fetchServiceCategories = async () => {
    try {
      const response = await axios.get('/api/services/getall', { withCredentials: true });
      setServiceCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Render options for the parent, sub, and sub-sub categories
  const renderServiceCategoryOptions = (category) => (
    <option key={category._id} value={category.slug}>
      {category.category}
    </option>
  );

  // Handle changes for parent category
  const handleServiceParentCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setServiceParentCategoryId(selectedCategoryId);
    setServiceSubCategoryId(""); // Reset subcategory selection
    setServiceSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  // // Handle changes for subcategory
  const handleServiceSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setServiceSubCategoryId(selectedSubCategoryId);
    setServiceSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  // // Handle changes for sub-subcategory
  const handleServiceSubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setServiceSubSubCategoryId(selectedSubSubCategoryId);
  };

  // // Find category by ID recursively
  const findServiceCategoryById = (categories, id) => {
    for (const category of categories) {
      if (category.slug === id) return category;
      if (category.subCategories) {
        const subCategory = findServiceCategoryById(category.subCategories, id);
        if (subCategory) return subCategory;
      }
    }
    return null;
  };

  // // Find subcategories based on selected parent category
  const findServiceSubCategories = (categories, serviceparentCategoryId) => {
    const parentCategory = findServiceCategoryById(categories, serviceparentCategoryId);
    return parentCategory ? parentCategory.subCategories || [] : [];
  };

  // // Find sub-subcategories based on selected subcategory
  const findServiceSubSubCategories = (categories, serviceparentCategoryId, servicesubCategoryId) => {
    const parentCategory = findServiceCategoryById(categories, serviceparentCategoryId);
    if (parentCategory && parentCategory.subCategories) {
      const subCategory = findServiceCategoryById(parentCategory.subCategories, servicesubCategoryId);
      return subCategory ? subCategory.subSubCategory || [] : [];
    }
    return [];
  };

  // // Get subcategories and sub-subcategories based on the selected parent and subcategory
  const subServiceCategories = serviceparentCategoryId ? findServiceSubCategories(servicecategories, serviceparentCategoryId) : [];
  const subSubServiceCategories = (serviceparentCategoryId && servicesubCategoryId) ? findServiceSubSubCategories(servicecategories, serviceparentCategoryId, servicesubCategoryId) : [];



  useEffect(() => {
      fetchIndustriesCategories();
    }, []);

  // Fetch all Industries categories
  const fetchIndustriesCategories = async () => {
    try {
        const response = await axios.get('/api/industries/getall', { withCredentials: true });
        setIndustriesCategories(response.data);
    } catch (error) {
        console.error(error);
    }
  };

  // Render options for the parent, sub, and sub-sub categories
  const renderIndustriesCategoryOptions = (category) => (
    <option key={category._id} value={category.slug}>
        {category.category}
    </option>
  );

  // Handle changes for parent category
  const handleIndustriesParentCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setIndustriesParentCategoryId(selectedCategoryId);
    setIndustriesSubCategoryId(""); // Reset subcategory selection
    setIndustriesSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  // Handle changes for subcategory
  const handleIndustriesSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setIndustriesSubCategoryId(selectedSubCategoryId);
    setIndustriesSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  // Handle changes for sub-subcategory
  const handleIndustriesSubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setIndustriesSubSubCategoryId(selectedSubSubCategoryId);
  };

  // Find category by ID recursively
  const findIndustriesCategoryById = (categories, id) => {
    for (const category of categories) {
        if (category.slug === id) return category;
        if (category.subCategories) {
            const subCategory = findIndustriesCategoryById(category.subCategories, id);
            if (subCategory) return subCategory;
        }
    }
    return null;
  };

  // Find subcategories based on selected parent category
  const findIndustriesSubCategories = (categories, IndustriesparentCategoryId) => {
    const parentCategory = findIndustriesCategoryById(categories, IndustriesparentCategoryId);
    return parentCategory ? parentCategory.subCategories || [] : [];
  };

  // Find sub-subcategories based on selected subcategory
  const findIndustriesSubSubCategories = (categories, IndustriesparentCategoryId, IndustriessubCategoryId) => {
    const parentCategory = findIndustriesCategoryById(categories, IndustriesparentCategoryId);
    if (parentCategory && parentCategory.subCategories) {
        const subCategory = findIndustriesCategoryById(parentCategory.subCategories, IndustriessubCategoryId);
        return subCategory ? subCategory.subSubCategories || [] : [];
    }
    return [];
  };

  // Get subcategories and sub-subcategories based on the selected parent and subcategory
  const subIndustriesCategories = industriesparentCategoryId ? findIndustriesSubCategories(industriescategories, industriesparentCategoryId) : [];
  const subSubIndustriesCategories = (industriesparentCategoryId && industriessubCategoryId) ? findIndustriesSubSubCategories(industriescategories, industriesparentCategoryId, industriessubCategoryId) : [];
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

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

<<<<<<< HEAD
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
=======
  return (
    <form onSubmit={handleSubmit} className="p-4">
      <ToastContainer />
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Add Portfolio</h1>
      <div className="mb-4">
        <label htmlFor="parentCategory" className="block font-semibold mb-2">
          Parent Category
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        </label>
        <select
          id="parentCategory"
          value={parentCategoryId}
          onChange={handleParentCategoryChange}
<<<<<<< HEAD
          className={`w-full p-2 border rounded focus:outline-none focus:border-blue-500 ${
            errors.parentCategory ? 'border-red-500' : ''
          }`}
=======
          className="w-full p-2 border rounded focus:outline-none"
          required
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        >
          <option value="">Select Parent Category</option>
          {categories.map(renderCategoryOptions)}
        </select>
<<<<<<< HEAD
        {errors.parentCategory && (
          <p className="text-red-500 text-sm mt-1">{errors.parentCategory}</p>
        )}
      </div>

=======
      </div>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      {subCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="subCategory" className="block font-semibold mb-2">
            Subcategory (optional)
          </label>
          <select
            id="subCategory"
            value={subCategoryId}
            onChange={handleSubCategoryChange}
<<<<<<< HEAD
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
=======
            className="w-full p-2 border rounded focus:outline-none"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
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
<<<<<<< HEAD

=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      {subSubCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="subSubCategory" className="block font-semibold mb-2">
            Sub-Subcategory (optional)
          </label>
          <select
            id="subSubCategory"
            value={subSubCategoryId}
            onChange={handleSubSubCategoryChange}
<<<<<<< HEAD
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Sub-Subcategory</option>
=======
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option >Select Sub-Subcategory</option>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
            {subSubCategories.map((subSubCategory) => (
              <option key={subSubCategory._id} value={subSubCategory.slug}>
                {subSubCategory.category}
              </option>
            ))}
          </select>
        </div>
      )}
<<<<<<< HEAD

      <div className="mb-4">
        <label htmlFor="title" className="block font-semibold mb-2">
          Title <span className="text-red-500">*</span>
=======
      <div className="mb-4">
        <label htmlFor="parentCategory" className="block font-semibold mb-2">
          Parent Service Category
        </label>
        <select
          id="parentCategory"
          value={serviceparentCategoryId}
          onChange={handleServiceParentCategoryChange}
          className="w-full p-2 border rounded focus:outline-none"
          required
        >
          <option value="">Select Parent Category</option>
          {servicecategories.map(renderServiceCategoryOptions)}
        </select>
      </div>

      {/* Subcategory */}
      {subServiceCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="subCategory" className="block font-semibold mb-2">
            Sub-Service Category (optional)
          </label>
          <select
            id="subCategory"
            value={servicesubCategoryId}
            onChange={handleServiceSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Subcategory</option>
            {subServiceCategories.map(renderServiceCategoryOptions)}
          </select>
        </div>
      )}

      {/* Sub-Subcategory */}
      {subSubServiceCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="subSubCategory" className="block font-semibold mb-2">
            Sub-Sub-Service Category (optional)
          </label>
          <select
            id="subSubCategory"
            value={servicesubSubCategoryId}
            onChange={handleServiceSubSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Sub-Subcategory</option>
            {subSubServiceCategories.map(renderServiceCategoryOptions)}
          </select>
        </div>
      )}



      <div className="mb-4">
                <label htmlFor="parentCategory" className="block font-semibold mb-2">
                    Parent industries Category
                </label>
                <select
                    id="parentCategory"
                    value={industriesparentCategoryId}
                    onChange={handleIndustriesParentCategoryChange}
                    className="w-full p-2 border rounded focus:outline-none"
                    required
                >
                    <option value="">Select Parent Category</option>
                    {industriescategories.map(renderIndustriesCategoryOptions)}
                </select>
            </div> 

      {/* Subcategory */}
      {subIndustriesCategories.length > 0 && (
                <div className="mb-4">
                    <label htmlFor="subCategory" className="block font-semibold mb-2">
                        Sub-industries Category (optional)
                    </label>
                    <select
                        id="subCategory"
                        value={industriessubCategoryId}
                        onChange={handleIndustriesSubCategoryChange}
                        className="w-full p-2 border rounded focus:outline-none"
                    >
                        <option value="">Select Subcategory</option>
                        {subIndustriesCategories.map(renderIndustriesCategoryOptions)}
                    </select>
                </div>
            )}

      {/* Sub-Subcategory */}
       {subSubIndustriesCategories.length > 0 && (
                <div className="mb-4">
                    <label htmlFor="subSubCategory" className="block font-semibold mb-2">
                        Sub-Sub-industries Category (optional)
                    </label>
                    <select
                        id="subSubCategory"
                        value={industriessubSubCategoryId}
                        onChange={handleIndustriesSubSubCategoryChange}
                        className="w-full p-2 border rounded focus:outline-none"
                    >
                        <option value="">Select Sub-Subcategory</option>
                        {subSubIndustriesCategories.map(renderIndustriesCategoryOptions)}
                    </select>
                </div>
            )}

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

=======
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      <div className="mb-4">
        <label htmlFor="link" className="block font-semibold mb-2">
          Website Link
        </label>
        <input
<<<<<<< HEAD
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
=======
          type="text"
          id="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        />
      </div>
      <div className="mb-8">
        <label htmlFor="details" className="block font-semibold mb-2">
          Description
        </label>
        <ReactQuill
          value={details}
          onChange={setDetails}
          modules={modules} // Include modules for image handling
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
                  className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
                  onClick={() => handleDeleteImage(index)}
                >
                  X
                </button>
                <img
                  src={URL.createObjectURL(photo)}
                  alt=""
                  className=" h-32 w-56 object-cover"
                />
                <label>Alternative Text :
                  <input
                    type="text"
                    value={photoAlts[index]}
                    onChange={(e) => {
                      const newPhotoAlts = [...photoAlts];
                      newPhotoAlts[index] = e.target.value;
                      setPhotoAlts(newPhotoAlts);
                    }}
                    className="w-full p-2 mt-2 border rounded focus:outline-none"
                  />
                </label>
                <label>Image Title Text :
                  <input
                    type="text"
                    value={imgtitle[index]}
                    onChange={(e) => {
                      const newImgtitle = [...imgtitle];
                      newImgtitle[index] = e.target.value;
                      setImgtitle(newImgtitle);
                    }}
                    className="w-full p-2 mt-2 border rounded focus:outline-none"
                  />
                </label>
              </div>

            ))}
          </div>
        )}
      </div>
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
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
=======
          className="w-full p-2 border rounded focus:outline-none"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
<<<<<<< HEAD

      <button 
        type="submit" 
        disabled={isSubmitting}
        className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Adding Portfolio...' : 'Add Portfolio'}
=======
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Add Portfolio
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      </button>
    </form>
  );
};

<<<<<<< HEAD
export default NewPortfolioForm;
=======
export default NewPortfolioForm;
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
