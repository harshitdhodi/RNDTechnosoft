import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams, useLocation } from "react-router-dom";

const EditServiceCategoryForm = () => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [alt, setAlt] = useState("");
  const [imgtitle, setImgtitle] = useState("");

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(""); // State to hold the preview image URL

  const { categoryId: categoryIdFromParams } = useParams(); // Extract categoryId from URL path
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to get the current URL

  // Extract id and photoType from the query string
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const photoType = queryParams.get('photoType');

  // Fetch the current gallery item
  const fetchGallery = async () => {
    try {
      const response = await axios.get(`/api/serviceImages/getGalleryById?id=${id}&categoryId=${categoryIdFromParams}&photoType=${photoType}`, { withCredentials: true });
      const gallery = response.data;
      setAlt(gallery.alt);
      setImgtitle(gallery.imgtitle);
      setCategoryId(gallery.categoryId);
      setPreviewImage(`/api/serviceImages/download/${gallery.images}`); // Set the preview image URL
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('categoryId', categoryId || categoryIdFromParams); // Use the categoryId from state or URL
      formData.append('alt', alt);
      formData.append('imgtitle', imgtitle);
      formData.append('photoType', photoType); // Include photoType in the form data
      if (image) {
        formData.append('images', image);
      }

      await axios.put(`/api/serviceImages/updateGallery?id=${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      navigate('/services');
    } catch (error) {
      console.error("Error updating gallery:", error);
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
        <label htmlFor="alt" className="block font-semibold mb-2">Alt Text</label>
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
        <label htmlFor="imgtitle" className="block font-semibold mb-2">Title Text</label>
        <input
          type="text"
          id="imgtitle"
          value={imgtitle}
          onChange={(e) => setImgtitle(e.target.value)}
          className="w-56 p-2 border rounded focus:outline-none"
          required
        />
      </div>


      <div className="mb-4">
        <label htmlFor="image" className="block font-semibold mb-2">Upload New Image</label>
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

export default EditServiceCategoryForm;
