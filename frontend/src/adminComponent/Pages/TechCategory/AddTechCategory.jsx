import React, { useState } from 'react';
import { Upload, Save, AlertCircle, CheckCircle2, X } from 'lucide-react';

const AddTechCategoryForm = () => {
  const [formData, setFormData] = useState({
    heading: '',
    subheading: '',
    photo: '',
    alt: '',
    imgTitle: ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      
      // For API submission, you would typically upload the file first
      // and get back a URL, then set that URL in formData.photo
      setFormData(prev => ({
        ...prev,
        photo: file.name // This would be replaced with actual uploaded file URL
      }));
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData(prev => ({
      ...prev,
      photo: ''
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.heading.trim()) {
      newErrors.heading = 'Heading is required';
    }
    
    if (!formData.subheading.trim()) {
      newErrors.subheading = 'Subheading is required';
    }
    
    if (!formData.photo) {
      newErrors.photo = 'Photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // In a real application, you would first upload the file to get a URL
      // const uploadedPhotoUrl = await uploadFile(selectedFile);
      
      const response = await fetch('/api/techCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // photo: uploadedPhotoUrl // Use the actual uploaded file URL
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          heading: '',
          subheading: '',
          photo: '',
          alt: '',
          imgTitle: ''
        });
        setSelectedFile(null);
        setPreviewUrl('');
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-yellow-400/30">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Add Tech Category
            </h1>
            <p className="text-gray-300">
              Create a new technology category entry
            </p>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="text-green-400 w-5 h-5" />
              <span className="text-green-300">Tech category added successfully!</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-red-400 w-5 h-5" />
              <span className="text-red-300">Failed to add tech category. Please try again.</span>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Heading */}
            <div>
              <label htmlFor="heading" className="block text-sm font-semibold text-yellow-400 mb-2">
                Heading *
              </label>
              <input
                type="text"
                id="heading"
                name="heading"
                value={formData.heading}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all ${
                  errors.heading ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter category heading"
              />
              {errors.heading && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.heading}
                </p>
              )}
            </div>

            {/* Subheading */}
            <div>
              <label htmlFor="subheading" className="block text-sm font-semibold text-yellow-400 mb-2">
                Subheading *
              </label>
              <textarea
                id="subheading"
                name="subheading"
                value={formData.subheading}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-vertical ${
                  errors.subheading ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter category subheading or description"
              />
              {errors.subheading && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.subheading}
                </p>
              )}
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-yellow-400 mb-2">
                Photo *
              </label>
              
              {!selectedFile ? (
                <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  errors.photo ? 'border-red-500' : 'border-gray-600 hover:border-yellow-400'
                }`}>
                  <Upload className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-300 mb-2">Click to upload photo</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="mt-2 text-sm text-gray-400">{selectedFile.name}</p>
                </div>
              )}
              
              {errors.photo && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.photo}
                </p>
              )}
            </div>

            {/* Alt Text */}
            <div>
              <label htmlFor="alt" className="block text-sm font-semibold text-yellow-400 mb-2">
                Alt Text
              </label>
              <input
                type="text"
                id="alt"
                name="alt"
                value={formData.alt}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="Describe the image for accessibility"
              />
            </div>

            {/* Image Title */}
            <div>
              <label htmlFor="imgTitle" className="block text-sm font-semibold text-yellow-400 mb-2">
                Image Title
              </label>
              <input
                type="text"
                id="imgTitle"
                name="imgTitle"
                value={formData.imgTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="Image title attribute"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold py-4 px-6 rounded-lg hover:from-yellow-400 hover:to-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Add Tech Category
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTechCategoryForm;