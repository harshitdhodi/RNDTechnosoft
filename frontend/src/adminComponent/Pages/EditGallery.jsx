import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

const EditGalleryForm = () => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [alt, setAlt] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(""); // State to hold the preview image URL
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/gallery/getCategory', { withCredentials: true });
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGallery();
    fetchCategories();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await axios.get(`/api/gallery/getGalleryById?id=${id}`, { withCredentials: true });
      const gallery = response.data;
      setAlt(gallery.alt);
      setCategoryId(gallery.categories);
      setPreviewImage(`/api/gallery/download/${gallery.images}`); // Set the preview image URL

    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('categories', categoryId);
      formData.append('alt', alt);
      if (image) {
        formData.append('images', image);
      }

      const response = await axios.put(`/api/gallery/updateGallery?id=${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      navigate('/gallery');
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setPreviewImage(URL.createObjectURL(e.target.files[0])); 
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
        <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit Gallery</h1>
      <div className="mb-4">
        <label htmlFor="categoryId" className="block font-semibold mb-2">
          Category
        </label>
        <select
          id="categoryId"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-56 p-2 border rounded focus:outline-none"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.category}
            </option>
          ))}
        </select>
      </div>
     
      <div className="mb-4">
        <label className="block font-semibold mb-2">Current Image</label>
        {previewImage && (
          <img
            src={previewImage}
            alt="Current"
            className="w-56 h-32 object-cover"
          />
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="alt" className="block font-semibold mb-2">
          Alt Text
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
        <label htmlFor="image" className="block font-semibold mb-2">
          Upload New Image
        </label>
        <input
          type="file"
          id="image"
          onChange={handleFileChange}
          accept="image/*"
          className="w-56 p-2 border rounded focus:outline-none"
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

export default EditGalleryForm;
