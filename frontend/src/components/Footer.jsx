import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaInstagram, FaGoogle, FaBehance, FaPaperPlane } from 'react-icons/fa';

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [services, setServices] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  
  // Validation states
  const [errors, setErrors] = useState({
    name: '',
    email: ''
  });
  
  const [touched, setTouched] = useState({
    name: false,
    email: false
  });

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 50) return 'Name must be less than 50 characters';
        if (!/^[a-zA-Z\s]*$/.test(value)) return 'Name can only contain letters and spaces';
        return '';
        
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
        
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, formData[name])
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email)
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true
    });

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/newsletter/postnewsletter', {
        name: formData.name,
        email: formData.email
      }, { withCredentials: true });
      
      setMessage(response.data.message);
      setFormData({ name: '', email: '' });
      setTouched({ name: false, email: false });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  // Your existing useEffect hooks and other code remain the same
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await axios.get('/api/footer/getfooter');
        const transformedData = transformIncomingData(response.data);
        setFooterData(transformedData);
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };

    fetchFooterData();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`/api/services/getCategory`, {
          withCredentials: true,
        });
        setServices(response.data.map(item => ({ name: item.category, slug: item.slug })));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await axios.get('/api/logo/footercolor', { withCredentials: true });
        setLogo(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLogos();
  }, []);

  if (!footerData) {
    return null;
  }


  return (
    <footer className="bg-[#F7F4EE] text-black md:px-36 px-2 md:py-10">
      <section className="container mx-auto py-10">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-5">
          {/* First Column */}
          <div className="lg:col-span-1 col-span-3">
            <Link to="/">
              <img
                src={`/api/logo/download/${logo.photo}`}
                alt={logo.alt}
                title={logo.imgtitle}
                className="mb-4 h-16"
              />
            </Link>
            <p className='text-sm text-left text-gray-600'>
              {footerData.description}
            </p>
            <div className="flex space-x-4 mt-4">
              <a href={footerData.linkedinLink} target='_blank' rel='noopener noreferrer' 
                 className="text-gray-600 hover:text-[#f3ca0d] transition-colors duration-300">
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a href={footerData.instagramLink} target='_blank' rel='noopener noreferrer'
                 className="text-gray-600 hover:text-[#f3ca0d] transition-colors duration-300">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href={footerData.googleLink} target='_blank' rel='noopener noreferrer'
                 className="text-gray-600 hover:text-[#f3ca0d] transition-colors duration-300">
                <FaGoogle className="h-6 w-6" />
              </a>
              <a href={footerData.behanceLink} target='_blank' rel='noopener noreferrer'
                 className="text-gray-600 hover:text-[#f3ca0d] transition-colors duration-300">
                <FaBehance className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-md mb-6 uppercase">Services</h4>
            <ul className="space-y-2 ">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    to={`/${service.slug}`} 
                    className="text-gray-600  text-sm cursor-pointer hover:text-[#f3ca0d] transition-colors duration-300"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Column */}
          <div className="col-span-1">
            <h4 className="font-bold text-md mb-6 uppercase">About</h4>
            <ul className="space-y-2">
              {footerData.aboutLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-600 text-sm cursor-pointer hover:text-[#f3ca0d] transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div className="col-span-1">
            <h4 className="font-bold text-md mb-6 uppercase">Legal</h4>
            <ul className="space-y-2">
              {footerData.legalLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    rel='noopener noreferrer' 
                    className="text-gray-600  text-sm cursor-pointer hover:text-[#f3ca0d] transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-2 lg:col-span-2 w-full col-span-3">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h4 className="font-bold text-lg mb-4">Weekly Design Juice</h4>
        <p className="text-gray-600 text-sm mb-4">
          Subscribe to get weekly updates on design trends and inspiration.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-[#f3ca0d] transition-colors duration-300
                ${errors.name && touched.name ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="Your Name"
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-[#f3ca0d] transition-colors duration-300
                ${errors.email && touched.email ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="Your Email"
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-3 bg-[#f3ca0d] text-white rounded-lg hover:bg-[#e3ba00] 
              transition-colors duration-300 flex items-center justify-center space-x-2
              ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            <span>{loading ? 'Subscribing...' : 'Subscribe Now'}</span>
            {!loading && <FaPaperPlane className="w-4 h-4" />}
          </button>
        </form>
        {message && (
          <div className={`mt-3 px-4 py-2 rounded-lg text-sm ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-600' 
              : 'bg-red-50 text-red-600'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div> 
        </div>
      </section>
    </footer>
  );
};

// Function to transform the incoming data
const transformIncomingData = (data) => {
  return {
    logo: "../images/rndlogo.webp",
    description: data.newsletter || "Description not available",
    linkedinLink: data.linkedinLink || "",
    instagramLink: data.instagramLink || "",
    googleLink: data.googleLink || "",
    behanceLink: data.behanceLink || "",
    aboutLinks: [
      { name: "About Us", path: "/aboutus" },
      { name: "Career", path: "/career" },
      { name: "Collaboration", path: "/collabration" },
      { name: "Contact us", path: "/contact" },
      { name: "FAQ", path: "/helpCenter" }
    ],
    legalLinks: [
      { name: "Terms & Conditions", path: "/terms-conditions" },
      { name: "Privacy Policy", path: "/privacy-policy" },
      { name: "Cookies Policy", path: "/cookies-policy" },
      { name: "Templates", path: "/https://codecanyon.net/user/rndtechnosoft/portfolio?sso=1&_gl=1*1x7xliu*_gcl_aw*R0NMLjE3Mjg5ODAzMDYuQ2owS0NRandnck80QmhDMkFSSXNBS1E3elVrdlNjNXJ1YVpfRTEyNkstNFoyZDd3RFRvNWVjSVdJMWRVbXltOTNCQlBnQ3otZXlYbldpd2FBalNnRUFMd193Y0I.*_gcl_au*MTkxMTIzNTE3MS4xNzI4OTExMjg1*_ga*NjI3NDIwNDc1LjE3Mjg5MTEyODU.*_ga_ZKBVC1X78F*MTczMDE3MjI0Ny4zLjEuMTczMDE3MjQxNy4xNi4wLjA.&_ga=2.201880597.585621995.1730172247-627420475.1728911285&_gac=1.186169947.1729055186.Cj0KCQjwgrO4BhC2ARIsAKQ7zUkvSc5ruaZ_E126K-4Z2d7wDTo5ecIWI1dUmym93BBPgCz-eyXnWiwaAjSgEALw_wcB" }
    ]
  };
};

export default Footer;