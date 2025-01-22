import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams, useLocation } from "react-router-dom";

const NewGalleryForm = () => {
    const { categoryId,subcategoryId } = useParams(); // Get categoryId from URL params
    const location = useLocation(); // Get current location
    const queryParams = new URLSearchParams(location.search); // Parse query parameters
    const photoType = queryParams.get('photoType'); // Get photoType from query params

    const [alt, setAlt] = useState("");
    const [imgtitle, setImgtitle] = useState("");
    const [images, setImages] = useState(null);
    const navigate = useNavigate();


  

    const handlePhotoChange = (e) => {
        const file = e.target.files[0]; // Get the first selected file
        setImages(file);
    };

    const handleDeleteImage = () => {
        setImages(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('categoryId', categoryId); // Use categoryId from URL params
            formData.append('alt', alt);
            formData.append('imgtitle', imgtitle);
            formData.append('images', images);
            formData.append('photoType', photoType); // Use photoType from query params
            formData.append('subcategoryId', subcategoryId); // Use categoryId from URL params

            await axios.post('/api/industryImages/sub/createGallery', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            // Reset form fields after successful submission
            setAlt("");
            setImgtitle("");
            setImages(null);
            navigate('/industries');
        } catch (error) {
            console.error(error);
        }
    };

    const renderCategoryOptions = (category) => (
        <option key={category._id} value={category._id}>
            {category.category}
        </option>
    );

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Create Gallery</h1>
            
    

            <div className="mb-8">
                <label htmlFor="images" className="block font-semibold mb-2">
                    Photo
                </label>
                <input
                    type="file"
                    name="images"
                    id="images"
                    onChange={handlePhotoChange}
                    className="border rounded focus:outline-none"
                    accept="image/*"
                />
                <div className="mb-4">
                    <label htmlFor="alt" className="block font-semibold mb-2">
                        Alternative Text
                    </label>
                    <input
                        type="text"
                        id="alt"
                        value={alt}
                        onChange={(e) => setAlt(e.target.value)}
                        className="w-56 p-2 border rounded focus:outline-none"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="imgtitle" className="block font-semibold mb-2">
                        Title Text
                    </label>
                    <input
                        type="text"
                        id="imgtitle"
                        value={imgtitle}
                        onChange={(e) => setImgtitle(e.target.value)}
                        className="w-56 p-2 border rounded focus:outline-none"
                        required
                    />
                </div>
                {images && (
                    <div className="mt-2 w-56 relative group">
                        <img
                            src={URL.createObjectURL(images)}
                            alt="Gallery"
                            className="h-32 w-56 object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleDeleteImage}
                            className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
                        >
                            X
                        </button>
                    </div>
                )}
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                Add Gallery
            </button>
        </form>
    );
};

export default NewGalleryForm;
