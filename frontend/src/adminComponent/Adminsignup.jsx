import React, { useState } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AdminSignup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [photo, setPhoto] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        let hasErrors = false;
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
            hasErrors = true;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email address";
            hasErrors = true;
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
            hasErrors = true;
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
            hasErrors = true;
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Confirm Password is required";
            hasErrors = true;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            hasErrors = true;
        }

        if (!firstname.trim()) {
            newErrors.firstname = "First name is required";
            hasErrors = true;
        }

        if (!lastname.trim()) {
            newErrors.lastname = "Last name is required";
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('notpassword', password); // Using notpassword here, assuming it's handled correctly on the server
            formData.append('firstname', firstname);
            formData.append('lastname', lastname);
            if (photo) {
                formData.append('photo', photo);
            }

            await axios.post('/api/admin/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setIsLoading(false);
            alert("Signup successful. Please login to continue.");
            // Redirect to login page or do something else
        }catch (error) {
            if (error.response && error.response.status === 400) {
              toast.error(error.response.data.message);
            } 
          }
        };
      

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    return (
        <div className="flex justify-center items-center h-screen lg:px-[14rem] md:px-[9rem] sm:px-[7rem] px-[12px] shadow-2xl">
            <ToastContainer/>
            <div className="flex flex-col justify-center items-center w-[11cm] bg-gray-200 rounded-lg">
                <h2 className="text-blue-950 text-2xl font-sens flex items-center justify-center font-bold px-5 mt-4">Admin Signup</h2>
                <form className="mt-8 w-3/4" onSubmit={handleSubmit}>
                <div className='md:flex md:gap-2'>
                <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2">First Name</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            placeholder="Enter your first name"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                        />
                        {errors.firstname && <p className="text-red-500 text-xs italic">{errors.firstname}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2">Last Name</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            placeholder="Enter your last name"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                        />
                        {errors.lastname && <p className="text-red-500 text-xs italic">{errors.lastname}</p>}
                    </div>
                </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2">Email ID</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2">Password</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-2">Confirm Password</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs italic">{errors.confirmPassword}</p>}
                    </div>
                   
                    <div className="mb-6">
                        <label className="block text-gray-600 text-sm font-medium mb-2">Profile Photo</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />
                    </div>

                    <button
                        className="bg-blue-950 hover:bg-blue-900 hover:text-white border-[1px] border-blue-900 text-white font-bold text-[20px] py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing up..." : "Signup"}
                    </button>
                    <div className="text-right justify-between mt-4 mb-2">
                        Already a member?
                        <Link
                            className="text-blue-500 text-sm hover:underline ml-2"
                            to="/"
                        >
                            Login here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminSignup;
