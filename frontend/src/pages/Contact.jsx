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
    ipaddress: ''  // Add IP address if necessary
  });

  const navigate = useNavigate()

  useEffect(() => {
    // Extract UTM parameters from URL
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

    // Optionally, fetch the user's IP address
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      // alert('Inquiry submitted successfully!');
      navigate("/thankyou")
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
  };




  return (
    <div className="bg-white p-8 mt-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center">
        <div className="md:w-1/2 pr-8">
          <h1 className="text-4xl font-bold text-yellow-500 mb-6">Rnd.</h1>
          <h2 className="text-3xl font-bold mb-6">Get in touch</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-100 rounded"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-100 rounded"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Company Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-100 rounded"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-100 rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company Size</label>
              <div className="flex space-x-2 ">
                {['1-250', '251-1000', '1000+'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFormData({ ...formData, companySize: size })}
                    className={`px-4 py-2 rounded ${formData.companySize === size ? 'bg-red-200' : 'bg-gray-100'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Active Users</label>
              <div className="flex space-x-2">
                {['<100k+', '>100k+', 'Unknown'].map((users) => (
                  <button
                    key={users}
                    type="button"
                    onClick={() => setFormData({ ...formData, activeUsers: users })}
                    className={`px-4 py-2 rounded ${formData.activeUsers === users ? 'bg-red-200' : 'bg-gray-100'}`}
                  >
                    {users}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Topic</label>
              <select
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full p-2 bg-gray-100 rounded"
              >
                <option>I want to change my plan</option>
                <option>Pricing question</option>
                <option>Product question</option>
                <option>Free Demo</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">How can we help</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 bg-gray-100 rounded"
                rows="4"
              ></textarea>
            </div>
            {/* <div className="text-sm">
              By clicking "Submit" I agree to the <a href="#" className="text-blue-600">Terms of Use</a> and the <a href="#" className="text-blue-600">Privacy Statement</a>
            </div> */}
            <div className="flex items-center space-x-4">
              <button type="submit" className="px-6 py-2 bg-yellow-500 text-white rounded">Submit</button>
              {/* <a href="#" className="text-orange-500">Looking for support? →</a> */}
            </div>
          </form>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          {/* <div className="bg-green-900 rounded-lg p-8 h-full flex items-center justify-center"> */}
          {/* You can add the hand illustration here */}
          {/* <div className="text-white text-6xl">?</div> */}
          {/* </div> */}
          <img src={Inquiry} alt="" />
        </div>
      </div>
      {/* <div className="mt-8 text-sm text-green-900">
        © 2023 Kolm design. All rights reserved
      </div>
      <div className="mt-4 text-sm text-green-900">
        Designed and developed by <a href="https://kolmdesign.com/" className="text-blue-600">Kolm design</a>
      </div> */}
    </div>
  );
};

export default GetInTouch;