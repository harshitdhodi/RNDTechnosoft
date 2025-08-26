import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditAddress = () => {
    const [headOfficeAddress, setHeadOfficeAddress] = useState("");
    const [salesOfficeAddress, setSalesOfficeAddress] = useState("");
    const [location, setLocation] = useState("");
<<<<<<< HEAD
    const [errors, setErrors] = useState({ headOfficeAddress: "", salesOfficeAddress: "", location: "" });

    const navigate = useNavigate();

    // Regex for validation
    const googleMapsShortLinkRegex = /^https:\/\/maps\.app\.goo\.gl\/[a-zA-Z0-9]{6,}$/;
    const googleMapsEmbedRegex = /^https:\/\/www\.google\.com\/maps\/embed\?pb=/;

=======

    const navigate = useNavigate();

>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    useEffect(() => {
        fetchAddress();
    }, []);

<<<<<<< HEAD
    const notify = (message, type = "success") => {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
=======
    const notify = () => {
        toast.success("Updated Successfully!");
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    };

    const fetchAddress = async () => {
        try {
            const response = await axios.get('/api/address/getAddress', { withCredentials: true });
            const address = response.data;

            setHeadOfficeAddress(address.headOfficeAddress || "");
            setSalesOfficeAddress(address.salesOfficeAddress || "");
            setLocation(address.location || "");
        } catch (error) {
<<<<<<< HEAD
            console.error("Error fetching address:", error);
            notify("Failed to fetch address data", "error");
        }
    };

    // Function to validate URLs
    const validateUrl = (url, field) => {
        if (!url) {
            return `${field} is required`;
        }

        // Validate Google Maps short links
        if (url.includes("maps.app.goo.gl")) {
            if (!googleMapsShortLinkRegex.test(url)) {
                return `Invalid ${field} URL. Must be a valid Google Maps short link (e.g., https://maps.app.goo.gl/XXXXXX)`;
            }
            // Note: Removed fetch-based reachability check for short links due to unreliable redirects
            return "";
        } 
        // Validate Google Maps embed URLs
        else if (url.includes("google.com/maps/embed")) {
            if (!googleMapsEmbedRegex.test(url)) {
                return `Invalid ${field} embed URL. Must be a valid Google Maps embed URL (e.g., https://www.google.com/maps/embed?pb=...)`;
            }
            return "";
        } 
        // Invalid URL type
        else {
            return `Invalid ${field} URL. Must be a valid Google Maps short link or embed URL`;
=======
            console.error(error);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
<<<<<<< HEAD

        // Validate all fields
        const headOfficeError = validateUrl(headOfficeAddress, "Head Office Address");
        const salesOfficeError = validateUrl(salesOfficeAddress, "Sales Office Address");
        const locationError = validateUrl(location, "Google Location");

        if (headOfficeError || salesOfficeError || locationError) {
            setErrors({
                headOfficeAddress: headOfficeError,
                salesOfficeAddress: salesOfficeError,
                location: locationError,
            });
            notify("Please fix the errors in the form", "error");
            return;
        }

=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        try {
            const addressData = {
                headOfficeAddress,
                salesOfficeAddress,
                location,
            };

            const response = await axios.put('/api/address/putAddress', addressData, { withCredentials: true });
<<<<<<< HEAD
            notify("Updated Successfully!");
            setErrors({ headOfficeAddress: "", salesOfficeAddress: "", location: "" });
        } catch (error) {
            console.error("Error updating address:", error);
            notify("Failed to update address", "error");
=======
            notify();
        } catch (error) {
            console.error(error);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
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
<<<<<<< HEAD
                    className={`w-full p-2 border rounded focus:outline-none ${errors.headOfficeAddress ? "border-red-500" : ""}`}
                    required
                />
                {errors.headOfficeAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.headOfficeAddress}</p>
                )}
=======
                    className="w-full p-2 border rounded focus:outline-none"
                    required
                />
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
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
<<<<<<< HEAD
                    className={`w-full p-2 border rounded focus:outline-none ${errors.salesOfficeAddress ? "border-red-500" : ""}`}
                    required
                />
                {errors.salesOfficeAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.salesOfficeAddress}</p>
                )}
            </div>
            <div className="mb-4">
                <label htmlFor="location" className="block font-semibold mb-2">
                    Google Location
=======
                    className="w-full p-2 border rounded focus:outline-none"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="location" className="block font-semibold mb-2">
                   Google Location
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
                </label>
                <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
<<<<<<< HEAD
                    className={`w-full p-2 border rounded focus:outline-none ${errors.location ? "border-red-500" : ""}`}
                    required
                />
                {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
=======
                    className="w-full p-2 border rounded focus:outline-none"
                    required
                />
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
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

<<<<<<< HEAD
export default EditAddress;
=======
export default EditAddress;
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
