import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WhatsAppSettingsForm = () => {
    const [formData, setFormData] = useState({
        status: 'active',
        otp: '',
        apiKey: '',
        instanceId: '',
    });

    useEffect(() => {
        // Fetch initial WhatsApp settings
        fetchWhatsAppSettings();
    }, []);

    const fetchWhatsAppSettings = async () => {
        try {
            const response = await axios.get('/api/whatsappsettings/getwhatsappsettings');
            setFormData(response.data); // Assuming response.data is an object with WhatsApp settings fields
        } catch (error) {
            console.error('Error fetching WhatsApp settings:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/whatsappsettings/editwhatsappsettings', formData);
            toast.success("Updated Successfully!")
        } catch (error) {
            console.error('Error updating WhatsApp settings:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <ToastContainer />
            <h1 className="text-xl font-bold  text-gray-700 font-serif uppercase mb-8">WhatsApp Settings</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                        Whatsapp Authentication :
                    </label>
                    <div>
                        <label className="inline-flex items-center mr-4 text-green-500">
                            <input
                                type="radio"
                                name="status"
                                value="active"
                                checked={formData.status === 'active'}
                                onChange={handleChange}
                                className="form-radio"
                            />
                            <span className="ml-2">Active</span>
                        </label>
                        <label className="inline-flex items-center text-red-500">
                            <input
                                type="radio"
                                name="status"
                                value="inactive"
                                checked={formData.status === 'inactive'}
                                onChange={handleChange}
                                className="form-radio"
                            />
                            <span className="ml-2">Inactive</span>
                        </label>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                        OTP Message to send:
                    </label>
                    <input
                        type="text"
                        id="otp"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apiKey">
                        Whatsapp API Key:
                    </label>
                    <input
                        type="text"
                        id="apiKey"
                        name="apiKey"
                        value={formData.apiKey}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instanceId">
                        Instance ID:
                    </label>
                    <input
                        type="text"
                        id="instanceId"
                        name="instanceId"
                        value={formData.instanceId}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WhatsAppSettingsForm;
