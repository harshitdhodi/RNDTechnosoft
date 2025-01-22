import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

const EditSubsectionForm = ({ subsection, contentId, onEditCancel, onSubsectionUpdated, index }) => {
  const [formData, setFormData] = useState(subsection);
  const [photo, setPhoto] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(subsection.photo);
  const [altText, setAltText] = useState(subsection.photoAlt);
  const [imgtitle, setImgtitle] = useState(subsection.imgtitle);
  
  const [serviceCategories, setServiceCategories] = useState([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState(subsection.serviceparentCategoryId || "");
  const [selectedSubCategory, setSelectedSubCategory] = useState(subsection.servicesubCategoryId || "");
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(subsection.servicesubSubCategoryId || "");

  useEffect(() => {
    setFormData(subsection);
    setCurrentPhoto(subsection.photo);
    setAltText(subsection.photoAlt);
    setImgtitle(subsection.imgtitle);
  }, [subsection]);

  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        const response = await axios.get('/api/services/getAll', { withCredentials: true });
        setServiceCategories(response.data);
      } catch (error) {
        console.error('Error fetching service categories:', error);
      }
    };
    fetchServiceCategories();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    // Append all form data
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('photoAlt', altText);
    formDataToSend.append('imgtitle', imgtitle);
    formDataToSend.append('serviceparentCategoryId', selectedParentCategory);
    formDataToSend.append('servicesubCategoryId', selectedSubCategory);
    formDataToSend.append('servicesubSubCategoryId', selectedSubSubCategory);
    
    if (photo) {
      formDataToSend.append('photo', photo);
    } else if (currentPhoto) {
      formDataToSend.append('currentPhoto', currentPhoto);
    }

    try {
      await axios.put(`/api/content/subsections/${contentId}/${index}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      onSubsectionUpdated();
      console.log("Subsection updated successfully");
    } catch (error) {
      console.error("Error updating subsection:", error);
    }
  };

  const renderCategoryOptions = (categories) => {
    return categories.map(category => (
      <option key={category._id} value={category.slug}>
        {category.category}
      </option>
    ));
  };

  const getSubCategories = (categoryId) => {
    const category = serviceCategories.find(cat => cat.slug === categoryId);
    return category?.subCategories || [];
  };

  const getSubSubCategories = (categoryId, subCategoryId) => {
    const category = serviceCategories.find(cat => cat.slug === categoryId);
    const subCategory = category?.subCategories.find(sub => sub.slug === subCategoryId);
    return subCategory?.subSubCategories || [];
  };

  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-4">Edit Subsection</h3>

      {/* Service Categories Section */}
      <label htmlFor="serviceParentCategory" className="block font-semibold mb-2">Service Parent Category</label>
      <select
        id="serviceParentCategory"
        value={selectedParentCategory}
        onChange={(e) => setSelectedParentCategory(e.target.value)}
        className="w-full p-2 border rounded focus:outline-none mb-2"
        required
      >
        <option value="">Select Service Parent Category</option>
        {renderCategoryOptions(serviceCategories)}
      </select>

      {selectedParentCategory && (
        <>
          <label htmlFor="serviceSubCategory" className="block font-semibold mb-2">Service Subcategory</label>
          <select
            id="serviceSubCategory"
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none mb-2"
            required
          >
            <option value="">Select Subcategory</option>
            {renderCategoryOptions(getSubCategories(selectedParentCategory))}
          </select>
        </>
      )}

      {selectedSubCategory && (
        <>
          <label htmlFor="serviceSubSubCategory" className="block font-semibold mb-2">Service Sub-Subcategory</label>
          <select
            id="serviceSubSubCategory"
            value={selectedSubSubCategory}
            onChange={(e) => setSelectedSubSubCategory(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none mb-2"
            required
          >
            <option value="">Select Sub-Subcategory</option>
            {renderCategoryOptions(getSubSubCategories(selectedParentCategory, selectedSubCategory))}
          </select>
        </>
      )}

      <label className="block mb-2">Title</label>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        className="p-2 border rounded mb-2"
      />

      <label className="block mb-2">Description</label>
      <ReactQuill
        value={formData.description}
        onChange={(value) => handleChange('description', value)}
        className="border border-gray-300 rounded"
        modules={modules}
      />

      <label className="block mb-2">Upload New Photo</label>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="p-2 border rounded mb-2"
      />

      {(photo || currentPhoto) && (
        <div className="mt-2 w-56 relative group">
          <img
            src={photo ? URL.createObjectURL(photo) : `/api/image/download/${currentPhoto}`}
            alt={altText}
            className="h-32 w-56 object-cover"
          />

          <div className="mb-4">
            <label htmlFor="alt" className="block font-semibold mb-2">Alternative Text</label>
            <input
              type="text"
              id="alt"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
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
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Save
      </button>
      <button
        onClick={onEditCancel}
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
      >
        Cancel
      </button>
    </div>
  );
};

export default EditSubsectionForm;
