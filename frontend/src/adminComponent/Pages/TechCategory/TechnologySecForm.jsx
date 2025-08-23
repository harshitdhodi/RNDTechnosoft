import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { v4 as uuidv4 } from 'uuid';

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
        // Only validate if value is provided (optional field)
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
        // Only validate if value is provided (optional field)
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
        // Only validate if value is provided (optional field)
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
        // Only validate if value is provided (optional field)
        if (value && value.trim() !== '') {
          if (value.length < CHAR_LIMITS.imgTitle.min) {
            errors[imgTitleKey] = `Image title must be at least ${CHAR_LIMITS.imgTitle.min} characters`;
          } else if (value.length > CHAR_LIMITS.imgTitle.max) {
            errors[imgTitleKey] = `Image title must not exceed ${CHAR_LIMITS.imgTitle.max} characters`;
          }
        }
        break;
      
      case 'card.photo':
        // Card photo is optional - no validation needed
        break;
    }
    
    return errors;
  };

  // Validate all fields
  const validateAllFields = () => {
    let allErrors = {};
    
    // Validate main fields
    allErrors = { ...allErrors, ...validateField('technologyId', formData.technologyId) };
    allErrors = { ...allErrors, ...validateField('type', formData.type) };
    allErrors = { ...allErrors, ...validateField('heading', formData.heading) };
    
    // Validate card fields (optional - only validate if filled)
    formData.card.forEach((card, index) => {
      allErrors = { ...allErrors, ...validateField('card.heading', card.heading, index) };
      allErrors = { ...allErrors, ...validateField('card.subHeading', card.subHeading, index) };
      allErrors = { ...allErrors, ...validateField('card.altName', card.altName, index) };
      allErrors = { ...allErrors, ...validateField('card.imgTitle', card.imgTitle, index) };
      // Skip photo validation since it's optional
    });
    
    return allErrors;
  };

  // Update validation errors
  const updateValidationErrors = (fieldName, value, index = null) => {
    const fieldErrors = validateField(fieldName, value, index);
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      
      // Remove old errors for this field
      if (index !== null) {
        const fieldKey = `card.${index}.${fieldName.split('.')[1]}`;
        delete newErrors[fieldKey];
        // Add new errors
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
        const response = await axios.get('/api/technology');
        console.log('Fetched technologies:', response.data.data);
        setTechnologies(response.data.data || response.data);
      } catch (err) {
        setError('Failed to fetch technologies');
        console.error('Fetch technologies error:', err);
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
          const response = await axios.get(`/api/technologySecData/${id}`);
          const data = response.data.data || response.data;
          console.log('Fetched data for update:', data);
          
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
  
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [`${name}${index !== undefined ? `.${index}` : ''}`]: true
    }));

    if (name === 'type') {
      // Update placeholder dynamically based on selected type
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
      
      // Validate type field
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
      
      // Validate card field
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
    // Mark field as touched
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
      
      // Validate card field
      updateValidationErrors(`card.${cardField}`, value, index);
    }
  }, 300);

  const handleFileChange = (e, index) => {
    const selectedFile = e.target.files[0];
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [`card.photo.${index}`]: true
    }));

    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setValidationErrors(prev => ({
        ...prev,
        [`card.${index}.photo`]: 'File must be less than 5MB'
      }));
      return;
    }

    const updatedFiles = [...files];
    updatedFiles[index] = selectedFile;
    setFiles(updatedFiles);

    const updatedPreviews = [...previews];
    updatedPreviews[index] = selectedFile ? URL.createObjectURL(selectedFile) : null;
    console.log('Preview for index', index, ':', updatedPreviews[index]);
    setPreviews(updatedPreviews);
    
    // Clear photo validation error if file is selected
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
      return;
    }
    
    // Remove validation errors for this card
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
    
    // Validate all fields
    const allErrors = validateAllFields();
    setValidationErrors(allErrors);
    
    if (Object.keys(allErrors).length > 0) {
      setError('Please fix all validation errors before submitting');
      return;
    }
    
    setLoading(true);

    if (formData.card.length !== files.length || formData.card.length !== previews.length) {
      setError('Card, files, and previews arrays are out of sync');
      setLoading(false);
      return;
    }

    try {
      const fileFormData = new FormData();
      fileFormData.append('type', formData.type || '');
      fileFormData.append('heading', formData.heading || '');
      fileFormData.append('technologyId', formData.technologyId || '');

      formData.card.forEach((card, index) => {
        fileFormData.append(`card[${index}]heading`, card.heading || '');
        fileFormData.append(`card[${index}]subHeading`, card.subHeading || '');
        fileFormData.append(`card[${index}]altName`, card.altName || '');
        fileFormData.append(`card[${index}]imgTitle`, card.imgTitle || '');
        if (files[index]) {
          fileFormData.append(`card[${index}][photo]`, files[index]);
        } else if (card.photo) {
          fileFormData.append(`card[${index}][photo]`, card.photo);
        }
      });

      // Log FormData entries
      for (let [key, value] of fileFormData.entries()) {
        console.log(key, value instanceof File ? value.name : value);
      }

      const response = await axios({
        method: isUpdate ? 'put' : 'post',
        url: `/api/technologySecData${isUpdate ? `/${id}` : ''}`,
        data: fileFormData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('API Response:', response.data);

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
      setError(err.response?.data?.error || 'Failed to save data');
      console.error('API Error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get image source
  const getImageSrc = (card, index) => {
    // If there's a preview (new file selected), use it
    if (previews[index] && previews[index].startsWith('blob:')) {
      return previews[index];
    }
    // If there's a card photo from server, use the correct API endpoint
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">
        {isUpdate ? 'Update Technology Section' : 'Add Technology Section'}
      </h2>
      {error && <p className="text-red-500 mb-4 p-3 bg-red-50 rounded-md">{error}</p>}
      {loading && <p className="text-gray-500 mb-4">Loading...</p>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">
            Type <span className="text-red-500">*</span>
          </label>
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
          {validationErrors.type && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.type}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heading/Sub heading <span className="text-red-500">*</span>
          </label>
          
          {/* Example Image */}
          {formData.type && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Example for {formData.type}:</p>
              <img 
                src={getExampleImageSrc(formData.type)}
                alt={`Example heading for ${formData.type}`}
                className="border rounded-md shadow-sm max-w-md max-h-60 object-contain"
              />
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
          <h3 className="text-lg font-semibold mb-2">Cards</h3>
          {formData.card.map((card, index) => (
            <div key={card.key} className="border p-4 rounded-md mb-4 relative bg-gray-50">
              <h4 className="text-md font-medium mb-4">Card {index + 1}</h4>
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
                  <label className="block text-sm font-medium text-gray-700">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700">
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
                  <label className="block text-sm font-medium text-gray-700">
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
    </div>
  );
};

export default TechnologySecDataForm;