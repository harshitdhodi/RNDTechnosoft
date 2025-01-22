import React, { useState, useEffect } from "react";
import axios from 'axios';
import { IconContext } from "react-icons";
import * as AllIcons from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const iconComponents = Object.entries(AllIcons).map(([key, value]) => ({
    name: key,
    icon: value,
}));

const modules = {
    toolbar: [
        [{ 'font': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        [{ 'direction': 'rtl' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['clean']
    ],
    clipboard: {
        matchVisual: false,
    }
};

const NewPageContentForm = () => {
    const [title, setTitle] = useState("");
    const [heading, setHeading] = useState("");
    const [detail, setDetail] = useState("");
    const [photos, setPhotos] = useState([]);
    const [photoAlts, setPhotoAlts] = useState([]);
    const [status, setStatus] = useState("active");
    const [showIconContainer, setShowIconContainer] = useState(false);
    const navigate = useNavigate()


    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to array
        // Limit the number of photos to 5
        if (photos.length + files.length > 5) {
            toast.error("You can only upload up to 5 photos");
            return;
        }
        setPhotos([...photos, ...files]);
        // Initialize alt text for each new photo
        const newPhotoAlts = Array.from({ length: files.length }, () => "");
        setPhotoAlts([...photoAlts, ...newPhotoAlts]);
    };


    const handleDeleteImage = (index) => {
        setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
        setPhotoAlts((prevPhotoAlts) => prevPhotoAlts.filter((_, i) => i !== index));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('heading', heading);
            formData.append('detail', detail);
            formData.append('status', status);
            photos.forEach((photo, index) => {
                formData.append(`photo`, photo);
                formData.append(`alt`, photoAlts[index]);
            });
            const response = await axios.post('/api/pageContent/insertPageContent', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            setTitle("");
            setHeading("");
            setDetail("");
            setPhotos([]);
            setPhotoAlts([]);
            setStatus("active");
            navigate('/extrapages')
        } catch (error) {
            console.error(error);
        }
    };

    const filteredIcons = iconComponents.filter((icon) =>
        icon.name.toLowerCase().includes(heading.toLowerCase())
    );

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <ToastContainer />
            <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Add Page Content</h1>
            <div className="mb-4">
                <label htmlFor="title" className="block font-semibold mb-2">
                    Title
                </label>
                <select
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none"
                    required
                >
                    <option value="">Select a title</option>
                    <option value="About Us">About Us</option>
                    <option value="Privacy Policy">Privacy Policy</option>
                    <option value="Why Choose Us">Why Choose Us</option>
                    <option value="Terms Conditions">Terms & Conditions</option>
                </select>
            </div>
            <div className="mb-4 relative">
                <div className="mb-4">
                    <label htmlFor="heading" className="block font-semibold mb-2">
                        Subtitle
                    </label>
                    <input
                        type="text"
                        value={heading}
                        onChange={(e) => setHeading(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none"
                        required
                    />
                </div>
                {showIconContainer && (
                    <div className="absolute left-0 top-full max-h-48 overflow-y-auto w-52 bg-white rounded border border-gray-300 shadow-lg grid grid-cols-5">
                        {filteredIcons.map((icon, index) => (
                            <div
                                key={index}
                                className="p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    setHeading(icon.name);
                                    setShowIconContainer(false);
                                }}
                            >
                                <IconContext.Provider value={{ size: "1.5em" }}>
                                    {React.createElement(icon.icon)}
                                </IconContext.Provider>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="mb-8">
                <label htmlFor="details" className="block font-semibold mb-2">
                    Details
                </label>
                <ReactQuill
                    value={detail}
                    onChange={setDetail}
                    modules={modules} // Include modules for image handling
                    className="quill"
                />
            </div>
            <div className="mt-12">
                <label htmlFor="photo" className="block font-semibold mb-2">
                    Photos
                </label>
                <input
                    type="file"
                    name="photo"
                    id="photo"
                    multiple
                    onChange={handlePhotoChange}
                    className="border rounded focus:outline-none "
                    accept="image/*"
                />
                {photos.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-4">
                        {photos.map((photo, index) => (
                            <div key={index} className="relative w-56  group flex flex-col items-center">
                                <div className="relative w-56">
                                    <img
                                        src={URL.createObjectURL(photo)}
                                        alt={`Service ${index + 1}`}
                                        className="h-32 w-56 object-cover"
                                    />

                                    <button
                                        onClick={() => handleDeleteImage(index)}
                                        className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
                                    >
                                        X
                                    </button>
                                </div>
                                <label className="block mt-2">
                                    Alternative Text:
                                    <input
                                        type="text"
                                        value={photoAlts[index]}
                                        onChange={(e) => {
                                            const newPhotoAlts = [...photoAlts];
                                            newPhotoAlts[index] = e.target.value;
                                            setPhotoAlts(newPhotoAlts);
                                        }}
                                        className="w-full p-2 border rounded focus:outline-none"
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="mb-4">
                <label htmlFor="status" className="block font-semibold mb-2">
                    Status
                </label>
                <div className="flex items-center">
                    <label className="mr-4 text-green-500">
                        <input
                            type="radio"
                            value="active"
                            checked={status === "active"}
                            onChange={() => setStatus("active")}
                            className="mr-2"
                        />
                        Active
                    </label>
                    <label className="text-red-500">
                        <input
                            type="radio"
                            value="inactive"
                            checked={status === "inactive"}
                            onChange={() => setStatus("inactive")}
                            className="mr-2"
                        />
                        Inactive
                    </label>
                </div>
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                Add Page Content
            </button>
        </form>
    );
};

export default NewPageContentForm;
