import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
<<<<<<< HEAD
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
=======
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

const HireTalentForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
<<<<<<< HEAD
  const navigate = useNavigate();
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const [formData, setFormData] = useState({
    heading: '',
    subHeading: '',
    cards: [{ cardInfo: '', photo: '', altImg: '', imgTitle: '' }],
    pageSection: 'TeamService',
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
<<<<<<< HEAD
  const [validationErrors, setValidationErrors] = useState({});

  // Character and card limits
  const CHAR_LIMITS = {
    heading: { min: 10, max: 70 },
    subHeading: { min: 10, max: 250 },
    cardInfo: { min: 10, max: 250 },
  };
  const MAX_CARDS = 6;
  const IMAGE_CONSTRAINTS = {
    maxSize: 2 * 1024 * 1024, // 2MB
    types: ['image/jpeg', 'image/png', 'image/webp'],
  };

  // Quill modules configuration
=======
const navigate = useNavigate()

  // Quill modules configuration for toolbar
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
<<<<<<< HEAD
      [{ indent: '-1' }, { indent: '+1' }],
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      ['link', 'image'],
      ['clean'],
    ],
  };

<<<<<<< HEAD
  // Quill formats
=======
  // Quill formats to allow
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
<<<<<<< HEAD
    'indent',
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    'link',
    'image',
  ];

<<<<<<< HEAD
  // Get plain text length from HTML content
  const getPlainTextLength = (html) => {
    if (!html) return 0;
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent.trim().length;
  };

  // Validate field
  const validateField = (field, value, index = null) => {
    const errors = {};
    const key = index !== null ? `cards[${index}].${field}` : field;
    const plainTextLength = field === 'cardInfo' ? getPlainTextLength(value) : value.length;

    if (field === 'heading' || field === 'subHeading' || field === 'cardInfo') {
      if (!value || plainTextLength === 0) {
        errors[key] = `${field === 'cardInfo' ? 'Card Info' : field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      } else if (plainTextLength < CHAR_LIMITS[field].min) {
        errors[key] = `${field === 'cardInfo' ? 'Card Info' : field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${CHAR_LIMITS[field].min} characters`;
      } else if (plainTextLength > CHAR_LIMITS[field].max) {
        errors[key] = `${field === 'cardInfo' ? 'Card Info' : field.charAt(0).toUpperCase() + field.slice(1)} must not exceed ${CHAR_LIMITS[field].max} characters`;
      }
    } else if (field === 'photo' && index !== null) {
      if (!value && !isEditMode) {
        errors[key] = 'Card photo is required';
      }
    } else if (field === 'altImg' || field === 'imgTitle') {
      if (value && value.length > 100) {
        errors[key] = `${field === 'altImg' ? 'Alt Text' : 'Image Title'} must not exceed 100 characters`;
      }
    } else if (field === 'pageSection') {
      if (!value) {
        errors[key] = 'Page Section is required';
      }
    }
    return errors;
  };

  // Validate all fields
  const validateForm = () => {
    let errors = {};
    errors = { ...errors, ...validateField('heading', formData.heading) };
    errors = { ...errors, ...validateField('subHeading', formData.subHeading) };
    errors = { ...errors, ...validateField('pageSection', formData.pageSection) };
    if (formData.cards.length === 0) {
      errors['cards'] = 'At least one card is required';
    }
    formData.cards.forEach((card, index) => {
      errors = { ...errors, ...validateField('cardInfo', card.cardInfo, index) };
      errors = { ...errors, ...validateField('photo', card.photo, index) };
      errors = { ...errors, ...validateField('altImg', card.altImg, index) };
      errors = { ...errors, ...validateField('imgTitle', card.imgTitle, index) };
    });
    return errors;
  };

  // Fetch data in edit mode
=======
  // Fetch data when in edit mode
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/hire-talent/${id}`);
          const data = response.data.data;
<<<<<<< HEAD
          const cards = data.card && data.card.length > 0
            ? data.card.map(card => ({
                cardInfo: card.cardInfo || '',
                photo: card.photo || '',
                altImg: card.altImg || '',
                imgTitle: card.imgTitle || '',
              }))
            : [{ cardInfo: '', photo: '', altImg: '', imgTitle: '' }];
          setFormData({
            heading: data.heading || '',
            subHeading: data.subHeading || '',
            cards,
            pageSection: data.pageSection || 'TeamService',
          });
          setImagePreviews(cards.map(card =>
            card.photo ? `/api/logo/download/${card.photo}?t=${Date.now()}` : ''
          ));
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message;
          setError('Error fetching data: ' + errorMessage);
          toast.error('Error fetching data: ' + errorMessage);
=======
          setFormData({
            heading: data.heading || '',
            subHeading: data.subHeading || '',
            cards: data.card.length > 0
              ? data.card.map(card => ({
                  cardInfo: card.cardInfo || '', // Expecting HTML content
                  photo: card.photo || '',
                  altImg: card.altImg || '',
                  imgTitle: card.imgTitle || '',
                }))
              : [{ cardInfo: '', photo: '', altImg: '', imgTitle: '' }],
            pageSection: data.pageSection || 'TeamService',
          });
          setImagePreviews(data.card.map(card =>
            card.photo ? `/api/logo/download/${card.photo}` : ''
          ));
        } catch (err) {
          setError('Error fetching data: ' + err.message);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        }
      };
      fetchData();
    }
  }, [id, isEditMode]);

<<<<<<< HEAD
  // Clean up image previews
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const handleInputChange = (value, cardIndex, field) => {
    const updatedFormData = { ...formData };
    if (field === 'heading' || field === 'subHeading' || field === 'pageSection') {
      updatedFormData[field] = value;
<<<<<<< HEAD
=======
    } else if (field === 'cardInfo') {
      updatedFormData.cards[cardIndex][field] = value; // Store HTML from Quill
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    } else {
      updatedFormData.cards[cardIndex][field] = value;
    }
    setFormData(updatedFormData);
<<<<<<< HEAD

    // Update validation errors
    const errors = validateField(field, value, cardIndex);
    setValidationErrors(prev => ({
      ...prev,
      ...errors,
      ...(Object.keys(errors).length === 0 && { [field]: undefined, [`cards[${cardIndex}].${field}`]: undefined }),
    }));
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  };

  const handleImageChange = (e, cardIndex) => {
    const file = e.target.files[0];
    if (file) {
<<<<<<< HEAD
      // Validate file type
      if (!IMAGE_CONSTRAINTS.types.includes(file.type)) {
        setValidationErrors(prev => ({
          ...prev,
          [`cards[${cardIndex}].photo`]: 'Please upload a JPG or PNG image',
        }));
        toast.error('Please upload a JPG or PNG image');
        return;
      }

      // Validate file size
      if (file.size > IMAGE_CONSTRAINTS.maxSize) {
        setValidationErrors(prev => ({
          ...prev,
          [`cards[${cardIndex}].photo`]: 'Image size must be less than 2MB',
        }));
        toast.error('Image size must be less than 2MB');
        return;
      }

      // If validation passes
      const updatedFormData = { ...formData };
      updatedFormData.cards[cardIndex].photo = file;
      setFormData(updatedFormData);

      const updatedPreviews = [...imagePreviews];
      updatedPreviews[cardIndex] = URL.createObjectURL(file);
      setImagePreviews(updatedPreviews);

      setValidationErrors(prev => ({
        ...prev,
        [`cards[${cardIndex}].photo`]: undefined,
      }));
=======
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedFormData = { ...formData };
        updatedFormData.cards[cardIndex].photo = file;
        setFormData(updatedFormData);

        const updatedPreviews = [...imagePreviews];
        updatedPreviews[cardIndex] = URL.createObjectURL(file);
        setImagePreviews(updatedPreviews);
      };
      reader.readAsDataURL(file);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    }
  };

  const addCard = () => {
<<<<<<< HEAD
    if (formData.cards.length >= MAX_CARDS) {
      setError(`Maximum of ${MAX_CARDS} cards allowed for proper website layout`);
      toast.error(`Maximum of ${MAX_CARDS} cards allowed for proper website layout`);
      return;
    }
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    setFormData({
      ...formData,
      cards: [...formData.cards, { cardInfo: '', photo: '', altImg: '', imgTitle: '' }],
    });
    setImagePreviews([...imagePreviews, '']);
  };

  const removeCard = (cardIndex) => {
    if (formData.cards.length > 1) {
      const updatedFormData = { ...formData };
      updatedFormData.cards.splice(cardIndex, 1);
      setFormData(updatedFormData);
      const updatedPreviews = [...imagePreviews];
      updatedPreviews.splice(cardIndex, 1);
      setImagePreviews(updatedPreviews);
<<<<<<< HEAD
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        Object.keys(prev).forEach(key => {
          if (key.startsWith(`cards[${cardIndex}]`)) {
            delete newErrors[key];
          }
        });
        return newErrors;
      });
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
<<<<<<< HEAD
    setValidationErrors({});

    // Validate all fields
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix all validation errors before submitting');
      toast.error('Please fix all validation errors before submitting');
