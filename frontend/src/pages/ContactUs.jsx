import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import contactBanner from '../assets/contact-banner.jpg'; // Corrected import
// import Call from '../assets/call.gif';
// import Email from '../assets/email.gif';
// import Location from '../assets/location.gif';
// import Enterprice from '../assets/enterprise.gif';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const ContactUs = () => {
  const [contactInfos, setContactInfos] = useState([]);
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [photo, setPhoto] = useState(null)
  const [alt, setAlt] = useState("")
  const [imgTitle, setImgTitle] = useState("")
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
  const navigate = useNavigate()

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      // Success actions
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      navigate("/thankyou")
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.error : 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    axios.get(`/api/contactInfo/getcontactinfo`, { withCredentials: true })
      .then((response) => {
        const fetchedContactInfos = response.data.data || response.data; // Adjust based on response structure
        setContactInfos(fetchedContactInfos);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          navigate('/login'); // Redirect to login if unauthorized
        }
      });
  }, []);

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
        setImgTitle(imgTitle || '')
      } catch (error) {
        console.error(error);
      }
    };

    fetchHeadings();
  }, []);

  return (

    <div className="flex flex-col">


      <div className="relative">
        <img src={`/api/logo/download/${photo}`} alt={alt} title={imgTitle} className="w-full h-[55vh] object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center flex-col gap-8 pt-16 md:pt-32">
          <h1 className="text-white text-4xl md:text-7xl font-serif capitalize">{heading}</h1>
          <p className="text-xl md:text-2xl text-white text-center">{subheading}</p>
        </div>
      </div>

      {/* Contact information row */}
      <div className='py-16'>
        <div className=" w-[90%] mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 justify-center gap-8">
            {contactInfos.map((item, index) => (
              <div key={index} className=' rounded-md shadow-md px-2 py-2'>
                <div className="flex gap-2 items-center">
                  <img src={`/api/icon/download/${item.photo}`} alt={`${item.title} icon`} className="w-10 h-10 md:w-20 md:h-20" />
                  <div>
                    {item.type === 'Head Office Address' ? (
                      <>
                        <h3 className="font-bold">{item.title}</h3>
                        <a href={headOfficeAddress} target='_blank' className='hover:text-blue-500'>{item.address}</a>
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
                        <a href={`mailto:${item.email1}`} className='hover:text-blue-500' >{item.email1}</a><br />
                        {item.email2 && <a href={`mailto:${item.email2}`} className='hover:text-blue-500'>{item.email2}</a>}
                      </>
                    ) : (
                      <>
                        <h3 className="font-bold">{item.title}</h3>
                        <a href={salesOfficeAddress} target='_blank' className='hover:text-blue-500'>{item.address}</a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map and Contact Form */}
        <div className="w-[90%] mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Contact Form */}
            <div className="flex-1">
              <h2 className="text-2xl mb-4 text-black font-serif">Get in Touch</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-2 w-full">
                  <div className="w-full">
                    <label htmlFor="name" className="block mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full p-2 border rounded focus:border-yellow-500 outline-none"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="email" className="block mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full p-2 border rounded focus:border-yellow-500 outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block mb-1">Mobile</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full p-2 border rounded focus:border-yellow-500 outline-none"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full p-2 border rounded focus:border-yellow-500 outline-none"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block mb-1">Message</label>
                  <textarea
                    id="message"
                    rows="4"
                    className="w-full p-2 border rounded focus:border-yellow-500 outline-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center"
                  disabled={isSubmitting}
                >
                  <Send className="mr-2" size={16} />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="flex-1">
              <h2 className="text-2xl mb-4 text-black font-serif">Our Location</h2>
              <iframe
                src={location}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              >
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
