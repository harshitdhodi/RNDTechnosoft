import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from 'react-icons/fa';

const quillStyles = `
  .ql-container {
    background-color: white;
    border-radius: 0.25rem;
    min-height: 150px;
  }
  .ql-editor {
    min-height: 100px;
    font-size: 1rem;
    line-height: 1.5;
  }
  .ql-toolbar {
    border-radius: 0.25rem 0.25rem 0 0;
  }
  .ql-container .ql-editor p,
  .ql-container .ql-editor h1,
  .ql-container .ql-editor h2,
  .ql-container .ql-editor h3 {
    margin-bottom: 0.5rem;
  }
  .image-preview {
    max-width: 150px;
    max-height: 150px;
    object-fit: cover;
    margin-top: 0.5rem;
    border-radius: 0.25rem;
  }
`;

const VALIDATION_RULES = {
  heading: { min: 10, max: 70, message: 'Heading must be between 25-70 characters' },
  subHeading: { min: 25, max: 250, message: 'Subheading must be between 50-250 characters' },
  title: { min: 15, max: 80, message: 'Title must be between 15-50 characters' },
  details: { min: 50, max: 500, message: 'Details must be between 50-170 characters' },
  altName: { min: 5, max: 50, message: 'Alt text must be between 5-50 characters' },
  imgTitle: { min: 5, max: 50, message: 'Image title must be between 5-50 characters' }
};

const getRemainingChars = (value, field) => {
  const rule = VALIDATION_RULES[field];
  if (!rule) return { remaining: 0, isValid: true };
  
  const length = value?.length || 0;
  return {
    remaining: rule.max - length,
    isValid: length >= rule.min && length <= rule.max
  };
};

