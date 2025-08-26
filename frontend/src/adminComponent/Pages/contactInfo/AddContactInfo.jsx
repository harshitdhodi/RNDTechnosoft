import { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CreateContactInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imgTitle: "",
    alt: "",
    title: "",
    description: "",
    photo: null,
    type: "",
    address: "",
    phone1: "",
    phone2: "",
    email1: "",
    email2: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState({ show: false, message: "", type: "" });

  // Validation functions
  const validateImage = (file) => {
    if (!file) return "Image is required";
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return "Only JPEG, JPG, PNG, and GIF images are allowed";
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return "Image size must be less than 5MB";
    }
    
    return "";
  };

  const validateText = (value, minLength = 2, maxLength = 100, fieldName = "Field") => {
    if (!value || value.trim() === "") return `${fieldName} is required`;
    
    const trimmedValue = value.trim();
    if (trimmedValue.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters long`;
    }
    if (trimmedValue.length > maxLength) {
      return `${fieldName} must not exceed ${maxLength} characters`;
    }
    
    // Check for special characters (allow only letters, numbers, spaces, and basic punctuation)
    const specialCharPattern = /[^a-zA-Z0-9\s.,'-]/;
    if (specialCharPattern.test(trimmedValue)) {
      return `${fieldName} contains invalid special characters`;
    }
    
    return "";
  };

  const validatePhone = (value, fieldName = "Phone") => {
    if (!value || value.trim() === "") return `${fieldName} is required`;
    
    // Expected format: +91-1234567890
    const phonePattern = /^\+91-\d{10}$/;
    if (!phonePattern.test(value)) {
      return `${fieldName} must be in format +91-1234567890`;
    }
    
    return "";
  };

  const validateEmail = (value, fieldName = "Email") => {
    if (!value || value.trim() === "") return `${fieldName} is required`;
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return `Please enter a valid ${fieldName.toLowerCase()} address`;
    }
    
    return "";
  };

  const validateAddress = (value) => {
    if (!value || value.trim() === "") return "Address is required";
    
    const trimmedValue = value.trim();
    if (trimmedValue.length > 250) {
      return "Address must not exceed 250 characters";
    }
    
    return "";
  };

  // Show toast message
  const showToastMessage = (message, type) => {
    setShowToast({ show: true, message, type });
    setTimeout(() => {
      setShowToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone numbers automatically
    let formattedValue = value;
    if (name === 'phone1' || name === 'phone2') {
      // Remove all non-digits
      const digitsOnly = value.replace(/\D/g, '');
      
      // If user starts typing, add +91- prefix
      if (digitsOnly.length > 0 && !value.startsWith('+91-')) {
        formattedValue = `+91-${digitsOnly.slice(0, 10)}`;
      } else if (value.startsWith('+91-')) {
        const phoneDigits = value.replace('+91-', '').replace(/\D/g, '');
        formattedValue = `+91-${phoneDigits.slice(0, 10)}`;
      }
    }
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleQuillChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      photo: file,
    }));

    // Validate image immediately
    const imageError = validateImage(file);
    setErrors(prev => ({ ...prev, photo: imageError }));

    // Create preview only if valid
    if (file && !imageError) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.type) newErrors.type = "Type is required";
    
    newErrors.imgTitle = validateText(formData.imgTitle, 2, 100, "Image Title");
    newErrors.alt = validateText(formData.alt, 2, 100, "Alt Text");
    newErrors.photo = validateImage(formData.photo);

    // Conditional validation based on type
    switch (formData.type) {
      case "Head Office Address":
      case "Sales Office Address":
        newErrors.address = validateAddress(formData.address);
        break;
      case "Phone No":
        newErrors.phone1 = validatePhone(formData.phone1, "Phone 1");
        if (formData.phone2) {
          newErrors.phone2 = validatePhone(formData.phone2, "Phone 2");
        }
        break;
      case "Email":
        newErrors.email1 = validateEmail(formData.email1, "Email 1");
        if (formData.email2) {
          newErrors.email2 = validateEmail(formData.email2, "Email 2");
        }
        break;
    }

    // Optional title validation
    if (formData.title) {
      newErrors.title = validateText(formData.title, 2, 150, "Title");
    }

    // Remove empty errors
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToastMessage("Please fix all validation errors before submitting", "error");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      await axios.post(`/api/contactInfo/addContactInfo`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      showToastMessage("Contact information created successfully!", "success");
      setTimeout(() => {
        navigate(`/contactinfo`);
      }, 1500);
    } catch (error) {
      console.error("Error creating contact info:", error);
      showToastMessage(
        error.response?.data?.message || "Error creating contact information. Please try again.", 
        "error"
      );
    }
  };

  const renderConditionalFields = () => {
    switch (formData.type) {
      case "Head Office Address":
      case "Sales Office Address":
        return (
          <div className="mb-4">
            <label className="block mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`border rounded w-full p-2 ${errors.address ? 'border-red-500' : ''}`}
              rows="3"
              maxLength="250"
              required
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.address.length}/250 characters
            </div>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>
        );
      case "Phone No":
        return (
          <>
            <div className="mb-4">
              <label className="block mb-1">
                Phone 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone1"
                value={formData.phone1}
                onChange={handleChange}
                className={`border rounded w-full p-2 ${errors.phone1 ? 'border-red-500' : ''}`}
                placeholder="+91-1234567890"
                required
              />
              {errors.phone1 && (
                <p className="text-red-500 text-sm mt-1">{errors.phone1}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-1">Phone 2</label>
              <input
                type="text"
                name="phone2"
                value={formData.phone2}
                onChange={handleChange}
                className={`border rounded w-full p-2 ${errors.phone2 ? 'border-red-500' : ''}`}
                placeholder="+91-1234567890"
              />
              {errors.phone2 && (
                <p className="text-red-500 text-sm mt-1">{errors.phone2}</p>
              )}
            </div>
          </>
        );
      case "Email":
        return (
          <>
            <div className="mb-4">
              <label className="block mb-1">
                Email 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email1"
                value={formData.email1}
                onChange={handleChange}
                className={`border rounded w-full p-2 ${errors.email1 ? 'border-red-500' : ''}`}
                required
              />
              {errors.email1 && (
                <p className="text-red-500 text-sm mt-1">{errors.email1}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-1">Email 2</label>
              <input
                type="email"
                name="email2"
                value={formData.email2}
                onChange={handleChange}
                className={`border rounded w-full p-2 ${errors.email2 ? 'border-red-500' : ''}`}
              />
              {errors.email2 && (
                <p className="text-red-500 text-sm mt-1">{errors.email2}</p>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Toast Message */}
      {showToast.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          showToast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {showToast.message}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Create Contact Info</h1>
      <form onSubmit={handleSubmit}>
        {/* Type Field */}
        <div className="mb-4">
          <label className="block mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`border rounded w-full p-2 ${errors.type ? 'border-red-500' : ''}`}
            required
          >
            <option value="">Select Type</option>
            <option value="Phone No">Phone No</option>
            <option value="Email">Email</option>
            <option value="Head Office Address">Head Office Address</option>
            <option value="Sales Office Address">Sales Office Address</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`border rounded w-full p-2 ${errors.title ? 'border-red-500' : ''}`}
            maxLength="150"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1">
            Photo <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handleFileChange}
            className={`border rounded w-full p-2 ${errors.photo ? 'border-red-500' : ''}`}
            required
          />
          {errors.photo && (
            <p className="text-red-500 text-sm mt-1">{errors.photo}</p>
          )}
          {imagePreview && !errors.photo && (
            <img src={imagePreview} alt="Selected" className="mt-2 w-32 h-32 object-cover border rounded" />
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1">
            Image Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="imgTitle"
            value={formData.imgTitle}
            onChange={handleChange}
            className={`border rounded w-full p-2 ${errors.imgTitle ? 'border-red-500' : ''}`}
            maxLength="100"
            required
          />
          {errors.imgTitle && (
            <p className="text-red-500 text-sm mt-1">{errors.imgTitle}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1">
            Alt Text <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="alt"
            value={formData.alt}
            onChange={handleChange}
            className={`border rounded w-full p-2 ${errors.alt ? 'border-red-500' : ''}`}
            maxLength="100"
            required
          />
          {errors.alt && (
            <p className="text-red-500 text-sm mt-1">{errors.alt}</p>
          )}
        </div>

        {renderConditionalFields()}

        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Create Contact Info
        </button>
      </form>
    </div>
  );
};

export default CreateContactInfo;