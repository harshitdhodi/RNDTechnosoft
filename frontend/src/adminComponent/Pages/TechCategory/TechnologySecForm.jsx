import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TechnologySecDataForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isUpdate = !!id;

  const [formData, setFormData] = useState({
    technologyId: '',
    type: '',
    heading: '',
    card: [{ photo: '', heading: '', subHeading: '', altName: '', imgTitle: '', key: uuidv4() }],
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState('Enter heading/subheading...');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  const typeOptions = [
    { value: 'hire developer', label: 'Hire Developer' },
    { value: 'Why Choose', label: 'Why Choose' },
    { value: 'Technology Application', label: 'Technology Application' },
  ];

  // Character limits
  const CHAR_LIMITS = {
    heading: { min: 10, max: 400 },
    cardHeading: { min: 10, max: 400 },
    cardSubHeading: { min: 10, max: 400 },
    altName: { min: 2, max: 100 },
    imgTitle: { min: 2, max: 100 }
  };

  // Utility function to strip HTML tags and get plain text length
  const getPlainTextLength = (htmlString) => {
    if (!htmlString) return 0;
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    return div.textContent.length || 0;
  };

  // Validation functions
  const validateField = (name, value, index = null) => {
    const errors = {};
    
    switch (name) {
      case 'technologyId':
        if (!value || value.trim() === '') {
          errors[name] = 'Technology selection is required';
        }
        break;
      
      case 'type':
        if (!value || value.trim() === '') {
          errors[name] = 'Type selection is required';
        }
        break;
      
      case 'heading':
        const headingLength = getPlainTextLength(value);
        if (!value || value.trim() === '' || headingLength === 0) {
          errors[name] = 'Heading is required';
        } else if (headingLength < CHAR_LIMITS.heading.min) {
          errors[name] = `Heading must be at least ${CHAR_LIMITS.heading.min} characters`;
        } else if (headingLength > CHAR_LIMITS.heading.max) {
          errors[name] = `Heading must not exceed ${CHAR_LIMITS.heading.max} characters`;
        }
        break;
      
      case 'card.heading':
        const cardHeadingLength = getPlainTextLength(value);
        const cardHeadingKey = `card.${index}.heading`;
        if (value && value.trim() !== '' && cardHeadingLength > 0) {
          if (cardHeadingLength < CHAR_LIMITS.cardHeading.min) {
            errors[cardHeadingKey] = `Card heading must be at least ${CHAR_LIMITS.cardHeading.min} characters`;
          } else if (cardHeadingLength > CHAR_LIMITS.cardHeading.max) {
            errors[cardHeadingKey] = `Card heading must not exceed ${CHAR_LIMITS.cardHeading.max} characters`;
          }
        }
        break;
      
      case 'card.subHeading':
        const cardSubHeadingLength = getPlainTextLength(value);
        const cardSubHeadingKey = `card.${index}.subHeading`;
        if (value && value.trim() !== '' && cardSubHeadingLength > 0) {
          if (cardSubHeadingLength < CHAR_LIMITS.cardSubHeading.min) {
            errors[cardSubHeadingKey] = `Card sub heading must be at least ${CHAR_LIMITS.cardSubHeading.min} characters`;
          } else if (cardSubHeadingLength > CHAR_LIMITS.cardSubHeading.max) {
            errors[cardSubHeadingKey] = `Card sub heading must not exceed ${CHAR_LIMITS.cardSubHeading.max} characters`;
          }
        }
        break;
      
      case 'card.altName':
        const altNameKey = `card.${index}.altName`;
        if (value && value.trim() !== '') {
          if (value.length < CHAR_LIMITS.altName.min) {
            errors[altNameKey] = `Alt name must be at least ${CHAR_LIMITS.altName.min} characters`;
          } else if (value.length > CHAR_LIMITS.altName.max) {
            errors[altNameKey] = `Alt name must not exceed ${CHAR_LIMITS.altName.max} characters`;
          }
        }
        break;
      
      case 'card.imgTitle':
        const imgTitleKey = `card.${index}.imgTitle`;
        if (value && value.trim() !== '') {
          if (value.length < CHAR_LIMITS.imgTitle.min) {
            errors[imgTitleKey] = `Image title must be at least ${CHAR_LIMITS.imgTitle.min} characters`;
          } else if (value.length > CHAR_LIMITS.imgTitle.max) {
            errors[imgTitleKey] = `Image title must not exceed ${CHAR_LIMITS.imgTitle.max} characters`;
          }
        }
        break;
      
      case 'card.photo':
        break;
    }
    
    return errors;
  };

  // Validate all fields
  const validateAllFields = () => {
    let allErrors = {};
    
    allErrors = { ...allErrors, ...validateField('technologyId', formData.technologyId) };
    allErrors = { ...allErrors, ...validateField('type', formData.type) };
    allErrors = { ...allErrors, ...validateField('heading', formData.heading) };
    
    formData.card.forEach((card, index) => {
      allErrors = { ...allErrors, ...validateField('card.heading', card.heading, index) };
      allErrors = { ...allErrors, ...validateField('card.subHeading', card.subHeading, index) };
      allErrors = { ...allErrors, ...validateField('card.altName', card.altName, index) };
      allErrors = { ...allErrors, ...validateField('card.imgTitle', card.imgTitle, index) };
    });
    
    return allErrors;
  };

  // Update validation errors
  const updateValidationErrors = (fieldName, value, index = null) => {
    const fieldErrors = validateField(fieldName, value, index);
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      
      if (index !== null) {
        const fieldKey = `card.${index}.${fieldName.split('.')[1]}`;
        delete newErrors[fieldKey];
        Object.assign(newErrors, fieldErrors);
      } else {
        delete newErrors[fieldName];
        Object.assign(newErrors, fieldErrors);
      }
      
      return newErrors;
    });
  };

  // Fetch technologies for dropdown
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await axios.get('/api/technology', { withCredentials: true });
        setTechnologies(response.data.data || response.data);
      } catch (err) {
        setError('Failed to fetch technologies');
        console.error('Fetch technologies error:', err);
        toast.error('Failed to fetch technologies');
      }
    };
    fetchTechnologies();
  }, []);

  // Fetch data for update
  useEffect(() => {
    if (isUpdate) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/technologySecData/${id}`, { withCredentials: true });
          const data = response.data.data || response.data;
          
          setFormData({
            technologyId: data.technologyId || '',
            type: data.type || '',
            heading: data.heading || '',
            card: data.card && Array.isArray(data.card)
              ? data.card.map(card => ({ ...card, key: uuidv4() }))
              : [{ photo: '', heading: '', subHeading: '', altName: '', imgTitle: '', key: uuidv4() }],
          });
          setPreviews(data.card ? data.card.map(card => card.photo || null) : []);
          setFiles(data.card ? data.card.map(() => null) : []);
        } catch (err) {
          setError('Failed to fetch data');
          console.error('Fetch error:', err);
          toast.error('Failed to fetch data');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id, isUpdate]);

  // Clean up previews
  useEffect(() => {
    return () => {
      previews.forEach(preview => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [previews]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
  
    setTouched(prev => ({
      ...prev,
      [`${name}${index !== undefined ? `.${index}` : ''}`]: true
    }));

    if (name === 'type') {
      switch (value) {
        case 'hire developer':
          setPlaceholder('Enter heading/subheading for Hire Developer...');
          break;
        case 'Why Choose':
          setPlaceholder('Enter heading/subheading for Why Choose...');
          break;
        case 'Technology Application':
          setPlaceholder('Enter heading/subheading for Technology Application...');
          break;
        default:
          setPlaceholder('');
      }
      
      updateValidationErrors('type', value);
    }
    
    if (name === 'technologyId') {
      updateValidationErrors('technologyId', value);
    }
  
    if (name.includes('card.')) {
      const cardField = name.split('.')[1];
      const updatedCards = [...formData.card];
      updatedCards[index] = { ...updatedCards[index], [cardField]: value };
      setFormData({ ...formData, card: updatedCards });
      
      updateValidationErrors(`card.${cardField}`, value, index);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleQuillChange = debounce((field, value, index) => {
    setTouched(prev => ({
      ...prev,
      [`${field}${index !== undefined ? `.${index}` : ''}`]: true
    }));

    if (field === 'heading') {
      setFormData({ ...formData, heading: value });
      updateValidationErrors('heading', value);
    } else if (field === 'card.heading' || field === 'card.subHeading') {
      const cardField = field.split('.')[1];
      const updatedCards = [...formData.card];
      updatedCards[index] = { ...updatedCards[index], [cardField]: value };
      setFormData({ ...formData, card: updatedCards });
      
      updateValidationErrors(`card.${cardField}`, value, index);
    }
  }, 300);

  const handleFileChange = (e, index) => {
    const selectedFile = e.target.files[0];
    
    setTouched(prev => ({
      ...prev,
      [`card.photo.${index}`]: true
    }));

    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setValidationErrors(prev => ({
        ...prev,
        [`card.${index}.photo`]: 'File must be less than 5MB'
      }));
      toast.error('File must be less than 5MB');
      return;
    }

    const updatedFiles = [...files];
    updatedFiles[index] = selectedFile;
    setFiles(updatedFiles);

    const updatedPreviews = [...previews];
    updatedPreviews[index] = selectedFile ? URL.createObjectURL(selectedFile) : null;
    setPreviews(updatedPreviews);
    
    if (selectedFile) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`card.${index}.photo`];
        return newErrors;
      });
    }
  };

  const addCard = () => {
    setFormData({
      ...formData,
      card: [...formData.card, { photo: '', heading: '', subHeading: '', altName: '', imgTitle: '', key: uuidv4() }],
    });
    setFiles([...files, null]);
    setPreviews([...previews, null]);
  };

  const removeCard = (index) => {
    if (formData.card.length === 1) {
      setError('At least one card is required');
      toast.error('At least one card is required');
      return;
    }
    
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`card.${index}.heading`];
      delete newErrors[`card.${index}.subHeading`];
      delete newErrors[`card.${index}.altName`];
      delete newErrors[`card.${index}.imgTitle`];
      delete newErrors[`card.${index}.photo`];
      return newErrors;
    });
    
    setFormData({
      ...formData,
      card: formData.card.filter((_, i) => i !== index),
    });
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const allErrors = validateAllFields();
    setValidationErrors(allErrors);
    
    if (Object.keys(allErrors).length > 0) {
      setError('Please fix all validation errors before submitting');
      toast.error('Please fix all validation errors before submitting');
      return;
    }
    
    setLoading(true);

    if (formData.card.length !== files.length || formData.card.length !== previews.length) {
      setError('Card, files, and previews arrays are out of sync');
      toast.error('Card, files, and previews arrays are out of sync');
      setLoading(false);
      return;
    }

    try {
      const fileFormData = new FormData();
      fileFormData.append('type', formData.type || '');
      fileFormData.append('heading', formData.heading || '');
      fileFormData.append('technologyId', formData.technologyId || '');

      formData.card.forEach((card, index) => {
        fileFormData.append(`card[${index}][heading]`, card.heading || '');
        fileFormData.append(`card[${index}][subHeading]`, card.subHeading || '');
        fileFormData.append(`card[${index}][altName]`, card.altName || '');
        fileFormData.append(`card[${index}][imgTitle]`, card.imgTitle || '');
        if (files[index]) {
          fileFormData.append(`card[${index}][photo]`, files[index]);
        } else if (card.photo) {
          fileFormData.append(`card[${index}][photo]`, card.photo);
        }
      });

      const response = await axios({
        method: isUpdate ? 'put' : 'post',
        url: `/api/technologySecData${isUpdate ? `/${id}` : ''}`,
        data: fileFormData,
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      toast.success(isUpdate ? 'Technology section updated successfully' : 'Technology section created successfully');
      setFormData(prev => ({
        ...prev,
        technologyId: response.data.data?.technologyId || response.data.technologyId || prev.technologyId,
        type: response.data.data?.type || response.data.type || prev.type,
        heading: response.data.data?.heading || response.data.heading || prev.heading,
        card: response.data.data?.card && Array.isArray(response.data.data.card)
          ? response.data.data.card.map((card, i) => ({
            ...prev.card[i],
            ...card,
            key: prev.card[i]?.key || uuidv4(),
          }))
          : response.data.card && Array.isArray(response.data.card)
            ? response.data.card.map((card, i) => ({
              ...prev.card[i],
              ...card,
              key: prev.card[i]?.key || uuidv4(),
            }))
            : prev.card,
      }));
      setPreviews(
        response.data.data?.card
          ? response.data.data.card.map(card => card.photo || null)
          : response.data.card
            ? response.data.card.map(card => card.photo || null)
            : []
      );
      setFiles([]);
      navigate('/tech-sec-data');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to save data';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('API Error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get image source
  const getImageSrc = (card, index) => {
    if (previews[index] && previews[index].startsWith('blob:')) {
      return previews[index];
    }
    if (card.photo) {
      if (card.photo.startsWith('http')) {
        return card.photo;
      }
      return `/api/logo/download/${card.photo}?t=${Date.now()}`;
    }
    return null;
  };

  // Helper function to render character count
  const renderCharCount = (value, limits, isHtml = false) => {
    const currentLength = isHtml ? getPlainTextLength(value) : (value || '').length;
    const isOverLimit = currentLength > limits.max;
    const isUnderLimit = currentLength < limits.min;
    
    return (
      <div className={`text-sm mt-1 ${isOverLimit ? 'text-red-500' : isUnderLimit ? 'text-yellow-600' : 'text-gray-500'}`}>
        {currentLength}/{limits.max} characters
        {isUnderLimit && currentLength > 0 && ` (minimum: ${limits.min})`}
      </div>
    );
  };

  // Helper function to get example image based on type
  const getExampleImageSrc = (type) => {
    switch (type) {
      case 'hire developer':
        return '/hire-dev-heading.png';
      case 'Why Choose':
        return '/why-choose-heading.png';
      case 'Technology Application':
        return '/technology-heading.png';
      default:
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzZiNzI4MCIvPjx0ZXh0IHg9IjIwMCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkV4YW1wbGUgSGVhZGluZy9TdWJoZWFkaW5nPC90ZXh0Pjwvc3ZnPg==';
    }
  };

  // Open preview modal
  const openPreviewModal = () => {
    if (!formData.type) {
      toast.error('Please select a type to preview the example image');
      return;
    }
    setIsPreviewModalOpen(true);
  };

  // Close preview modal
  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 font-serif">
        {isUpdate ? 'Update Technology Section' : 'Add Technology Section'}
      </h2>
      {error && <p className="text-red-500 mb-4 p-3 bg-red-50 rounded-md">{error}</p>}
      {loading && <p className="text-gray-500 mb-4">Loading...</p>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 font-serif">
            Technology <span className="text-red-500">*</span>
          </label>
          <select
            name="technologyId"
            value={formData.technologyId}
            onChange={(e) => handleChange(e)}
            className={`mt-1 block w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.technologyId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="" disabled>Select Technology</option>
            {technologies.map((tech) => (
              <option key={tech._id} value={tech._id}>
                {tech.imgTitle}
              </option>
            ))}
          </select>
          {validationErrors.technologyId && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.technologyId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 font-serif">
            Type <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4">
            <select
              name="type"
              value={formData.type}
              onChange={(e) => handleChange(e)}
              className={`mt-1 block w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="" disabled>Select Type</option>
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {validationErrors.type && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.type}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-serif">
            Heading/Sub heading <span className="text-red-500">*</span>
          </label>
          
          {formData.type && (
            <div className="mb-4 relative">
              <p className="text-sm text-gray-600 mb-2">Example for {formData.type}:</p>
              <div className="relative">
                <img 
                  src={getExampleImageSrc(formData.type)}
                  alt={`Example heading for ${formData.type}`}
                  className="border rounded-md shadow-sm max-w-lg max-h-80 object-contain"
                />
                <button
                  type="button"
                  onClick={openPreviewModal}
                  className="absolute top-2 right-2 bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  title="Preview Image"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="min-h-[140px] mb-10">
            <ReactQuill
              key={placeholder}
              value={formData.heading}
              onChange={(value) => handleQuillChange('heading', value)}
              className={`bg-white ${validationErrors.heading ? 'border-red-500' : ''}`}
              theme="snow"
              placeholder={placeholder}
              style={{ height: '100px' }}
              modules={{
                toolbar: [
                  [{ font: [] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
                  [{ script: 'sub' }, { script: 'super' }],
                  [{ indent: '-1' }, { indent: '+1' }],
                  ['link', 'image', 'video'],
                  [{ direction: 'rtl' }],
                  [
                    { color: ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff','#f3ca0d'] },
                    { background: ['#ffffff', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#cfe2f3', '#d9d2e9'] }
                  ],
                  [{ align: [] }],
                  ['clean'],
                ],
              }}
            />
          </div>
          {renderCharCount(formData.heading, CHAR_LIMITS.heading, true)}
          {validationErrors.heading && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.heading}</p>
          )}
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2 font-serif">Cards</h3>
          {formData.card.map((card, index) => (
            <div key={card.key} className="border p-4 rounded-md mb-4 relative bg-gray-50">
              <h4 className="text-md font-medium mb-4 font-serif">Card {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeCard(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1"
                disabled={formData.card.length === 1}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-serif">
                    Card Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, index)}
                    className={`mt-1 block w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors[`card.${index}.photo`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {getImageSrc(card, index) && (
                    <div className="mt-2">
                      <img
                        src={getImageSrc(card, index)}
                        alt={card.altName || `Card ${index + 1} preview`}
                        className="max-w-xs h-auto rounded-md border"
                        onError={(e) => {
                          console.error('Image load error:', e.target.src);
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  {card.photo && !previews[index] && (
                    <p className="text-sm text-gray-500 mt-1">
                      Current photo: {card.photo}
                    </p>
                  )}
                  {validationErrors[`card.${index}.photo`] && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors[`card.${index}.photo`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-serif">
                    Card Heading
                  </label>
                  <div className="min-h-[140px] mb-10">
                    <ReactQuill
                      value={card.heading}
                      onChange={(value) => handleQuillChange('card.heading', value, index)}
                      className={`bg-white ${validationErrors[`card.${index}.heading`] ? 'border-red-500' : ''}`}
                      theme="snow"
                      placeholder='Enter card heading...'
                      style={{ height: '100px' }}
                      modules={{
                        toolbar: [
                          [{ font: [] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{ header: [1, 2, 3, 4, 5, 6, false] }],
                          [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
                          [{ script: 'sub' }, { script: 'super' }],
                          [{ indent: '-1' }, { indent: '+1' }],
                          ['link', 'image', 'video'],
                          [{ direction: 'rtl' }],
                          [{ color: [] }, { background: [] }],
                          [{ align: [] }],
                          ['clean'],
                        ],
                      }}
                    />
                  </div>
                  {renderCharCount(card.heading, CHAR_LIMITS.cardHeading, true)}
                  {validationErrors[`card.${index}.heading`] && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors[`card.${index}.heading`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-serif">
                    Card Sub Heading
                  </label>
                  <div className="min-h-[140px] mb-10">
                    <ReactQuill
                      value={card.subHeading}
                      onChange={(value) => handleQuillChange('card.subHeading', value, index)}
                      className={`bg-white ${validationErrors[`card.${index}.subHeading`] ? 'border-red-500' : ''}`}
                      theme="snow"
                      placeholder='Enter card subheading...'
                      style={{ height: '100px' }}
                      modules={{
                        toolbar: [
                          [{ font: [] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{ header: [1, 2, 3, 4, 5, 6, false] }],
                          [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
                          [{ script: 'sub' }, { script: 'super' }],
                          [{ indent: '-1' }, { indent: '+1' }],
                          ['link', 'image', 'video'],
                          [{ direction: 'rtl' }],
                          [{ color: [] }, { background: [] }],
                          [{ align: [] }],
                          ['clean'],
                        ],
                      }}
                    />
                  </div>
                  {renderCharCount(card.subHeading, CHAR_LIMITS.cardSubHeading, true)}
                  {validationErrors[`card.${index}.subHeading`] && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors[`card.${index}.subHeading`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-serif">
                    Card Alt Name
                  </label>
                  <input
                    type="text"
                    name="card.altName"
                    value={card.altName}
                    onChange={(e) => handleChange(e, index)}
                    className={`mt-1 block w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors[`card.${index}.altName`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='Enter alt name...'
                    maxLength={CHAR_LIMITS.altName.max}
                  />
                  {renderCharCount(card.altName, CHAR_LIMITS.altName)}
                  {validationErrors[`card.${index}.altName`] && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors[`card.${index}.altName`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-serif">
                    Card Photo Title
                  </label>
                  <input
                    type="text"
                    name="card.imgTitle"
                    value={card.imgTitle}
                    onChange={(e) => handleChange(e, index)}
                    className={`mt-1 block w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors[`card.${index}.imgTitle`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='Enter photo title...'
                    maxLength={CHAR_LIMITS.imgTitle.max}
                  />
                  {renderCharCount(card.imgTitle, CHAR_LIMITS.imgTitle)}
                  {validationErrors[`card.${index}.imgTitle`] && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors[`card.${index}.imgTitle`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addCard}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Card
          </button>
        </div>

        <div className="border-t pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 text-lg font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              `${isUpdate ? 'Update' : 'Create'} Technology Section`
            )}
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold font-serif">
                Example Image for {formData.type}
              </h3>
              <button
                onClick={closePreviewModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex justify-center">
              <img
                src={getExampleImageSrc(formData.type)}
                alt={`Example heading for ${formData.type}`}
                className="max-w-full max-h-[90vh] object-contain rounded-md border"
                onError={(e) => {
                  console.error("Image load error:", e.target.src);
                  e.target.style.display = "none";
                }}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closePreviewModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologySecDataForm;