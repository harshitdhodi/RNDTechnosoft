import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Inquiry from "../assets/inquiry.svg"
import { useNavigate } from 'react-router-dom';

const GetInTouch = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companySize: '',
    activeUsers: '',
    topic: '',
    message: '',
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

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  // Validation rules
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

  // Validate all fields
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
    const urlParams = new URLSearchParams(window.location.search);
    setFormData(prevData => ({
      ...prevData,
      utmSource: urlParams.get('utm_source') || '',
      utmMedium: urlParams.get('utm_medium') || '',
      utmCampaign: urlParams.get('utm_campaign') || '',
      utmId: urlParams.get('utm_id') || '',
      gclid: urlParams.get('gclid') || '',
      gcidSource: urlParams.get('gcid_source') || '',
      utmContent: urlParams.get('utm_content') || '',
      utmTerm: urlParams.get('utm_term') || ''
    }));

    const fetchIP = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        setFormData(prevData => ({ ...prevData, ipaddress: response.data.ip }));
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    };

    fetchIP();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate field on change if it's been touched
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
    
    // Mark all fields as touched
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
      companysize: formData.companySize,
      activeuser: formData.activeUsers,
      topic: formData.topic,
      message: formData.message,
      utm_source: formData.utmSource || '',
      utm_medium: formData.utmMedium || '',
      utm_campaign: formData.utmCampaign || '',
      utm_id: formData.utmId || '',
      gclid: formData.gclid || '',
      gcid_source: formData.gcidSource || '',
      utm_content: formData.utmContent || '',
      utm_term: formData.utmTerm || '',
      ipaddress: formData.ipaddress || ''
    };

    try {
      await axios.post('/api/inquiries/addInquiry', dataToSubmit);
      navigate("/thankyou");
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
  };

  return (
    <div className="bg-white p-8 sm:mt-24 mt-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center">
        <div className="md:w-1/2 px-8">
          <h1 className="text-4xl font-bold text-yellow-500 mb-6">Rnd.</h1>
          <h2 className="text-3xl font-bold mb-6">Get in touch</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 bg-gray-100 rounded ${errors.firstName && touched.firstName ? 'border-2 border-red-500' : ''}`}
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 bg-gray-100 rounded ${errors.lastName && touched.lastName ? 'border-2 border-red-500' : ''}`}
                />
                {errors.lastName && touched.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Company Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 bg-gray-100 rounded ${errors.email && touched.email ? 'border-2 border-red-500' : ''}`}
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  onBlur={handleBlur}
                  className={`w-full p-2 bg-gray-100 rounded ${errors.phone && touched.phone ? 'border-2 border-red-500' : ''}`}
                />
                {errors.phone && touched.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company Size *</label>
              <div className="flex space-x-2">
                {['1-250', '251-1000', '1000+'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, companySize: size });
                      setTouched(prev => ({ ...prev, companySize: true }));
                      setErrors(prev => ({ ...prev, companySize: '' }));
                    }}
                    className={`px-4 py-2 rounded ${formData.companySize === size ? 'bg-red-200' : 'bg-gray-100'}`}
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
              <div className="flex space-x-2">
                {['<100k+', '>100k+', 'Unknown'].map((users) => (
                  <button
                    key={users}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, activeUsers: users });
                      setTouched(prev => ({ ...prev, activeUsers: true }));
                      setErrors(prev => ({ ...prev, activeUsers: '' }));
                    }}
                    className={`px-4 py-2 rounded ${formData.activeUsers === users ? 'bg-red-200' : 'bg-gray-100'}`}
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
                className={`w-full p-2 bg-gray-100 rounded ${errors.topic && touched.topic ? 'border-2 border-red-500' : ''}`}
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
                className={`w-full p-2 bg-gray-100 rounded ${errors.message && touched.message ? 'border-2 border-red-500' : ''}`}
                rows="4"
              ></textarea>
              {errors.message && touched.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button type="submit" className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <img src={Inquiry} alt="" />
        </div>
      </div>
    </div>
  );
};

export default GetInTouch;