=======

    // Client-side validation
    const invalidCards = formData.cards.filter((card, index) => {
      const hasCardInfo = card.cardInfo && card.cardInfo.trim() !== '';
      const hasPhoto = card.photo instanceof File || (isEditMode && card.photo && typeof card.photo === 'string');
      return !hasCardInfo || !hasPhoto;
    });

    if (invalidCards.length > 0) {
      setError('Each card must have both card info and a photo');
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('heading', formData.heading.trim());
      formDataToSend.append('subHeading', formData.subHeading.trim());
      formDataToSend.append('pageSection', formData.pageSection);
<<<<<<< HEAD

      formData.cards.forEach((card, index) => {
        formDataToSend.append(`card[${index}][cardInfo]`, card.cardInfo.trim());
        formDataToSend.append(`card[${index}][altImg]`, card.altImg.trim());
        formDataToSend.append(`card[${index}][imgTitle]`, card.imgTitle.trim());
        if (card.photo instanceof File) {
          formDataToSend.append(`card[${index}][photo]`, card.photo);
        } else if (card.photo && typeof card.photo === 'string') {
          formDataToSend.append(`card[${index}][photo]`, card.photo);
=======
      
      formData.cards.forEach((card, index) => {
        // Use dot notation for field names to match controller expectations
        formDataToSend.append(`card[${index}].cardInfo`, card.cardInfo.trim()); // HTML content
        formDataToSend.append(`card[${index}].altImg`, card.altImg.trim());
        formDataToSend.append(`card[${index}].imgTitle`, card.imgTitle.trim());
        
        // Handle photo files with dot notation
        if (card.photo instanceof File) {
          formDataToSend.append(`card[${index}].photo`, card.photo);
        } else if (card.photo && typeof card.photo === 'string') {
          // For existing photos (in edit mode), send the filename
          formDataToSend.append(`card[${index}].photo`, card.photo);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        }
      });

      const url = isEditMode ? `/api/hire-talent/${id}` : '/api/hire-talent';
      const method = isEditMode ? 'put' : 'post';

      const response = await axios[method](url, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(`Data ${isEditMode ? 'updated' : 'submitted'} successfully!`);
<<<<<<< HEAD
      toast.success(`Data ${isEditMode ? 'updated' : 'submitted'} successfully!`);
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      if (!isEditMode) {
        setFormData({
          heading: '',
          subHeading: '',
          cards: [{ cardInfo: '', photo: '', altImg: '', imgTitle: '' }],
          pageSection: 'TeamService',
        });
        setImagePreviews([]);
<<<<<<< HEAD
        setValidationErrors({});
        navigate('/hire-talent-table');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(`Error ${isEditMode ? 'updating' : 'submitting'} data: ${errorMessage}`);
      toast.error(`Error ${isEditMode ? 'updating' : 'submitting'} data: ${errorMessage}`);
    }
  };

  // Render character count
  const renderCharCount = (value, field, index = null) => {
    const plainTextLength = field === 'cardInfo' ? getPlainTextLength(value) : value.length;
    const limits = CHAR_LIMITS[field];
    return (
      <div className="text-sm text-gray-500 mt-1">
        {plainTextLength}/{limits.max} characters
        {plainTextLength < limits.min && plainTextLength > 0 && ` (minimum ${limits.min})`}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-4 font-serif">
        {isEditMode ? 'Edit Hire Talent' : 'Hire Talent Form'}
      </h1>
      {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-md">{error}</div>}
      {success && <div className="text-green-500 mb-4 p-3 bg-green-50 rounded-md">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 font-serif">
            Heading <span className="text-red-500">*</span>
          </label>
=======
        navigate('/hire-talent-table')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Error ${isEditMode ? 'updating' : 'submitting'} data: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Hire Talent' : 'Hire Talent Form'}</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Heading</label>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          <input
            type="text"
            value={formData.heading}
            onChange={(e) => handleInputChange(e.target.value, null, 'heading')}
<<<<<<< HEAD
            className={`mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.heading ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={CHAR_LIMITS.heading.max}
            required
          />
          {renderCharCount(formData.heading, 'heading')}
          {validationErrors.heading && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.heading}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 font-serif">
            Sub Heading <span className="text-red-500">*</span>
          </label>
=======
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sub Heading</label>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          <input
            type="text"
            value={formData.subHeading}
            onChange={(e) => handleInputChange(e.target.value, null, 'subHeading')}
<<<<<<< HEAD
            className={`mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.subHeading ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={CHAR_LIMITS.subHeading.max}
            required
          />
          {renderCharCount(formData.subHeading, 'subHeading')}
          {validationErrors.subHeading && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.subHeading}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 font-serif">
            Page Section <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.pageSection}
            onChange={(e) => handleInputChange(e.target.value, null, 'pageSection')}
            className={`mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationErrors.pageSection ? 'border-red-500' : 'border-gray-300'
            }`}
            required
=======
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Page Section</label>
          <select
            value={formData.pageSection}
            onChange={(e) => handleInputChange(e.target.value, null, 'pageSection')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          >
            <option value="TeamService">Team Service</option>
            <option value="Applications">Applications</option>
            <option value="WhyChoose">Why Choose</option>
            <option value="Technologies">Technologies</option>
          </select>
<<<<<<< HEAD
          {validationErrors.pageSection && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.pageSection}</p>
          )}
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold font-serif">
              Cards ({formData.cards.length}/{MAX_CARDS})
            </h2>
            <button
              type="button"
              onClick={addCard}
              className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
                formData.cards.length >= MAX_CARDS ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={formData.cards.length >= MAX_CARDS}
            >
              Add Another Card
            </button>
          </div>
          {validationErrors.cards && (
            <p className="text-red-500 text-sm mt-2">{validationErrors.cards}</p>
          )}
          {formData.cards.map((card, cardIndex) => (
            <div key={cardIndex} className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium font-serif">Card {cardIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeCard(cardIndex)}
                  className="text-red-500 text-sm disabled:opacity-50 hover:text-red-700 transition-colors duration-200"
                  disabled={formData.cards.length === 1}
                >
                  Remove Card
                </button>
              </div>
              <div className="space-y-4 mt-4 border-l-4 pl-4 border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-serif">
                    Card Info <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 p-4 bg-white border border-gray-300 rounded-md">
                    <ReactQuill
                      value={card.cardInfo}
                      onChange={(value) => handleInputChange(value, cardIndex, 'cardInfo')}
                      modules={quillModules}
                      formats={quillFormats}
                      className={`min-h-[150px] ${validationErrors[`cards[${cardIndex}].cardInfo`] ? 'border-red-500' : ''}`}
                      placeholder="Enter card information..."
                    />
                  </div>
                  {renderCharCount(card.cardInfo, 'cardInfo', cardIndex)}
                  {validationErrors[`cards[${cardIndex}].cardInfo`] && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors[`cards[${cardIndex}].cardInfo`]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-serif">
                    Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(e) => handleImageChange(e, cardIndex)}
                    className={`mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors[`cards[${cardIndex}].photo`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {imagePreviews[cardIndex] && (
                    <div className="mt-2 relative">
                      <img
                        src={imagePreviews[cardIndex]}
                        alt={card.altImg || 'Preview'}
                        className="h-32 w-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const modal = document.createElement('div');
                          modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                          modal.innerHTML = `
                            <div class="bg-white rounded-lg p-6 max-w-2xl w-full">
                              <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg font-semibold font-serif">Image Preview</h3>
                                <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">
                                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              <img src="${imagePreviews[cardIndex]}" alt="${card.altImg || 'Preview'}" class="max-w-full max-h-[80vh] object-contain rounded-md border" />
                            </div>
                          `;
                          document.body.appendChild(modal);
                        }}
                        className="absolute top-2 right-2 bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        title="Preview Image"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {validationErrors[`cards[${cardIndex}].photo`] && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors[`cards[${cardIndex}].photo`]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-serif">Alt Text</label>
                  <input
                    type="text"
                    value={card.altImg}
                    onChange={(e) => handleInputChange(e.target.value, cardIndex, 'altImg')}
                    className={`mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors[`cards[${cardIndex}].altImg`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    maxLength={100}
                  />
                  {validationErrors[`cards[${cardIndex}].altImg`] && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors[`cards[${cardIndex}].altImg`]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-serif">Image Title</label>
                  <input
                    type="text"
                    value={card.imgTitle}
                    onChange={(e) => handleInputChange(e.target.value, cardIndex, 'imgTitle')}
                    className={`mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors[`cards[${cardIndex}].imgTitle`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    maxLength={100}
                  />
                  {validationErrors[`cards[${cardIndex}].imgTitle`] && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors[`cards[${cardIndex}].imgTitle`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
=======
        </div>
        {formData.cards.map((card, cardIndex) => (
          <div key={cardIndex} className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Card {cardIndex + 1}</h2>
              <button
                type="button"
                onClick={() => removeCard(cardIndex)}
                className="text-red-500 text-sm disabled:opacity-50"
                disabled={formData.cards.length === 1}
              >
                Remove Card
              </button>
            </div>
            <div className="space-y-4 mt-4 border-l-4 pl-4 border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Info</label>
                <ReactQuill
                  value={card.cardInfo}
                  onChange={(value) => handleInputChange(value, cardIndex, 'cardInfo')}
                  modules={quillModules}
                  formats={quillFormats}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, cardIndex)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  // required={!isEditMode || !card.photo}
                />
                {imagePreviews[cardIndex] && (
                  <img
                    src={imagePreviews[cardIndex]}
                    alt={card.altImg || 'Preview'}
                    className="mt-2 h-32 w-32 object-cover rounded-md"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Alt Text</label>
                <input
                  type="text"
                  value={card.altImg}
                  onChange={(e) => handleInputChange(e.target.value, cardIndex, 'altImg')}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image Title</label>
                <input
                  type="text"
                  value={card.imgTitle}
                  onChange={(e) => handleInputChange(e.target.value, cardIndex, 'imgTitle')}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addCard}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Another Card
        </button>
        <button
          type="submit"
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        >
          {isEditMode ? 'Update' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default HireTalentForm;