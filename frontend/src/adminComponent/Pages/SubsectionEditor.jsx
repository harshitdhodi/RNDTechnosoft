import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditSubsectionForm from '../Pages/EditSubsection';

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

const SubsectionsComponent = ({
  subsections,
  setSubsections,
  contentId,
  handlePhotoUpload,
}) => {
  const [newSubsection, setNewSubsection] = useState({
    photo: null,
    title: "",
    description: "",
    photoAlt: "",
    imgtitle: "",
    serviceparentCategoryId: "",
    servicesubCategoryId: "",
    servicesubSubCategoryId: ""
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [serviceCategories, setServiceCategories] = useState([]);

  const fetchServiceCategories = async () => {
    try {
      const response = await axios.get('/api/services/getAll', { withCredentials: true });
      setServiceCategories(response.data);
    } catch (error) {
      console.error('Error fetching service categories:', error);
    }
  };

  useEffect(() => {
    fetchServiceCategories();
  }, []);

  const handleSubsectionChange = (field, value) => {
    setNewSubsection(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSubsection = async () => {
    if (!newSubsection.title || !newSubsection.description || !newSubsection.photoAlt || !newSubsection.imgtitle) {
      alert("Please fill in all required fields before adding.");
      return;
    }

    const formData = new FormData();
    Object.keys(newSubsection).forEach(key => {
      if (newSubsection[key] !== null && newSubsection[key] !== "") {
        formData.append(key, newSubsection[key]);
      }
    });

    try {
      await axios.put(
        `/api/content/newsubsections/${contentId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );

      // Reset new subsection fields
      setNewSubsection({
        photo: null,
        title: "",
        description: "",
        photoAlt: "",
        imgtitle: "",
        serviceparentCategoryId: "",
        servicesubCategoryId: "",
        servicesubSubCategoryId: ""
      });

      // Fetch updated subsections list
      const response = await axios.get(`/api/content/subsections/${contentId}`, { withCredentials: true });
      setSubsections(response.data);

      console.log("New subsection added successfully");
    } catch (error) {
      console.error("Error adding new subsection:", error);
    }
  };

  const handleDeleteSubsection = async (index) => {
    try {
      await axios.delete(`/api/content/subsections/${contentId}/${index}`, {
        withCredentials: true,
      });
      const updatedSubsections = subsections.filter((_, i) => i !== index);
      setSubsections(updatedSubsections);
    } catch (error) {
      console.error("Error deleting subsection:", error);
    }
  };

  const handleSubsectionsSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/content/newsubsections/${contentId}`,
        { subsections },
        { withCredentials: true }
      );

      // Reset the editing state
      setEditingIndex(null);

      // Fetch updated subsections list
      const response = await axios.get(`/api/content/subsections/${contentId}`, { withCredentials: true });
      setSubsections(response.data);

      console.log("Subsections updated successfully");
    } catch (error) {
      console.error("Error updating subsections:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewSubsection(prev => ({ ...prev, photo: file }));
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
    <div className="mb-8">
      <h2 className="font-semibold mb-4">Subsections</h2>
      {editingIndex !== null ? (
        <EditSubsectionForm
          subsection={subsections[editingIndex]}
          contentId={contentId}
          index={editingIndex}
          onEditCancel={() => setEditingIndex(null)}
          onSubsectionUpdated={() => {
            setEditingIndex(null);
            fetchServiceCategories(); // Refresh categories after update
          }}
        />
      ) : (
        <>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Add New Subsection</h3>
            
            <div className="mb-4">
              <label htmlFor="serviceParentCategory" className="block font-semibold mb-2">
                Service Parent Category
              </label>
              <select
                id="serviceParentCategory"
                value={newSubsection.serviceparentCategoryId}
                onChange={(e) => handleSubsectionChange('serviceparentCategoryId', e.target.value)}
                className="w-full p-2 border rounded focus:outline-none"
                required
              >
                <option value="">Select Service Parent Category</option>
                {renderCategoryOptions(serviceCategories)}
              </select>
            </div>

            {newSubsection.serviceparentCategoryId && (
              <div className="mb-4">
                <label htmlFor="serviceSubCategory" className="block font-semibold mb-2">
                  Service Subcategory
                </label>
                <select
                  id="serviceSubCategory"
                  value={newSubsection.servicesubCategoryId}
                  onChange={(e) => handleSubsectionChange('servicesubCategoryId', e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none"
                >
                  <option value="">Select Service Subcategory</option>
                  {renderCategoryOptions(getSubCategories(newSubsection.serviceparentCategoryId))}
                </select>
              </div>
            )}

            {newSubsection.servicesubCategoryId && (
              <div className="mb-4">
                <label htmlFor="serviceSubSubCategory" className="block font-semibold mb-2">
                  Service Sub-Subcategory
                </label>
                <select
                  id="serviceSubSubCategory"
                  value={newSubsection.servicesubSubCategoryId}
                  onChange={(e) => handleSubsectionChange('servicesubSubCategoryId', e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none"
                >
                  <option value="">Select Service Sub-Subcategory</option>
                  {renderCategoryOptions(getSubSubCategories(newSubsection.serviceparentCategoryId, newSubsection.servicesubCategoryId))}
                </select>
              </div>
            )}

            {newSubsection.photo && (
              <div className="mb-4">
                <label className="block font-semibold mb-2">New Photo Preview</label>
                <img
                  src={URL.createObjectURL(newSubsection.photo)}
                  alt="New"
                  className="w-56 h-32 object-cover"
                />
              </div>
            )}

            <label className="block mb-2">Upload New Photo</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="p-2 border rounded mb-2"
            />

            <label className="block mb-2">Title</label>
            <input
              type="text"
              value={newSubsection.title}
              onChange={(e) => handleSubsectionChange('title', e.target.value)}
              className="p-2 border rounded mb-2 w-full"
            />

            <label className="block mb-2">Description</label>
            <ReactQuill
              value={newSubsection.description}
              onChange={(value) => handleSubsectionChange('description', value)}
              className="border border-gray-300 rounded mb-2"
              modules={modules}
            />

            <label className="block mb-2">Photo Alt Text</label>
            <input
              type="text"
              value={newSubsection.photoAlt}
              onChange={(e) => handleSubsectionChange('photoAlt', e.target.value)}
              className="p-2 border rounded mb-2 w-full"
            />

            <label className="block mb-2">Image Title</label>
            <input
              type="text"
              value={newSubsection.imgtitle}
              onChange={(e) => handleSubsectionChange('imgtitle', e.target.value)}
              className="p-2 border rounded mb-2 w-full"
            />

            <button
              onClick={handleAddSubsection}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Subsection
            </button>
          </div>

          <form onSubmit={handleSubsectionsSubmit}>
            <div>
              {subsections.map((sub, index) => (
                <div key={index} className="border p-4 mb-2">
                  <h4 className="font-semibold mb-2">{sub.title}</h4>
                  <div dangerouslySetInnerHTML={{ __html: sub.description }} />
                  {sub.photo && <img src={`/api/image/download/${sub.photo}`} alt={sub.photoAlt} className="w-32 h-32 object-cover mb-2" />}
                  <button
                    type="button"
                    onClick={() => setEditingIndex(index)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubsection(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default SubsectionsComponent;