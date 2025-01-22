import React from 'react';
import Thankyou from "../assets/thankyou.jpg"
const ThankYouPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg text-center">
                <div className="mb-4">
                    <img
                        src={Thankyou}
                        alt="Thank You"
                        className="mx-auto h-[7cm] mb-4"
                    />
                </div>
                <p className="text-gray-600 mb-6">
                    Your message has been successfully received. We appreciate your interest and will get back to you shortly.</p>
                <button
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                    onClick={() => window.location.href = '/'}
                >
                    Return to Homepage
                </button>
            </div>
        </div>
    );
};

export default ThankYouPage;
