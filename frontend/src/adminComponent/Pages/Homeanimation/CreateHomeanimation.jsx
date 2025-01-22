import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const HomeAnimationForm = () => {
  const [formData, setFormData] = useState({
    video: null,
    photo: null,
    photoAltName: "",
    photoTitleName: "",
    title: "",
    subtitle: "",
    description: "",
    iconPhoto: [],
    iconPhotoAltName: [],
    iconPhotoTitleName: [],
    iconTitle: [],
    paragraph: "",
    author: "",
    authPhoto: null,
    authPhotoAltName: "",
    authPhotoTitleName: "",
  });

  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleQuillChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleIconPhotoChange = (e, index) => {
    const { files } = e.target;
    const updatedIconPhotos = [...formData.iconPhoto];
    updatedIconPhotos[index] = files[0];
    setFormData((prevState) => ({
      ...prevState,
      iconPhoto: updatedIconPhotos,
    }));
  };

  const handleIconAltNameChange = (e, index) => {
    const { value } = e.target;
    const updatedAltNames = [...formData.iconPhotoAltName];
    updatedAltNames[index] = value;
    setFormData((prevState) => ({
      ...prevState,
      iconPhotoAltName: updatedAltNames,
    }));
  };

  const handleIconTitleNameChange = (e, index) => {
    const { value } = e.target;
    const updatedTitleNames = [...formData.iconPhotoTitleName];
    updatedTitleNames[index] = value;
    setFormData((prevState) => ({
      ...prevState,
      iconPhotoTitleName: updatedTitleNames,
    }));
  };

  const handleIconTitleChange = (e, index) => {
    const { value } = e.target;
    const updatedIconTitles = [...formData.iconTitle];
    updatedIconTitles[index] = value;
    setFormData((prevState) => ({
      ...prevState,
      iconTitle: updatedIconTitles,
    }));
  };

  const addIconField = () => {
    setFormData((prevState) => ({
      ...prevState,
      iconPhoto: [...prevState.iconPhoto, null],
      iconPhotoAltName: [...prevState.iconPhotoAltName, ""],
      iconPhotoTitleName: [...prevState.iconPhotoTitleName, ""],
      iconTitle: [...prevState.iconTitle, ""],
    }));
  };

  const removeIconField = (index) => {
    const updatedIconPhotos = [...formData.iconPhoto];
    const updatedAltNames = [...formData.iconPhotoAltName];
    const updatedTitleNames = [...formData.iconPhotoTitleName];
    const updatedIconTitles = [...formData.iconTitle];

    updatedIconPhotos.splice(index, 1);
    updatedAltNames.splice(index, 1);
    updatedTitleNames.splice(index, 1);
    updatedIconTitles.splice(index, 1);

    setFormData((prevState) => ({
      ...prevState,
      iconPhoto: updatedIconPhotos,
      iconPhotoAltName: updatedAltNames,
      iconPhotoTitleName: updatedTitleNames,
      iconTitle: updatedIconTitles,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true before submitting

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((item, index) => {
          formDataToSend.append(`${key}[${index}]`, item);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await axios.post("/api/home/homeAnimation", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/show-homeanimation");
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    } finally {
      setLoading(false); // Set loading to false after the operation is complete
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg">
        {/* Video Upload */}
        <div className="mb-4">
          <label htmlFor="video" className="block text-sm font-medium text-gray-700">Upload Video</label>
          <input type="file" name="video" onChange={handleChange} className="mt-1 block w-full" />
        </div>

        {/* Photo Upload */}
        <div className="mb-4">
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Upload Photo</label>
          <input type="file" name="photo" onChange={handleChange} className="mt-1 block w-full" />
          <input
            type="text"
            name="photoAltName"
            value={formData.photoAltName}
            onChange={handleChange}
            placeholder="Alt Name"
            className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
          />
          <input
            type="text"
            name="photoTitleName"
            value={formData.photoTitleName}
            onChange={handleChange}
            placeholder="Title Name"
            className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Title */}
        <div className="mb-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Subtitle */}
        <div className="mb-4">
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Subtitle"
            className="block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <ReactQuill
            value={formData.description}
            onChange={(value) => handleQuillChange("description", value)}
            placeholder="Description"
            className="rounded-md"
          />
        </div>

        {/* Icon Photos */}
        {formData.iconPhoto.map((_, index) => (
          <div key={index} className="mb-4">
            <label htmlFor={`iconPhoto-${index}`} className="block text-sm font-medium text-gray-700">Upload Icon Photo</label>
            <input
              type="file"
              name={`iconPhoto-${index}`}
              onChange={(e) => handleIconPhotoChange(e, index)}
              className="mt-1 block w-full"
            />
            <input
              type="text"
              name={`iconPhotoAltName-${index}`}
              value={formData.iconPhotoAltName[index]}
              onChange={(e) => handleIconAltNameChange(e, index)}
              placeholder="Alt Name"
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="text"
              name={`iconPhotoTitleName-${index}`}
              value={formData.iconPhotoTitleName[index]}
              onChange={(e) => handleIconTitleNameChange(e, index)}
              placeholder="Title Name"
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="text"
              name={`iconTitle-${index}`}
              value={formData.iconTitle[index]}
              onChange={(e) => handleIconTitleChange(e, index)}
              placeholder="Icon Title"
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
            />
            <button
              type="button"
              onClick={() => removeIconField(index)}
              className="mt-2 text-red-600 hover:underline"
            >
              Remove Icon
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addIconField}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Icon Field
        </button>

        {/* Author Photo */}
        <div className="mb-4">
          <label htmlFor="authPhoto" className="block text-sm font-medium text-gray-700">Upload Author Photo</label>
          <input type="file" name="authPhoto" onChange={handleChange} className="mt-1 block w-full" />
          <input
            type="text"
            name="authPhotoAltName"
            value={formData.authPhotoAltName}
            onChange={handleChange}
            placeholder="Alt Name"
            className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
          />
          <input
            type="text"
            name="authPhotoTitleName"
            value={formData.authPhotoTitleName}
            onChange={handleChange}
            placeholder="Title Name"
            className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Paragraph */}
        <div className="mb-4">
          <ReactQuill
            value={formData.paragraph}
            onChange={(value) => handleQuillChange("paragraph", value)}
            placeholder="Paragraph"
            className="rounded-md"
          />
        </div>

        {/* Author */}
        <div className="mb-4">
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author"
            className="block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default HomeAnimationForm;
