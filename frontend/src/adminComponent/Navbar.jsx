import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosLock } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import axios from 'axios';

export default function Navbar({ toggleSidebar }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [admin, setAdmin] = useState(null);
    const menuRef = useRef();

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const response = await axios.get('/api/admin/adminprofile', {
                    withCredentials: true,
                });
                setAdmin(response.data.admin);
            } catch (error) {
                console.error('Error fetching admin profile:', error);
            }
        };

        fetchAdminProfile();
    }, []);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        Cookies.remove("jwt");
        window.location.href = "/";
    };

    return (
        <div>
            <nav className="flex justify-between px-10 h-[1.5cm] shadow-md bg-white items-center">
                <div className="flex gap-6 items-center">
                    <GiHamburgerMenu onClick={toggleSidebar} className="block lg:hidden cursor-pointer" />
                </div>
                <div className="flex gap-8 items-center">
                    {admin && (
                        <div className="flex items-center gap-2" ref={menuRef}>
                            <span>{admin.firstname} {admin.lastname}</span>
                            <div className="relative">
                                <img src={`/api/logo/download/${admin.photo}`} className="text-gray-500 cursor-pointer w-8 h-8 rounded-full " onClick={toggleMenu} />
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-md">
                                        <ul className="py-1">
                                            <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"><FaUserCircle size={20} /><Link to="/manageProfile">Manage Profile</Link></li>
                                            <li className="px-3 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"><IoIosLock size={25} /><Link to="/managePassword">Manage Password</Link></li>
                                            <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"><IoLogOut size={25} /><span onClick={handleLogout}>Logout</span></li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}
