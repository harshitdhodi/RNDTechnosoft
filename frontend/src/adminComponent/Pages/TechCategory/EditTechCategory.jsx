import React, { useState, useEffect } from 'react';
import { Upload, Save, AlertCircle, CheckCircle2, X } from 'lucide-react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditTechCategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/techCategory/${id}`);
        const data = res.data.data || res.data;
        setFormData({
          heading: data.heading || '',
          subheading: data.subheading || '',
          photo: data.photo || '',
          alt: data.alt || '',
          imgTitle: data.imgTitle || ''
        });
        setPreviewUrl(data.photo ? `/api/logo/download/${data.photo}` : '');
      } catch (error) {
        setSubmitStatus('error');
      }
    };
    fetchData();
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
      setFormData(prev => ({
        ...prev,
        photo: file.name // This will be replaced by backend after upload
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
    if (!formData.heading.trim()) newErrors.heading = 'Heading is required';
    if (!formData.subheading.trim()) newErrors.subheading = 'Subheading is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formPayload = new FormData();
      formPayload.append('heading', formData.heading);
      formPayload.append('subheading', formData.subheading);
      formPayload.append('alt', formData.alt);
      formPayload.append('imgTitle', formData.imgTitle);
      if (selectedFile) {
        formPayload.append('photo', selectedFile);
      }
      await axios.put(`/api/techCategory/${id}`, formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSubmitStatus('success');
      setTimeout(() => navigate(-1), 1200); // Go back after success
    //   navigate('/tech-category'); // Redirect to tech category list
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" pt-5 px-4">
      <div className="max-w-5xl ">
        <div className="text-center mb-3">
          <h1 className="text-3xl font-bold text-black mb-2">Edit Tech Category</h1>
        </div>
        {submitStatus === 'success' && (
          <div className="mb-3 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="text-green-400 w-5 h-5" />
            <span className="text-green-300">Tech category updated successfully!</span>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-400 w-5 h-5" />
            <span className="text-red-300">Failed to update tech category. Please try again.</span>
          </div>
        )}
        <form className="space-y-6 w-[80%]" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="heading" className="block text-sm font-semibold text-black mb-2">
              Heading *
            </label>
            <input
              type="text"
              id="heading"
              name="heading"
              value={formData.heading}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-white border rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all ${
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
          <div>
            <label htmlFor="subheading" className="block text-sm font-semibold text-black mb-2">
              Subheading *
            </label>
            <textarea
              id="subheading"
              name="subheading"
              value={formData.subheading}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-3 bg-white border rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-vertical ${
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
          <div className='w-1/4'>
            <label className="block text-sm font-semibold text-black mb-2">
              Photo
            </label>
            {!selectedFile && previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full/2 h-8 object-contain rounded-lg border border-gray-600"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-black rounded-full p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <label
                  htmlFor="photo-upload-change"
                  className="mt-2 inline-flex items-center gap-2 text-sm text-black hover:text-yellow-300 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Change Photo
                  <input
                    type="file"
                    id="photo-upload-change"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label
                htmlFor="photo-upload"
                className={`block border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                  errors.photo ? 'border-red-500' : 'border-gray-600 hover:border-black'
                }`}
              >
                <Upload className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-900 mb-2">Click to upload photo</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <label htmlFor="alt" className="block text-sm font-semibold text-black mb-2">
              Alt Text
            </label>
            <input
              type="text"
              id="alt"
              name="alt"
              value={formData.alt}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="Describe the image for accessibility"
            />
          </div>
          <div>
            <label htmlFor="imgTitle" className="block text-sm font-semibold text-black mb-2">
              Image Title
            </label>
            <input
              type="text"
              id="imgTitle"
              name="imgTitle"
              value={formData.imgTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="Image title attribute"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="md:w-1/2 bg-gradient-to-r font-bold py-4 px-6 rounded-lg bg-slate-700 text-white transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Tech Category
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTechCategoryForm;