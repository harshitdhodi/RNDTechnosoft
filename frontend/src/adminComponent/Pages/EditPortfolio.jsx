import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
<<<<<<< HEAD
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
=======

>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

const EditPortfolio = () => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [details, setDetails] = useState("");
<<<<<<< HEAD
  const [photo, setPhoto] = useState(null);
  const [photoAlt, setPhotoAlt] = useState("");
  const [imgtitle, setImgtitle] = useState("");
  const [slug, setSlug] = useState("");
=======
  const [photo, setPhoto] = useState([]);
  const [slug, setSlug] = useState("");

>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const [status, setStatus] = useState("active");
  const [categories, setCategories] = useState([]);
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subSubCategoryId, setSubSubCategoryId] = useState("");
<<<<<<< HEAD
=======
  // State for categories, parent, sub, and sub-sub categories with updated naming convention
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const [servicecategories, setServiceCategories] = useState([]);
  const [serviceparentCategoryId, setServiceParentCategoryId] = useState("");
  const [servicesubCategoryId, setServiceSubCategoryId] = useState("");
  const [servicesubSubCategoryId, setServiceSubSubCategoryId] = useState("");
<<<<<<< HEAD
=======

  // state for industries 
  // State for categories, parent, sub, and sub-sub categories with updated naming convention
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const [industriescategories, setIndustriesCategories] = useState([]);
  const [industriesparentCategoryId, setIndustriesParentCategoryId] = useState("");
  const [industriessubCategoryId, setIndustriesSubCategoryId] = useState("");
  const [industriessubSubCategoryId, setIndustriesSubSubCategoryId] = useState("");
<<<<<<< HEAD
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

=======
  const { slugs } = useParams();
  const [initialPhotos, setInitialPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [imgtitle, setImgtitle] = useState([]);
  const [initialphotoAlts, setInitialPhotoAlts] = useState([])
  const [initialimgtitle, setInitialImgtitle] = useState([])


  const navigate = useNavigate();

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
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const fetchServiceCategories = async () => {
    try {
      const response = await axios.get('/api/services/getAll', { withCredentials: true });
      setServiceCategories(response.data);
    } catch (error) {
      console.error(error);
<<<<<<< HEAD
      toast.error("Failed to fetch service categories");
    }
  };

=======
    }
  };
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const fetchIndustriesCategories = async () => {
    try {
      const response = await axios.get('/api/industries/getAll', { withCredentials: true });
      setIndustriesCategories(response.data);
    } catch (error) {
      console.error(error);
<<<<<<< HEAD
      toast.error("Failed to fetch industries categories");
    }
  };

=======
    }
  };
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/Portfolio/getAll', { withCredentials: true });
      setCategories(response.data);
    } catch (error) {
      console.error(error);
<<<<<<< HEAD
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

      try {
        const serviceCategoryResponse = await axios.get(`/api/services/getSpecificCategory?categoryId=${portfolio.servicecategories}`, { withCredentials: true });
        setServiceParentCategoryId(serviceCategoryResponse.data.slug);
      } catch (error) {
        console.error('Error fetching service parent category:', error);
      }

      try {
        const serviceSubCategoryResponse = await axios.get(`/api/services/getSpecificSubcategory?categoryId=${portfolio.servicecategories}&subCategoryId=${portfolio.servicesubcategories}`, { withCredentials: true });
        setServiceSubCategoryId(serviceSubCategoryResponse.data.slug);
      } catch (error) {
        console.error('Error fetching service subcategory:', error);
      }

      try {
        const serviceSubSubCategoryResponse = await axios.get(`/api/services/getSpecificSubSubcategory?categoryId=${portfolio.servicecategories}&subCategoryId=${portfolio.servicesubcategories}&subSubCategoryId=${portfolio.servicesubSubcategories}`, { withCredentials: true });
        setServiceSubSubCategoryId(serviceSubSubCategoryResponse.data.slug);
      } catch (error) {
        console.error('Error fetching service sub-subcategory:', error);
      }

      try {
        const industriesCategoryResponse = await axios.get(`/api/industries/getSpecificCategory?categoryId=${portfolio.industriescategories}`, { withCredentials: true });
        setIndustriesParentCategoryId(industriesCategoryResponse.data.slug);
      } catch (error) {
        console.error('Error fetching industries parent category:', error);
      }

      try {
        const industriesSubCategoryResponse = await axios.get(`/api/industries/getSpecificSubcategory?categoryId=${portfolio.industriescategories}&subCategoryId=${portfolio.industriessubcategories}`, { withCredentials: true });
        setIndustriesSubCategoryId(industriesSubCategoryResponse.data.slug);
      } catch (error) {
        console.error('Error fetching industries subcategory:', error);
      }

      try {
        const industriesSubSubCategoryResponse = await axios.get(`/api/industries/getSpecificSubSubcategory?categoryId=${portfolio.industriescategories}&subCategoryId=${portfolio.industriessubcategories}&subSubCategoryId=${portfolio.industriessubSubcategories}`, { withCredentials: true });
        setIndustriesSubSubCategoryId(industriesSubSubCategoryResponse.data.slug);
      } catch (error) {
        console.error('Error fetching industries sub-subcategory:', error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch portfolio");
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    }
  };

  useEffect(() => {
    fetchPortfolio();
    fetchCategories();
<<<<<<< HEAD
    fetchServiceCategories();
    fetchIndustriesCategories();
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
=======
    fetchServiceCategories()
    fetchIndustriesCategories()
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`/api/Portfolio/getPortfolioById?slugs=${slugs}`, { withCredentials: true });
      const Portfolio = response.data.data;
      setTitle(Portfolio.title);
      setDetails(Portfolio.details);
      setInitialPhotos(Portfolio.photo);
      setLink(Portfolio.link)
      setStatus(Portfolio.status);
      setInitialPhotoAlts(Portfolio.alt);
      setInitialImgtitle(Portfolio.imgtitle);


      setSlug(Portfolio.slug);


      // Fetch categories
      try {
        const categoryResponse = await axios.get(`/api/portfolio/getSpecificCategory?categoryId=${Portfolio.categories}`, { withCredentials: true });
        const category = categoryResponse.data;
        setParentCategoryId(category.slug);
      } catch (error) {
        console.error('Error fetching parent category:', error);
      }

      try {
        const subCategoryResponse = await axios.get(`/api/portfolio/getSpecificSubcategory?categoryId=${Portfolio.categories}&subCategoryId=${Portfolio.subcategories}`, { withCredentials: true });
        const subCategory = subCategoryResponse.data;
        setSubCategoryId(subCategory.slug);
      } catch (error) {
        console.error('Error fetching subcategory:', error);
      }

      try {
        const subSubCategoryResponse = await axios.get(`/api/portfolio/getSpecificSubSubcategory?categoryId=${Portfolio.categories}&subCategoryId=${Portfolio.subcategories}&subSubCategoryId=${Portfolio.subSubcategories}`, { withCredentials: true });
        const subSubCategory = subSubCategoryResponse.data
        setSubSubCategoryId(subSubCategory.slug);
      } catch (error) {
        console.error('Error fetching sub-subcategory:', error);
      }

      // // Fetch services
      try {
        const serviceCategoryResponse = await axios.get(`/api/services/getSpecificCategory?categoryId=${Portfolio.servicecategories}`, { withCredentials: true });
        const serviceCategory = serviceCategoryResponse.data;
        setServiceParentCategoryId(serviceCategory.slug);
      } catch (error) {
        console.error('Error fetching service parent category:', error);
      }

      try {
        const serviceSubCategoryResponse = await axios.get(`/api/services/getSpecificSubcategory?categoryId=${Portfolio.servicecategories}&subCategoryId=${Portfolio.servicesubcategories}`, { withCredentials: true });
        const serviceSubCategory = serviceSubCategoryResponse.data;
        setServiceSubCategoryId(serviceSubCategory.slug);
      } catch (error) {
        console.error('Error fetching service subcategory:', error);
      }

      try {
        const serviceSubSubCategoryResponse = await axios.get(`/api/services/getSpecificSubSubcategory?categoryId=${Portfolio.servicecategories}&subCategoryId=${Portfolio.servicesubcategories}&subSubCategoryId=${Portfolio.servicesubSubcategories}`, { withCredentials: true });
        const serviceSubSubCategory = serviceSubSubCategoryResponse.data;
        setServiceSubSubCategoryId(serviceSubSubCategory.slug);
      } catch (error) {
        console.error('Error fetching service sub-subcategory:', error);
      }


      // Fetch services
      try {
        const industriesCategoryResponse = await axios.get(`/api/industries/getSpecificCategory?categoryId=${Portfolio.industriescategories}`, { withCredentials: true });
        const industriesCategory = industriesCategoryResponse.data;
        setIndustriesParentCategoryId(industriesCategory.slug);
      } catch (error) {
        console.error('Error fetching industries parent category:', error);
      }

      try {
        const industriesSubCategoryResponse = await axios.get(`/api/industries/getSpecificSubcategory?categoryId=${Portfolio.servicecategories}&subCategoryId=${Portfolio.servicesubcategories}`, { withCredentials: true });
        const industriesSubCategory = industriesSubCategoryResponse.data;
        setIndustriesSubCategoryId(industriesSubCategory.slug);
      } catch (error) {
        console.error('Error fetching industries subcategory:', error);
      }

      try {
        const industriesSubSubCategoryResponse = await axios.get(`/api/industries/getSpecificSubSubcategory?categoryId=${Portfolio.servicecategories}&subCategoryId=${Portfolio.servicesubcategories}&subSubCategoryId=${Portfolio.servicesubSubcategories}`, { withCredentials: true });
        const industriesSubSubCategory = industriesSubSubCategoryResponse.data;
        setIndustriesSubSubCategoryId(industriesSubSubCategory.slug);
      } catch (error) {
        console.error('Error fetching service sub-subcategory:', error);
      }


    } catch (error) {
      console.error(error);
    }
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
      formData.append('slug', slug);
=======

      formData.append('slug', slug);

>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      formData.append('status', status);
      formData.append('categories', parentCategoryId);
      formData.append('subcategories', subCategoryId);
      formData.append('subSubcategories', subSubCategoryId);
      formData.append('servicecategories', serviceparentCategoryId);
      formData.append('servicesubcategories', servicesubCategoryId);
      formData.append('servicesubSubcategories', servicesubSubCategoryId);
      formData.append('industrycategories', industriesparentCategoryId);
      formData.append('industrysubcategories', industriessubCategoryId);
      formData.append('industrysubSubcategories', industriessubSubCategoryId);

<<<<<<< HEAD
      if (photo) {
        formData.append('photo', photo);
        formData.append('alt', photoAlt);
        formData.append('imgtitle', imgtitle);
      } else if (initialPhoto) {
        formData.append('alt', initialPhotoAlt);
        formData.append('imgtitle', initialImgtitle);
      }

      await axios.put(`/api/portfolio/updatePortfolio?slugs=${slugs}`, formData, {
=======
      // Combine initial and new photo alts into a single array
      const combinedAlts = [...initialphotoAlts, ...photoAlts];
      const combinedImgtitle = [...initialimgtitle, ...imgtitle];

      // Append photos and their respective alts to FormData
      photo.forEach((p) => {
        formData.append(`photo`, p);
      });

      combinedAlts.forEach((a) => {
        formData.append(`alt`, a);
      })
      combinedImgtitle.forEach((m) => {
        formData.append(`imgtitle`, m);
      })
      const response = await axios.put(`/api/portfolio/updatePortfolio?slugs=${slugs}`, formData, {
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

<<<<<<< HEAD
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

  const renderServiceCategoryOptions = (category) => (
    <option key={category._id} value={category.slug}>
      {category.category}
    </option>
  );

  const renderServiceSubCategoryOptions = (subCategory) => (
    <option key={subCategory._id} value={subCategory.slug}>
      {subCategory.category}
    </option>
  );

  const renderServiceSubSubCategoryOptions = (subSubCategory) => (
    <option key={subSubCategory._id} value={subSubCategory.slug}>
      {subSubCategory.category}
    </option>
  );

  const renderIndustriesCategoryOptions = (category) => (
    <option key={category._id} value={category.slug}>
      {category.category}
    </option>
  );

  const renderIndustriesSubCategoryOptions = (subCategory) => (
    <option key={subCategory._id} value={subCategory.slug}>
      {subCategory.category}
    </option>
  );

  const renderIndustriesSubSubCategoryOptions = (subSubCategory) => (
    <option key={subSubCategory._id} value={subSubCategory.slug}>
      {subSubCategory.category}
    </option>
  );
=======

      navigate('/portfolio');
    } catch (error) {
      console.error(error);
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


  const handleInitialImgtitleChange = (e, index) => {
    const newImgtitle = [...initialimgtitle];
    newImgtitle[index] = e.target.value;

    setInitialImgtitle(newImgtitle);
  };
  const handleNewAltTextChange = (e, index) => {
    const newPhotoAlts = [...photoAlts];
    newPhotoAlts[index] = e.target.value;

    setPhotoAlts(newPhotoAlts);
  };
  const handleNewImgtitleChange = (e, index) => {
    const newImgtitle = [...imgtitle];
    newImgtitle[index] = e.target.value;

    setImgtitle(newImgtitle);
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

  const handleDeleteInitialPhoto = (e, photoFilename, index) => {
    e.preventDefault();
    axios.delete(`/api/Portfolio/${slugs}/image/${photoFilename}/${index}`, { withCredentials: true })
      .then(response => {
        const updatedPhotos = initialPhotos.filter(photo => photo !== photoFilename);
        setInitialPhotos(updatedPhotos);
        const updatedPhotoAlts = [...initialphotoAlts];
        updatedPhotoAlts.splice(index, 1);
        setInitialPhotoAlts(updatedPhotoAlts);

        const updatedImgtitle = [...initialimgtitle];
        updatedImgtitle.splice(index, 1);
        setInitialImgtitle(updatedImgtitle);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleDeleteNewPhoto = (e, index) => {
    e.preventDefault();
    const updatedPhotos = [...photo];
    updatedPhotos.splice(index, 1);
    setPhoto(updatedPhotos);
    const updatedPhotoAlts = [...initialphotoAlts];
    updatedPhotoAlts.splice(index, 1);
    setInitialPhotoAlts(updatedPhotoAlts);

    const updatedImgtitle = [...initialimgtitle];
    updatedImgtitle.splice(index, 1);
    setInitialImgtitle(updatedImgtitle);
  };

  const renderCategoryOptions = (category) => {
    return (
      <option key={category._id} value={category.slug}>
        {category.category}
      </option>
    );
  };

  const renderSubCategoryOptions = (subCategory) => {
    return (
      <option key={subCategory._id} value={subCategory.slug}>
        {subCategory.category}
      </option>
    );
  };

  const renderSubSubCategoryOptions = (subSubCategory) => {
    return (
      <option key={subSubCategory._id} value={subSubCategory.slug}>
        {subSubCategory.category}
      </option>
    );
  };

  // For Services
  const renderServiceCategoryOptions = (category) => {
    return (
      <option key={category._id} value={category.slug}>
        {category.category}
      </option>
    );
  };

  const renderServiceSubCategoryOptions = (subCategory) => {
    return (
      <option key={subCategory._id} value={subCategory.slug}>
        {subCategory.category}
      </option>
    );
  };

  const renderServiceSubSubCategoryOptions = (subSubCategory) => {
    return (
      <option key={subSubCategory._id} value={subSubCategory.slug}>
        {subSubCategory.category}
      </option>
    );
  };


  // For inddustries
  const renderIndustriesCategoryOptions = (category) => {
    return (
      <option key={category._id} value={category.slug}>
        {category.category}
      </option>
    );
  };

  const renderIndustriesSubCategoryOptions = (subCategory) => {
    return (
      <option key={subCategory._id} value={subCategory.slug}>
        {subCategory.category}
      </option>
    );
  };

  const renderIndustriesSubSubCategoryOptions = (subSubCategory) => {
    return (
      <option key={subSubCategory._id} value={subSubCategory.slug}>
        {subSubCategory.category}
      </option>
    );
  };
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

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

  const handleServiceParentCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setServiceParentCategoryId(selectedCategoryId);
<<<<<<< HEAD
    setServiceSubCategoryId("");
    setServiceSubSubCategoryId("");
=======
    setServiceSubCategoryId(""); // Reset subcategory selection
    setServiceSubSubCategoryId(""); // Reset sub-subcategory selection
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  };

  const handleServiceSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setServiceSubCategoryId(selectedSubCategoryId);
<<<<<<< HEAD
    setServiceSubSubCategoryId("");
=======
    setServiceSubSubCategoryId(""); // Reset sub-subcategory selection
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  };

  const handleServiceSubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setServiceSubSubCategoryId(selectedSubSubCategoryId);
  };

  const handleIndustriesParentCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setIndustriesParentCategoryId(selectedCategoryId);
<<<<<<< HEAD
    setIndustriesSubCategoryId("");
    setIndustriesSubSubCategoryId("");
=======
    setIndustriesSubCategoryId(""); // Reset subcategory selection
    setIndustriesSubSubCategoryId(""); // Reset sub-subcategory selection
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  };

  const handleIndustriesSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setIndustriesSubCategoryId(selectedSubCategoryId);
<<<<<<< HEAD
    setIndustriesSubSubCategoryId("");
=======
    setIndustriesSubSubCategoryId(""); // Reset sub-subcategory selection
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  };

  const handleIndustriesSubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setIndustriesSubSubCategoryId(selectedSubSubCategoryId);
  };

<<<<<<< HEAD
=======


  // Render categories safely
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const getSubCategories = (categoryId) => {
    const category = categories.find(category => category.slug === categoryId);
    return category?.subCategories || [];
  };

  const getSubSubCategories = (categoryId, subCategoryId) => {
    const category = categories.find(category => category.slug === categoryId);
    const subCategory = category?.subCategories.find(sub => sub.slug === subCategoryId);
    return subCategory?.subSubCategories || [];
  };

<<<<<<< HEAD
=======
  // Render services safely
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const getServiceSubCategories = (categoryId) => {
    const category = servicecategories.find(category => category.slug === categoryId);
    return category?.subCategories || [];
  };

  const getServiceSubSubCategories = (categoryId, subCategoryId) => {
    const category = servicecategories.find(category => category.slug === categoryId);
    const subCategory = category?.subCategories.find(sub => sub.slug === subCategoryId);
    return subCategory?.subSubCategory || [];
  };

<<<<<<< HEAD
=======
  // Render services safely
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const getIndustriesSubCategories = (categoryId) => {
    const category = industriescategories.find(category => category.slug === categoryId);
    return category?.subCategories || [];
  };

  const getIndustriesSubSubCategories = (categoryId, subCategoryId) => {
    const category = industriescategories.find(category => category.slug === categoryId);
    const subCategory = category?.subCategories.find(sub => sub.slug === subCategoryId);
    return subCategory?.subSubCategories || [];
  };

<<<<<<< HEAD
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
=======
  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit Portfolio</h1>
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
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      </div>

      {getSubCategories(parentCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="subCategory" className="block font-semibold mb-2">
<<<<<<< HEAD
            Subcategory (optional)
=======
            Subcategory
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
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
            {getSubCategories(parentCategoryId).map(renderSubCategoryOptions)}
          </select>
        </div>
      )}

      {getSubSubCategories(parentCategoryId, subCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="subSubCategory" className="block font-semibold mb-2">
<<<<<<< HEAD
            Sub-Subcategory (optional)
=======
            Sub-Subcategory
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          </label>
          <select
            id="subSubCategory"
            value={subSubCategoryId}
            onChange={(e) => setSubSubCategoryId(e.target.value)}
<<<<<<< HEAD
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
=======
            className="w-full p-2 border rounded focus:outline-none"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          >
            <option value="">Select Sub-Subcategory</option>
            {getSubSubCategories(parentCategoryId, subCategoryId).map(renderSubSubCategoryOptions)}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="serviceParentCategory" className="block font-semibold mb-2">
          Service Parent Category
        </label>
        <select
          id="serviceParentCategory"
          value={serviceparentCategoryId}
          onChange={handleServiceParentCategoryChange}
<<<<<<< HEAD
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
=======
          className="w-full p-2 border rounded focus:outline-none"
          required
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        >
          <option value="">Select Service Parent Category</option>
          {servicecategories.map(renderServiceCategoryOptions)}
        </select>
      </div>

      {getServiceSubCategories(serviceparentCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="serviceSubCategory" className="block font-semibold mb-2">
<<<<<<< HEAD
            Service Subcategory (optional)
=======
            Service Subcategory
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          </label>
          <select
            id="serviceSubCategory"
            value={servicesubCategoryId}
            onChange={handleServiceSubCategoryChange}
<<<<<<< HEAD
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
=======
            className="w-full p-2 border rounded focus:outline-none"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          >
            <option value="">Select Service Subcategory</option>
            {getServiceSubCategories(serviceparentCategoryId).map(renderServiceSubCategoryOptions)}
          </select>
        </div>
      )}

      {getServiceSubSubCategories(serviceparentCategoryId, servicesubCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="serviceSubSubCategory" className="block font-semibold mb-2">
<<<<<<< HEAD
            Service Sub-Subcategory (optional)
=======
            Service Sub-Subcategory
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          </label>
          <select
            id="serviceSubSubCategory"
            value={servicesubSubCategoryId}
            onChange={handleServiceSubSubCategoryChange}
<<<<<<< HEAD
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
=======
            className="w-full p-2 border rounded focus:outline-none"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          >
            <option value="">Select Service Sub-Subcategory</option>
            {getServiceSubSubCategories(serviceparentCategoryId, servicesubCategoryId).map(renderServiceSubSubCategoryOptions)}
          </select>
        </div>
      )}
<<<<<<< HEAD

=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      <div className="mb-4">
        <label htmlFor="industriesParentCategory" className="block font-semibold mb-2">
          Industries Parent Category
        </label>
        <select
          id="industriesParentCategory"
          value={industriesparentCategoryId}
          onChange={handleIndustriesParentCategoryChange}
<<<<<<< HEAD
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
=======
          className="w-full p-2 border rounded focus:outline-none"
     
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        >
          <option value="">Select Industries Parent Category</option>
          {industriescategories.map(renderIndustriesCategoryOptions)}
        </select>
      </div>

      {getIndustriesSubCategories(industriesparentCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="industriesSubCategory" className="block font-semibold mb-2">
<<<<<<< HEAD
            Industries Subcategory (optional)
=======
            Industries Subcategory
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          </label>
          <select
            id="industriesSubCategory"
            value={industriessubCategoryId}
            onChange={handleIndustriesSubCategoryChange}
<<<<<<< HEAD
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
=======
            className="w-full p-2 border rounded focus:outline-none"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          >
            <option value="">Select Industries Subcategory</option>
            {getIndustriesSubCategories(industriesparentCategoryId).map(renderIndustriesSubCategoryOptions)}
          </select>
        </div>
      )}

      {getIndustriesSubSubCategories(industriesparentCategoryId, industriessubCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="industriesSubSubCategory" className="block font-semibold mb-2">
<<<<<<< HEAD
            Industries Sub-Subcategory (optional)
=======
            Industries Sub-Subcategory
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          </label>
          <select
            id="industriesSubSubCategory"
            value={industriessubSubCategoryId}
            onChange={handleIndustriesSubSubCategoryChange}
<<<<<<< HEAD
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
=======
            className="w-full p-2 border rounded focus:outline-none"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          >
            <option value="">Select Industries Sub-Subcategory</option>
            {getIndustriesSubSubCategories(industriesparentCategoryId, industriessubCategoryId).map(renderIndustriesSubSubCategoryOptions)}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block font-semibold mb-2">
<<<<<<< HEAD
          Title <span className="text-red-500">*</span>
=======
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
              <label htmlFor={`imgtitle-${index}`} className="block mt-2">
                Image Title Text:
                <input
                  type="text"
                  id={`imgtitle-${index}`}
                  value={initialimgtitle[index]}
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
                Image Title Text:
                <input
                  type="text"
                  id={`alt-new-${index}`}
                  value={imgtitle[index] || ""}
                  onChange={(e) => handleNewImgtitleChange(e, index)}
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
        {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default EditPortfolio;
=======
      <div className="mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
        >
          Save Changes
        </button>
      </div>
    </form>
  );

}
export default EditPortfolio;
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
