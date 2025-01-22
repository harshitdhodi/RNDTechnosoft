import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AwardLandingPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [clientIp, setClientIp] = useState('');
    const [utmParams, setUtmParams] = useState({});
    // State for counters
    const [successfulProjects, setSuccessfulProjects] = useState(0);
    const [clientSatisfaction, setClientSatisfaction] = useState(0);
    const [globalClients, setGlobalClients] = useState(0);

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
    
    // Form input state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        description: '',
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

    // Form error state
    const [formError, setFormError] = useState('');

    const handleClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const showPopup = () => {
            setIsOpen(true);
        };

        // Show popup initially after 30 minutes
        const initialTimer = setTimeout(showPopup, 1800000);

        // Set up interval to show popup every 30 minutes
        const intervalTimer = setInterval(showPopup, 1800000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(intervalTimer);
        };
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    // Disable body scroll when popup is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // Animation effect for counters
    useEffect(() => {
        if (isOpen) {
            const totalDuration = 2000; // Total duration for counting
            const updateInterval = 100; // Interval to update counter
            const targetSuccessfulProjects = 500;
            const targetClientSatisfaction = 98;
            const targetGlobalClients = 300;

            let successfulProjectsCount = 0;
            let clientSatisfactionCount = 0;
            let globalClientsCount = 0;

            const intervalId = setInterval(() => {
                if (successfulProjectsCount < targetSuccessfulProjects) {
                    successfulProjectsCount += Math.ceil(targetSuccessfulProjects / (totalDuration / updateInterval));
                    setSuccessfulProjects(successfulProjectsCount);
                }
                if (clientSatisfactionCount < targetClientSatisfaction) {
                    clientSatisfactionCount += Math.ceil(targetClientSatisfaction / (totalDuration / updateInterval));
                    setClientSatisfaction(clientSatisfactionCount);
                }
                if (globalClientsCount < targetGlobalClients) {
                    globalClientsCount += Math.ceil(targetGlobalClients / (totalDuration / updateInterval));
                    setGlobalClients(globalClientsCount);
                }
                if (successfulProjectsCount >= targetSuccessfulProjects &&
                    clientSatisfactionCount >= targetClientSatisfaction &&
                    globalClientsCount >= targetGlobalClients) {
                    clearInterval(intervalId);
                }
            }, updateInterval);

            return () => clearInterval(intervalId);
        }
    }, [isOpen]);

    // Handle form input change
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Form validation and submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, mobile, description } = formData;
        const completeFormData = {
            ...formData,
            clientIp, // Add client IP
            utmSource: utmParams.utm_source,
            utmMedium: utmParams.utm_medium,
            utmCampaign: utmParams.utm_campaign,
            utmId: utmParams.utm_id,
            gclid: utmParams.gclid,
            gcidSource: utmParams.gcid_source,
            utmContent: utmParams.utm_content,
            utmTerm: utmParams.utm_term
          };
        // Basic validation
        if (name === '' || email === '' || mobile === '' || description.length < 50) {
            setFormError('Please fill in all fields and ensure description is at least 50 characters long.');
            return;
        }

        try {
            // Send POST request
            await axios.post('/api/popupinquiry/createpopupinquiry', completeFormData);
            navigate("/thankyou")
            setFormData({ name: '', email: '', mobile: '', description: '', utmSource: '',
                utmMedium: '',
                utmCampaign: '',
                utmId: '',
                gclid: '',
                gcidSource: '',
                utmContent: '',
                utmTerm: '',
                ipaddress: '' });
            setFormError('');
        } catch (error) {
            console.error('Error submitting form', error);
            setFormError('An error occurred. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
            <div className="flex flex-col md:flex-row w-full max-w-3xl bg-gray-100 rounded-lg overflow-hidden">
                {/* Left Section */}
                <div className="hidden md:block w-full bg-gray-800 p-6 lg:p-8 text-white">
                    <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">
                        RND Technosoft is a winner for the following Clutch 2024 Global Awards
                    </h2>
                    <div className="flex flex-col items-center">
                        <div className="text-green-400 font-bold mb-2">Clutch</div>
                        <div className="bg-green-400 text-white px-4 py-1 rounded-full mb-2">GLOBAL</div>
                        <div className="text-white mb-4">SPRING 2024</div>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="border border-gray-600 p-4 rounded-lg text-center">
                                <div className="text-xs mb-2">TOP COMPANY</div>
                                <div className="font-bold mb-2">Software Development</div>
                                <div className="text-xs">2024</div>
                            </div>
                            <div className="border border-gray-600 p-4 rounded-lg text-center">
                                <div className="text-xs mb-2">TOP COMPANY</div>
                                <div className="font-bold mb-2">Mobile App Development</div>
                                <div className="text-xs">2024</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-6 lg:mt-8">
                        <div className="text-center">
                            <div className="font-bold text-xl lg:text-2xl">{successfulProjects}+</div>
                            <div className="text-xs lg:text-sm">Successful Projects</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-xl lg:text-2xl text-green-400">{clientSatisfaction}%</div>
                            <div className="text-xs lg:text-sm">Client Satisfaction</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-xl lg:text-2xl text-blue-500">{globalClients}+</div>
                            <div className="text-xs lg:text-sm">Global Clients</div>
                        </div>
                    </div>
                </div>
                {/* Right Section */}
                <div className="w-full bg-yellow-500 p-6 lg:p-8 relative">
                    <X className="absolute top-2 right-2 cursor-pointer text-white" onClick={handleClose} />
                    <h2 className="text-xl lg:text-3xl font-bold mb-2 lg:mb-4 text-white">Let's Innovate Together!</h2>
                    <p className="text-[18px] lg:text-xl mb-4 lg:mb-6 text-white">Request a FREE Consultation!</p>

                    {/* Form */}
                    <form className="space-y-4 w-full" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded text-sm"
                        />
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email ID"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full sm:w-1/2 p-2 rounded text-sm"
                            />
                            <input
                                type="tel"
                                name="mobile"
                                placeholder="Mobile No."
                                value={formData.mobile}
                                onChange={handleInputChange}
                                className="w-full sm:w-1/2 p-2 rounded text-sm"
                            />
                        </div>
                        <textarea
                            name="description"
                            placeholder="Describe your project idea (minimum 50 characters)"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded h-24 text-sm"
                        ></textarea>
                        {formError && <div className="text-red-600 text-sm">{formError}</div>}
                        <button className="w-full bg-blue-700 text-white py-2 rounded font-bold hover:bg-yellow-500 transition duration-300 text-sm">
                            Submit Now
                        </button>
                        <button className="w-full bg-white text-blue-500 py-2 rounded font-bold hover:bg-gray-100 transition duration-300 text-sm">
                            Request FREE Tech Consultation
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AwardLandingPage;
