import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const NewGalleryForm = () => {
    const [categories, setCategories] = useState("");
    const [alt, setAlt] = useState("");
    const [images, setImages] = useState(null);
    const [allCategories, setAllCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/gallery/getCategory', { withCredentials: true });
            setAllCategories(response.data);
        } catch (error) {
            console.error(error);
        }
    };

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
            formData.append('categories', categories);
            formData.append('alt', alt);
            formData.append('images', images);

            const response = await axios.post('/api/gallery/createGallery', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

         

            setCategories("");
            setAlt("");
            setImages(null);
            navigate('/gallery');
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
            <div className="mb-4">
                <label htmlFor="categories" className="block font-semibold mb-2">
                    Category
                </label>
                <select
                    id="categories"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none"
                    required
                >
                    <option value="">Select Category</option>
                    {allCategories.map(renderCategoryOptions)}
                </select>
            </div>
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
