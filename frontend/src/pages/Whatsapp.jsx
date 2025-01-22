import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios'

const WhatsAppButton = () => {

    const [phoneNo, setPhoneNo] = useState("")

    useEffect(() => {
        const fetchFooter = async () => {
            try {
                const response = await axios.get('/api/footer/getFooter', { withCredentials: true });
                const footer = response.data;
                setPhoneNo(footer.phoneNo || "");
            } catch (error) {
                console.error(error);
            }
        };

        fetchFooter();
    }, []);


    return (
        <a
            href={`https://wa.me/${phoneNo}`}
            className="fixed bottom-4 left-6 w-14 h-14 bg-[#25d366] text-white rounded-full flex items-center justify-center text-2xl shadow-lg z-40 hover:bg-green-600 transition-transform transform hover:scale-105"
            target="_blank"
            rel="noopener noreferrer"
        >
            <FaWhatsapp className="text-3xl" />
        </a>
    );
};

export default WhatsAppButton;
