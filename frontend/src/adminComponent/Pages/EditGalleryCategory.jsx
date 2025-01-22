import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState("");
  const [altText, setAltText] = useState("");
  const [currentPhoto, setCurrentPhoto] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const url = `/api/gallery/getCategoryById?id=${id}`;

      try {
        const response = await axios.get(url, { withCredentials: true });
        const { category, photo, alt } = response.data;

        // Set the category, photo, and alt states with the fetched data
        setCategory(category);
        setAltText(alt);
        setCurrentPhoto(photo); // Save current photo to compare with new photo on update
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleDeleteImage = () => {
    setPhoto(null);
    setAltText("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category", category);
    formData.append("alt", altText);

    if (photo) {
      formData.append("photo", photo);
    } else {
      formData.append("photo", currentPhoto);
    }

    const url = `/api/gallery/updateCategory?id=${id}`;
    try {
      await axios.put(url, formData, { withCredentials: true });
      navigate("/GalleryCategory");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit Category</h1>
      <div className="mb-4">
        <label htmlFor="category" className="block font-semibold mb-2">
          Category
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
      <div className="mb-8">
        <label htmlFor="photo" className="block font-semibold mb-2">Photo</label>
        <input
          type="file"
          name="photo"
          id="photo"
          onChange={handlePhotoChange}
          className="border rounded focus:outline-none"
          accept="image/*"
        />
       
        {(photo || currentPhoto) && (
          <div className="mt-2 relative w-56 group">
            <img
              src={photo ? URL.createObjectURL(photo) : `/api/logo/download/${currentPhoto}`}
              alt={altText}
              className="h-32 w-56 object-cover"
            />
            <button
              type="button"
              onClick={handleDeleteImage}
              className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
            >
              X
            </button>
            <div className="mb-4">
          <label htmlFor="alt" className="block font-semibold mb-2">Alternative Text</label>
          <input
            type="text"
            id="alt"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none"
            required
          />
        </div>
          </div>
        )}
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Update Category
      </button>
    </form>
  );
};

export default EditCategory;