const validateField = (value, field) => {
  const rule = VALIDATION_RULES[field];
  if (!rule) return { isValid: true, message: '' };
  
  const length = value?.length || 0;
  const isValid = length >= rule.min && length <= rule.max;
  
  return {
    isValid,
    message: isValid ? '' : rule.message
  };
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {title}
          </h3>
        )}
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateIndustrySecData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [formData, setFormData] = useState({
    type: "",
    heading: "",
    subHeading: "",
    category: "",
    cards: [{ title: "", details: "", photo: "", altName: "", imgTitle: "" }]
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);

  const pageSectionOptions = [
    { value: "info", label: "Information" },
    { value: "applications", label: "Applications" },
    { value: "software-service", label: "Software Service" },
    { value: "case-studies", label: "Case Studies" },
    // { value: "build", label: "Build" }
  ];

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      ["link"],
      ["clean"]
    ]
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "color",
    "background",
    "link"
  ];

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await axios.get("/api/industries/getAll", {
          headers: {
            // Add authentication headers if required
          }
        });
        console.log('API Response:', res.data);
        setIndustries(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching industries:', err.response || err.message);
        setError(`Failed to load industry categories: ${err.response?.data?.error || err.message}`);
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const fetchIndustrySecData = async () => {
        setIsLoading(true);
        try {
          const res = await axios.get(`/api/caseStudy/${id}`);
          const industryData = res.data.data || {};
          setFormData({
            type: industryData.type || "",
            heading: industryData.heading || "",
            subHeading: industryData.subHeading || "",
            category: industryData.category?._id || "",
            cards: industryData.card?.length
              ? industryData.card.map(card => ({
                  title: card.title || "",
                  details: card.details || "",
                  photo: card.photo || "",
                  altName: card.altName || "",
                  imgTitle: card.imgTitle || ""
                }))
              : [{ title: "", details: "", photo: "", altName: "", imgTitle: "" }]
          });
          setImagePreviews(
            industryData.card?.map(card =>
              card.photo ? `/api/logo/download/${card.photo}` : ""
            ) || []
          );
        } catch (err) {
          setError("Failed to load industry section data.");
          toast.error("Failed to load industry section data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchIndustrySecData();
    }
  }, [id, isEditMode]);

  const handleInputChange = (value, cardIndex, field) => {
    const updatedFormData = { ...formData };
    if (["type", "heading", "subHeading", "category"].includes(field)) {
      updatedFormData[field] = value;
      // Validate main form fields
      if (touched[field]) {
        const { isValid, message } = validateField(value, field);
        setFieldErrors(prev => ({
          ...prev,
          [field]: isValid ? '' : message
        }));
      }
    } else {
      updatedFormData.cards[cardIndex][field] = value;
      // Validate card fields
      if (touched[`${field}-${cardIndex}`]) {
        const { isValid, message } = validateField(value, field);
        setFieldErrors(prev => ({
          ...prev,
          [`${field}-${cardIndex}`]: isValid ? '' : message
        }));
      }
    }
    setFormData(updatedFormData);
  };

  const handleBlur = (field, cardIndex = null) => {
    const fieldKey = cardIndex !== null ? `${field}-${cardIndex}` : field;
    setTouched(prev => ({ ...prev, [fieldKey]: true }));
    
    const value = cardIndex !== null 
      ? formData.cards[cardIndex][field]
      : formData[field];
      
    const { isValid, message } = validateField(value, field);
    setFieldErrors(prev => ({
      ...prev,
      [fieldKey]: isValid ? '' : message
    }));
  };

  const renderCharacterCounter = (value, field, cardIndex = null) => {
    const fieldKey = cardIndex !== null ? `${field}-${cardIndex}` : field;
    const { remaining, isValid } = getRemainingChars(value, field);
    const showError = touched[fieldKey] && !isValid;
    
    return (
      <div className={`mt-1 text-xs ${showError ? 'text-red-500' : 'text-gray-500'}`}>
        {value?.length || 0}/{VALIDATION_RULES[field]?.max || '∞'} characters
        {showError && (
          <div className="text-red-500">{fieldErrors[fieldKey]}</div>
        )}
      </div>
    );
  };

  const handleImageChange = (e, cardIndex) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
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
      toast.success("Image selected successfully.");
    } else {
      setError("Please upload a valid image file.");
      toast.error("Please upload a valid image file.");
    }
  };

  const handleRemoveClick = (cardIndex) => {
    // Check if type is software-service and validate card count after removal
    if (formData.type === 'software-service') {
      const currentCardCount = formData.cards.length;
      const newCardCount = currentCardCount - 1;
      
      // Only prevent removal if it would leave us with 1, 4, or 7 cards
      if (newCardCount === 1 || newCardCount === 4 || newCardCount === 7) {
        toast.error("For Software Service, you can only have 3, 6, or 9 cards");
        return;
      }
    }

    if (formData.cards.length <= 1) {
      toast.error("At least one card is required");
      return;
    }
    setCardToDelete(cardIndex);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (cardToDelete === null) return;
    
    const updatedFormData = { ...formData };
    updatedFormData.cards.splice(cardToDelete, 1);
    setFormData(updatedFormData);
    
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(cardToDelete, 1);
    setImagePreviews(updatedPreviews);
    
    setShowDeleteModal(false);
    setCardToDelete(null);
    toast.success("Card removed successfully.");
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCardToDelete(null);
  };

  const addCard = () => {
    // Check if type is software-service and validate card count
    if (formData.type === 'software-service') {
      const currentCardCount = formData.cards.length;
      
      // Allow adding cards until we reach the next valid count (3, 6, or 9)
      if (currentCardCount >= 9) {
        toast.error("Maximum 9 cards allowed for Software Service type");
        return;
      }
      
      // Allow adding if we're below 3, or between 3-5, or between 6-8
      const canAddMore = currentCardCount < 3 || 
                        (currentCardCount >= 3 && currentCardCount < 6) ||
                        (currentCardCount >= 6 && currentCardCount < 9);
      
      if (!canAddMore) {
        toast.error("Maximum cards reached for this section");
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      cards: [...prev.cards, { title: "", details: "", photo: "", altName: "", imgTitle: "" }]
    }));
    setImagePreviews(prev => [...prev, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Mark all fields as touched to show all validation errors
    const newTouched = {};
    
    // Mark main form fields as touched
    ['heading', 'subHeading'].forEach(field => {
      newTouched[field] = true;
    });
    
    // Mark all card fields as touched
    formData.cards.forEach((_, index) => {
      ['title', 'details', 'altName', 'imgTitle'].forEach(field => {
        newTouched[`${field}-${index}`] = true;
      });
    });
    
    setTouched(newTouched);

    // Validate all fields
    let hasErrors = false;
    const newFieldErrors = {};

    // Validate main form fields
    ['heading', 'subHeading'].forEach(field => {
      const { isValid, message } = validateField(formData[field], field);
      if (!isValid) {
        newFieldErrors[field] = message;
        hasErrors = true;
      }
    });

    // Validate card fields
    formData.cards.forEach((card, index) => {
      ['title', 'details', 'altName', 'imgTitle'].forEach(field => {
        // Only validate required fields if they have content
        if (card[field] || field === 'title' || field === 'details') {
          const { isValid, message } = validateField(card[field], field);
          if (!isValid) {
            newFieldErrors[`${field}-${index}`] = message;
            hasErrors = true;
          }
        }
      });
    });

    // Required field validations
    if (!formData.type) {
      setError("Please select a type");
      setIsLoading(false);
      return;
    }
    
    if (!formData.heading) {
      newFieldErrors['heading'] = 'Heading is required';
      hasErrors = true;
    }
    
    if (!formData.category) {
      setError("Please select an industry category");
      setIsLoading(false);
      return;
    }

    // Validate that all cards have both title and details if either is filled
    const invalidCards = formData.cards.filter(card => {
      const hasTitle = card.title.trim() !== "";
      const hasDetails = card.details.trim() !== "";
      return (hasTitle && !hasDetails) || (!hasTitle && hasDetails);
    });

    if (invalidCards.length > 0) {
      invalidCards.forEach((_, index) => {
        if (!formData.cards[index].title.trim()) {
          newFieldErrors[`title-${index}`] = 'Title is required when details are provided';
        }
        if (!formData.cards[index].details.trim()) {
          newFieldErrors[`details-${index}`] = 'Details are required when title is provided';
        }
      });
      hasErrors = true;
    }

    // Validate software-service card count
    if (formData.type === 'software-service') {
      const currentCardCount = formData.cards.length;
      const isValidCount = currentCardCount === 3 || currentCardCount === 6 || currentCardCount === 9;
      
      if (!isValidCount) {
        setError("Software Service must have exactly 3, 6, or 9 cards before submitting");
        toast.error("Software Service must have exactly 3, 6, or 9 cards before submitting");
        setIsLoading(false);
        return;
      }
    }

    if (hasErrors) {
      setFieldErrors(newFieldErrors);
      setIsLoading(false);
      
      // Find and show the first error message
      const firstError = Object.values(newFieldErrors)[0];
      if (firstError) {
        setError(firstError);
      } else {
        setError('Please fix the validation errors before submitting.');
      }
      
      // Scroll to the first error
      setTimeout(() => {
        const firstErrorField = document.querySelector('.border-red-500');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      return;
    }

    // Validate only non-empty cards
    const validCards = formData.cards.filter(card => {
      const hasTitle = card.title.trim() !== "";
      const hasDetails = card.details.trim() !== "";
      return hasTitle || hasDetails; // keep cards that have something filled
    });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("type", formData.type.trim());
      formDataToSend.append("heading", formData.heading.trim());
      formDataToSend.append("subHeading", formData.subHeading.trim());
      formDataToSend.append("category", formData.category);

      // ✅ Append only valid cards
      validCards.forEach((card, index) => {
        formDataToSend.append(`card[${index}].title`, card.title.trim());
        formDataToSend.append(`card[${index}].details`, card.details.trim());
        if (card.photo instanceof File) {
          formDataToSend.append(`card[${index}].photo`, card.photo);
        } else if (isEditMode && card.photo) {
          formDataToSend.append(`card[${index}].photo`, card.photo);
        }
        formDataToSend.append(`card[${index}].altName`, card.altName.trim());
        formDataToSend.append(`card[${index}].imgTitle`, card.imgTitle.trim());
      });

      const url = isEditMode ? `/api/caseStudy/${id}` : "/api/caseStudy";
      const method = isEditMode ? "put" : "post";

      await axios[method](url, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(`Data ${isEditMode ? "updated" : "submitted"} successfully!`);

      setSuccess(`Data ${isEditMode ? "updated" : "submitted"} successfully!`);
      if (!isEditMode) {
        setFormData({
          type: "",
          heading: "",
          subHeading: "",
          category: "",
          cards: [{ title: "", details: "", photo: "", altName: "", imgTitle: "" }],
        });
        setImagePreviews([]);
        navigate("/industry-data");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        `Error ${isEditMode ? "updating" : "submitting"} data.`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md relative">
      <ToastContainer position="top-right" autoClose={5000} />
      <style>{quillStyles}</style>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Card?"
        message={
          cardToDelete !== null && formData.cards[cardToDelete]?.title
            ? `Are you sure you want to delete "${formData.cards[cardToDelete].title}"? This action cannot be undone.`
            : "Are you sure you want to delete this card? This action cannot be undone."
        }
        confirmText="Delete Card"
      />

      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? "Edit Industry Section Data" : "Create Industry Section Data"}
      </h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      {isLoading && <div className="text-center">Loading...</div>}
      {!isLoading && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Type <span className="text-red-500">*</span></label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange(e.target.value, null, "type")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isLoading}
            >
              <option value="">Select Type</option>
              {pageSectionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Industry Category <span className="text-red-500">*</span></label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange(e.target.value, null, "category")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isLoading}
            >
              <option value="">Select Industry</option>
              {industries.length > 0 ? (
                industries.map(industry => (
                  <option key={industry._id} value={industry._id}>
                    {industry.category}
                  </option>
                ))
              ) : (
                <option disabled>No industries available</option>
              )}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Heading <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.heading}
              onChange={(e) => handleInputChange(e.target.value, null, 'heading')}
              onBlur={() => handleBlur('heading')}
              className={`mt-1 block w-full rounded-md border ${
                fieldErrors['heading'] ? 'border-red-500' : 'border-gray-300'
              } shadow-sm p-2`}
              required
              disabled={isLoading}
            />
            {renderCharacterCounter(formData.heading, 'heading')}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Subheading</label>
            <textarea
              value={formData.subHeading}
              onChange={(e) => handleInputChange(e.target.value, null, 'subHeading')}
              onBlur={() => handleBlur('subHeading')}
              className={`mt-1 block w-full rounded-md border ${
                fieldErrors['subHeading'] ? 'border-red-500' : 'border-gray-300'
              } shadow-sm p-2`}
              rows="4"
              disabled={isLoading}
            />
            {renderCharacterCounter(formData.subHeading, 'subHeading')}
          </div>
          {formData.cards.map((card, cardIndex) => (
            <div key={cardIndex} className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Card {cardIndex + 1}</h2>
                <button
                  type="button"
                  onClick={() => handleRemoveClick(cardIndex)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={isLoading}
                >
                  <FaTrash className="mr-1.5 h-3.5 w-3.5" />
                  Remove Card
                </button>
              </div>
              <div className="space-y-4 mt-4 border-l-4 pl-4 border-gray-200">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleInputChange(e.target.value, cardIndex, 'title')}
                    onBlur={() => handleBlur('title', cardIndex)}
                    className={`mt-1 block w-full rounded-md border ${
                      fieldErrors[`title-${cardIndex}`] ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm p-2`}
                    required
                    disabled={isLoading}
                  />
                  {renderCharacterCounter(card.title, 'title', cardIndex)}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Details <span className="text-red-500">*</span></label>
                  <ReactQuill
                    value={card.details}
                    onChange={(value) => handleInputChange(value, cardIndex, 'details')}
                    onBlur={() => handleBlur('details', cardIndex)}
                    modules={quillModules}
                    formats={quillFormats}
                    className="mt-1"
                    readOnly={isLoading}  
                  />
                  {renderCharacterCounter(card.details, 'details', cardIndex)}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, cardIndex)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    disabled={isLoading}
                  />
                  {imagePreviews[cardIndex] && (
                    <img
                      src={imagePreviews[cardIndex]}
                      alt={card.altName || `Card ${cardIndex + 1}`}
                      className="image-preview"
                    />
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Alt Text</label>
                  <input
                    type="text"
                    value={card.altName}
                    onChange={(e) => handleInputChange(e.target.value, cardIndex, 'altName')}
                    onBlur={() => handleBlur('altName', cardIndex)}
                    className={`mt-1 block w-full rounded-md border ${
                      fieldErrors[`altName-${cardIndex}`] ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm p-2`}
                    disabled={isLoading}
                  />
                  {renderCharacterCounter(card.altName, 'altName', cardIndex)}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Image Title</label>
                  <input
                    type="text"
                    value={card.imgTitle}
                    onChange={(e) => handleInputChange(e.target.value, cardIndex, 'imgTitle')}
                    onBlur={() => handleBlur('imgTitle', cardIndex)}
                    className={`mt-1 block w-full rounded-md border ${
                      fieldErrors[`imgTitle-${cardIndex}`] ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm p-2`}
                    disabled={isLoading}
                  />
                  {renderCharacterCounter(card.imgTitle, 'imgTitle', cardIndex)}
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-start space-x-3">
            <button
            type="button"
            onClick={addCard}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isLoading}
          >
            Add Another Card
          </button>
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-green-300"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : isEditMode ? "Update" : "Submit"}
          </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateIndustrySecData;