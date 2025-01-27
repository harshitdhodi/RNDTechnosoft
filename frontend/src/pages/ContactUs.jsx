import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
  const navigate = useNavigate();
  
  const [contactInfos, setContactInfos] = useState([]);
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [photo, setPhoto] = useState(null);
  const [alt, setAlt] = useState("");
  const [imgTitle, setImgTitle] = useState("");
  const [headOfficeAddress, setHeadOfficeAddress] = useState('');
  const [salesOfficeAddress, setSalesOfficeAddress] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [clientIp, setClientIp] = useState('');
  const [utmParams, setUtmParams] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  // Validation functions
  const validateName = (value) => {
    if (!value.trim()) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s]*$/.test(value)) return 'Name should only contain letters';
    return '';
  };

  const validateEmail = (value) => {
    if (!value.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (value) => {
    if (!value.trim()) return 'Phone number is required';
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(value)) return 'Phone number must be exactly 10 digits';
    return '';
  };

  const validateSubject = (value) => {
    if (!value.trim()) return 'Subject is required';
    if (value.length < 5) return 'Subject must be at least 5 characters';
    return '';
  };

  const validateMessage = (value) => {
    if (!value.trim()) return 'Message is required';
    if (value.length < 10) return 'Message must be at least 10 characters';
    return '';
  };

  useEffect(() => {
    const fetchClientIp = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        setClientIp(response.data.ip);
      } catch (error) {
        console.error('Error fetching IP address', error);
      }
    };

    fetchClientIp();

    const params = new URLSearchParams(window.location.search);
    setUtmParams({
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_id: params.get('utm_id') || '',
      gclid: params.get('gclid') || '',
      gcid_source: params.get('gcid_source') || '',
      utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || '',
    });
  }, []);

  useEffect(() => {
    axios.get(`/api/contactInfo/getcontactinfo`, { withCredentials: true })
      .then((response) => {
        const fetchedContactInfos = response.data.data || response.data;
        setContactInfos(fetchedContactInfos);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          navigate('/login');
        }
      });
  }, [navigate]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get('/api/address/getAddress', { withCredentials: true });
        const address = response.data;
        setHeadOfficeAddress(address.headOfficeAddress || '');
        setSalesOfficeAddress(address.salesOfficeAddress || '');
        setLocation(address.location || '');
      } catch (error) {
        console.error(error);
      }
    };

    fetchAddress();
  }, []);

  useEffect(() => {
    const fetchHeadings = async () => {
      try {
        const response = await axios.get('/api/pageHeading/heading?pageType=contactus', { withCredentials: true });
        const { heading, subheading, photo, alt, imgTitle } = response.data;
        setHeading(heading || '');
        setSubheading(subheading || '');
        setPhoto(photo || null);
        setAlt(alt || '');
        setImgTitle(imgTitle || '');
      } catch (error) {
        console.error(error);
      }
    };

    fetchHeadings();
  }, []);

  const handleInputChange = (e, validator) => {
    const { name, value } = e.target;
    
    switch(name) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phone':
        if (/^\d*$/.test(value)) {
          setPhone(value);
        }
        break;
      case 'subject':
        setSubject(value);
        break;
      case 'message':
        setMessage(value);
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: validator(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      phone: validatePhone(phone),
      subject: validateSubject(subject),
      message: validateMessage(message)
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post('/api/contactinquiries/createcontactInquiry', {
        name,
        email,
        phone,
        subject,
        message,
        ipaddress: clientIp,
        ...utmParams,
      });

      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      navigate("/thankyou");
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.error : 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative">
        <img src={`/api/logo/download/${photo}`} alt={alt} title={imgTitle} className="w-full h-[55vh] object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center flex-col gap-8 pt-16 md:pt-32">
          <h1 className="text-white text-4xl md:text-7xl font-serif capitalize">{heading}</h1>
          <p className="text-xl md:text-2xl text-white text-center">{subheading}</p>
        </div>
      </div>

      <div className='py-16'>
        <div className="w-[90%] mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 justify-center gap-8">
            {contactInfos.map((item, index) => (
              <div key={index} className='rounded-md shadow-md px-2 py-2'>
                <div className="flex gap-2 items-center">
                  <img src={`/api/icon/download/${item.photo}`} alt={`${item.title} icon`} className="w-10 h-10 md:w-20 md:h-20" />
                  <div>
                    {item.type === 'Head Office Address' ? (
                      <>
                        <h3 className="font-bold">{item.title}</h3>
                        <a href={headOfficeAddress} target='_blank' rel="noopener noreferrer" className='hover:text-blue-500'>{item.address}</a>
                      </>
                    ) : item.type === 'Phone No' ? (
                      <>
                        <h3 className="font-bold">{item.title}</h3>
                        <a href={`tel:${item.phone1}`} className='hover:text-blue-500'>{item.phone1}</a><br />
                        {item.phone2 && <a href={`tel:${item.phone2}`} className='hover:text-blue-500'>{item.phone2}</a>}
                      </>
                    ) : item.type === 'Email' ? (
                      <>
                        <h3 className="font-bold">{item.title}</h3>
                        <a href={`mailto:${item.email1}`} className='hover:text-blue-500'>{item.email1}</a><br />
                        {item.email2 && <a href={`mailto:${item.email2}`} className='hover:text-blue-500'>{item.email2}</a>}
                      </>
                    ) : (
                      <>
                        <h3 className="font-bold">{item.title}</h3>
                        <a href={salesOfficeAddress} target='_blank' rel="noopener noreferrer" className='hover:text-blue-500'>{item.address}</a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[90%] mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-2xl mb-4 text-black font-serif">Get in Touch</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-2 w-full">
                  <div className="w-full">
                    <label htmlFor="name" className="block mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`w-full p-2 border rounded focus:border-yellow-500 outline-none ${
                        errors.name ? 'border-red-500' : ''
                      }`}
                      value={name}
                      onChange={(e) => handleInputChange(e, validateName)}
                      required
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div className="w-full">
                    <label htmlFor="email" className="block mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`w-full p-2 border rounded focus:border-yellow-500 outline-none ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      value={email}
                      onChange={(e) => handleInputChange(e, validateEmail)}
                      required
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block mb-1">Mobile</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`w-full p-2 border rounded focus:border-yellow-500 outline-none ${
                      errors.phone ? 'border-red-500' : ''
                    }`}
                    value={phone}
                    onChange={(e) => handleInputChange(e, validatePhone)}
                    maxLength={10}
                    required
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="subject" className="block mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className={`w-full p-2 border rounded focus:border-yellow-500 outline-none ${
                      errors.subject ? 'border-red-500' : ''
                    }`}
                    value={subject}
                    onChange={(e) => handleInputChange(e, validateSubject)}
                    required
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="block mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    className={`w-full p-2 border rounded focus:border-yellow-500 outline-none ${
                      errors.message ? 'border-red-500' : ''
                    }`}
                    value={message}
                    onChange={(e) => handleInputChange(e, validateMessage)}
                    required
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center"
                  disabled={isSubmitting || Object.values(errors).some(error => error !== '')}
                >
                  <Send className="mr-2" size={16} />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                {errorMessage && (
                  <p className="text-red-500 mt-2">{errorMessage}</p>
                )}
              </form>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl mb-4 text-black font-serif">Our Location</h2>
              <iframe
                src={location}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Location map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;