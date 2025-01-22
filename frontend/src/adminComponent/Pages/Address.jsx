import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditAddress = () => {
    const [headOfficeAddress, setHeadOfficeAddress] = useState("");
    const [salesOfficeAddress, setSalesOfficeAddress] = useState("");
    const [location, setLocation] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchAddress();
    }, []);

    const notify = () => {
        toast.success("Updated Successfully!");
    };

    const fetchAddress = async () => {
        try {
            const response = await axios.get('/api/address/getAddress', { withCredentials: true });
            const address = response.data;

            setHeadOfficeAddress(address.headOfficeAddress || "");
            setSalesOfficeAddress(address.salesOfficeAddress || "");
            setLocation(address.location || "");
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const addressData = {
                headOfficeAddress,
                salesOfficeAddress,
                location,
            };

            const response = await axios.put('/api/address/putAddress', addressData, { withCredentials: true });
            notify();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit Address Link</h1>
            <ToastContainer />
            <div className="mb-4">
                <label htmlFor="headOfficeAddress" className="block font-semibold mb-2">
                    Head Office Address Link
                </label>
                <input
                    type="text"
                    id="headOfficeAddress"
                    value={headOfficeAddress}
                    onChange={(e) => setHeadOfficeAddress(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="salesOfficeAddress" className="block font-semibold mb-2">
                    Sales Office Address Link
                </label>
                <input
                    type="text"
                    id="salesOfficeAddress"
                    value={salesOfficeAddress}
                    onChange={(e) => setSalesOfficeAddress(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="location" className="block font-semibold mb-2">
                   Google Location
                </label>
                <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none"
                    required
                />
            </div>
            <div className="mt-4">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
};

export default EditAddress;
