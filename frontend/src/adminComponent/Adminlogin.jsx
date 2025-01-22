import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Adminlogo from '../assets/adminimg.png';
import axios from 'axios';
import Cookies from "js-cookie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        setIsLoading(true);
        try {
            const response = await axios.post('/api/admin/login', { email, password });
            const { token } = response.data;
            Cookies.set('jwt', token); // Set cookie
            toast.success("Login successful! Redirecting...");
            window.location.href="/dashboard" 

            // navigate("/dashboard"); // Navigate without reload
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message); // Display error
            } else {
                toast.error("An error occurred during login.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <ToastContainer />
            <div className="w-[11cm]">
                <div className="bg-gray-200 py-8 px-6 rounded-lg shadow-lg">
                    <div className="text-center">
                        <div className="flex justify-center items-center flex-col">
                            <img className="w-[2cm] h-[2cm]" src={Adminlogo} alt="Admin Logo" />
                            <h2 className="text-2xl font-bold text-blue-950 mt-4">ADMIN PANEL</h2>
                        </div>
                    </div>
                    <form className="mt-8" onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm text-gray-500">EMAIL</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full py-2 px-3 mt-1 text-blue-950 bg-white border-b-2 border-gray-400 focus:outline-none focus:border-blue-700"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm text-gray-500">PASSWORD</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full py-2 px-3 mt-1 text-blue-950 bg-white border-b-2 border-gray-400 focus:outline-none focus:border-blue-700"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <Link to="/forgetpassword" className="text-sm text-blue-500 hover:underline">Forgot Password?</Link>
                            <button
                                type="submit"
                                className="py-2 px-4 bg-transparent text-blue-950 font-bold border border-blue-950 rounded hover:bg-blue-950 hover:text-white transition duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? "Logging in..." : "LOGIN"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
