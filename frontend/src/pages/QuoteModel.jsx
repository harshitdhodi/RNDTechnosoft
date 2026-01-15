import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const QuoteModel = ({ closeModal }) => {
  const { slug } = useParams();
  const [urlParams, setUrlParams] = useState({
    path: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmId: '',
    gclid: '',
    gcidSource: '',
    utmContent: '',
    utmTerm: '',
    ipaddress: ''
  });
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companySize: '',
    activeUsers: '',
    topic: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        return !value.trim() ? 'First name is required' : 
               value.length < 2 ? 'First name must be at least 2 characters' : '';
      case 'lastName':
        return !value.trim() ? 'Last name is required' : 
               value.length < 2 ? 'Last name must be at least 2 characters' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !value.trim() ? 'Email is required' : 
               !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'phone':
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        return !value.trim() ? 'Phone number is required' : 
               !phoneRegex.test(value) ? 'Please enter a valid phone number' : '';
      case 'companySize':
        return !value ? 'Please select company size' : '';
      case 'activeUsers':
        return !value ? 'Please select number of active users' : '';
      case 'topic':
        return !value ? 'Please select a topic' : '';
      case 'message':
        return !value.trim() ? 'Message is required' : 
               value.length < 10 ? 'Message must be at least 10 characters' : '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      if (['firstName', 'lastName', 'email', 'phone', 'companySize', 'activeUsers', 'topic', 'message'].includes(field)) {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUrlParams({
      path: slug || '',
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
      utmId: params.get('utm_id') || '',
      gclid: params.get('gclid') || '',
      gcidSource: params.get('gcid_source') || '',
      utmContent: params.get('utm_content') || '',
      utmTerm: params.get('utm_term') || '',
      ipaddress: ''
    });

    const fetchIP = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        setUrlParams(prevParams => ({ ...prevParams, ipaddress: response.data.ip }));
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    };

    fetchIP();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, formData[name])
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    const dataToSubmit = {
      firstname: formData.firstName,
      lastname: formData.lastName,
      email: formData.email,
      mobileNo: formData.phone,
      path: urlParams.path,
      companysize: formData.companySize,
      activeuser: formData.activeUsers,
      topic: formData.topic,
      message: formData.message,
      utm_source: urlParams.utmSource || '',
      utm_medium: urlParams.utmMedium || '',
      utm_campaign: urlParams.utmCampaign || '',
      utm_id: urlParams.utmId || '',
      gclid: urlParams.gclid || '',
      gcid_source: urlParams.gcidSource || '',
      utm_content: urlParams.utmContent || '',
      utm_term: urlParams.utmTerm || '',
      ipaddress: urlParams.ipaddress || ''
    };

    try {
      await axios.post('/api/inquiries/addInquiry', dataToSubmit);
      navigate("/thankyou");
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white text-black rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
        <div className="flex justify-between items-center pt-4 px-4 sm:px-6 border-b">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Get in touch</h2>
          <button 
            onClick={closeModal} 
            className="text-gray-900 hover:text-gray-700 text-xl sm:text-2xl"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 sm:px-6  space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            <div>
              <label className="block text-sm font-medium mb-1">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-2 bg-gray-100 rounded border ${errors.firstName && touched.firstName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              />
              {errors.firstName && touched.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-2 bg-gray-100 rounded border ${errors.lastName && touched.lastName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              />
              {errors.lastName && touched.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-2 bg-gray-100 rounded border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                onBlur={handleBlur}
                className={`w-full p-2 bg-gray-100 rounded border ${errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              />
              {errors.phone && touched.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company Size *</label>
            <div className="flex flex-wrap gap-2">
              {['1-250', '251-1000', '1000+'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, companySize: size });
                    setTouched(prev => ({ ...prev, companySize: true }));
                    setErrors(prev => ({ ...prev, companySize: '' }));
                  }}
                  className={`px-4 py-2 rounded text-sm ${formData.companySize === size ? 'bg-red-200 text-black' : 'bg-gray-100 text-gray-700'} hover:bg-red-300 transition-colors`}
                >
                  {size}
                </button>
              ))}
            </div>
            {errors.companySize && touched.companySize && (
              <p className="text-red-500 text-xs mt-1">{errors.companySize}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Active Users *</label>
            <div className="flex flex-wrap gap-2">
              {['<100k+', '>100k+', 'Unknown'].map((users) => (
                <button
                  key={users}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, activeUsers: users });
                    setTouched(prev => ({ ...prev, activeUsers: true }));
                    setErrors(prev => ({ ...prev, activeUsers: '' }));
                  }}
                  className={`px-4 py-2 rounded text-sm ${formData.activeUsers === users ? 'bg-red-200 text-black' : 'bg-gray-100 text-gray-700'} hover:bg-red-300 transition-colors`}
                >
                  {users}
                </button>
              ))}
            </div>
            {errors.activeUsers && touched.activeUsers && (
              <p className="text-red-500 text-xs mt-1">{errors.activeUsers}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Topic *</label>
            <select
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2 bg-gray-100 rounded border ${errors.topic && touched.topic ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-500`}
            >
              <option value="">Select a topic</option>
              <option>I want to change my plan</option>
              <option>Pricing question</option>
              <option>Product question</option>
              <option>Free Demo</option>
            </select>
            {errors.topic && touched.topic && (
              <p className="text-red-500 text-xs mt-1">{errors.topic}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">How can we help *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2 bg-gray-100 rounded border ${errors.message && touched.message ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-y`}
              rows="4"
            ></textarea>
            {errors.message && touched.message && (
              <p className="text-red-500 text-xs mt-1">{errors.message}</p>
            )}
          </div>
          <div className="flex justify-start gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 sm:px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 sm:px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm sm:text-base"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteModel;