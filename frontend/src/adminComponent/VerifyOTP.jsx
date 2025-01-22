import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function VerifyOTP({ onBack }) {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate=useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post('/api/password/verifyOtp', { email, otp });
            alert('OTP verified');
            navigate("/resetpassword")
        } catch (error) {
            setError('Invalid or expired OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-xl mb-4">Verify OTP</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="otp" className="block text-sm font-bold mb-2">OTP</label>
                        <input
                            type="text"
                            id="otp"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default VerifyOTP;
