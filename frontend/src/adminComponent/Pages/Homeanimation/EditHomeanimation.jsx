import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const HomeAnimationForm = () => {
  const { id } = useParams();
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

  const [removeAuthPhoto, setRemoveAuthPhoto] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/home/getById?id=${id}`);
        const data = response.data.data;
        setFormData({
          video: data.video ? `/api/image/download/${data.video}` : null,
          photo: data.photo ? `/api/image/download/${data.photo}` : null,
          photoAltName: data.photoAltName || "",
          photoTitleName: data.photoTitleName || "",
          title: data.title || "",
          subtitle: data.subtitle || "",
          description: data.description || "",
          iconPhoto: (data.iconPhoto || []).map(icon => `/api/image/download/${icon}`),
          iconPhotoAltName: data.iconPhotoAltName || [],
          iconPhotoTitleName: data.iconPhotoTitleName || [],
          iconTitle: data.iconTitle || [],
          paragraph: data.paragraph || "",
          author: data.author || "",
          authPhoto: data.authPhoto ? `/api/image/download/${data.authPhoto}` : null,
          authPhotoAltName: data.authPhotoAltName || "",
          authPhotoTitleName: data.authPhotoTitleName || ""
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);


  const handleIconTitleChange = (index, value) => {
    const updatedTitles = [...formData.iconTitle];
    updatedTitles[index] = value;
    setFormData({
      ...formData,
      iconTitle: updatedTitles,
    });
  };

  const handleAddIcon = () => {
    setFormData({
      ...formData,
      iconPhoto: [...formData.iconPhoto, null],
      iconPhotoAltName: [...formData.iconPhotoAltName, ""],
      iconPhotoTitleName: [...formData.iconPhotoTitleName, ""],
      iconTitle: [...formData.iconTitle, ""],
    });
  };

  const handleRemoveIconPhoto = (index) => {
    const updatedFiles = formData.iconPhoto.filter((_, i) => i !== index);
    const updatedAltNames = formData.iconPhotoAltName.filter((_, i) => i !== index);
    const updatedTitleNames = formData.iconPhotoTitleName.filter((_, i) => i !== index);
    const updatedTitles = formData.iconTitle.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      iconPhoto: updatedFiles,
      iconPhotoAltName: updatedAltNames,
      iconPhotoTitleName: updatedTitleNames,
      iconTitle: updatedTitles,
    });
  };

  const handleFileChange = (e, index, type) => {
    const files = [...formData[type]];
    files[index] = e.target.files[0];
    setFormData({
      ...formData,
      [type]: files,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleParagraphChange = (value) => {
    setFormData({ ...formData, paragraph: value });
  };
  
  const handleAuthPhotoRemove = () => {
    setFormData({ ...formData, authPhoto: null });
    setRemoveAuthPhoto(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    // Append basic fields
    if (formData.video) form.append("video", formData.video);
    if (formData.photo) form.append("photo", formData.photo);
    if (formData.photoAltName) form.append("photoAltName", formData.photoAltName);
    if (formData.photoTitleName) form.append("photoTitleName", formData.photoTitleName);
    form.append("title", formData.title);
    form.append("subtitle", formData.subtitle);
    form.append("description", formData.description);
    form.append("paragraph", formData.paragraph);
    form.append("author", formData.author);

    // Handle authPhoto and its metadata
    if (removeAuthPhoto) {
      form.append("removeAuthPhoto", true);
    } else if (formData.authPhoto) {
      form.append("authPhoto", formData.authPhoto);
      if (formData.authPhotoAltName) form.append("authPhotoAltName", formData.authPhotoAltName);
      if (formData.authPhotoTitleName) form.append("authPhotoTitleName", formData.authPhotoTitleName);
    }

    // Handle iconPhoto array and its metadata
    formData.iconPhoto.forEach((file, index) => {
      if (file instanceof File) {
        form.append(`iconPhoto[${index}]`, file);
      } else {
        form.append(`iconPhoto[${index}]`, file); // Assumes URL for pre-selected images
      }
      if (formData.iconPhotoAltName[index]) {
        form.append(`iconPhotoAltName[${index}]`, formData.iconPhotoAltName[index]);
      }
      if (formData.iconPhotoTitleName[index]) {
        form.append(`iconPhotoTitleName[${index}]`, formData.iconPhotoTitleName[index]);
      }
    });

    // Handle iconTitle array
    formData.iconTitle.forEach((title, index) => {
      form.append(`iconTitle[${index}]`, title);
    });

    try {
      const response = await axios.put(`/api/home/updateById?id=${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        navigate("/homeanimation");
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Video */}
      <div>
        <label htmlFor="video" className="block text-sm font-medium text-gray-700">Video</label>
        <input
          type="file"
          id="video"
          name="video"
          accept="video/*"
          onChange={(e) => setFormData({ ...formData, video: e.target.files[0] })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
        {formData.video && (
          <video
            src={formData.video}
            controls
            className="mt-2 w-full"
          />
        )}
      </div>

      {/* Photo */}
      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo</label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
        {formData.photo && (
          <img
            src={formData.photo}
            alt={formData.photoAltName}
            title={formData.photoTitleName}
            className="mt-2 w-64 h-64 object-cover"
          />
        )}
        <label className="block text-sm font-medium text-gray-700">photoAltName</label>
        <input
          type="text"
          name="photoAltName"
          value={formData.photoAltName}
          onChange={handleInputChange}
          placeholder="Photo Alt Name"
          className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
        />
        <label className="block text-sm font-medium text-gray-700">photoTitleName</label>
        <input
          type="text"
          name="photoTitleName"
          value={formData.photoTitleName}
          onChange={handleInputChange}
          placeholder="Photo Title Name"
          className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Subtitle</label>
        <input
          type="text"
          id="subtitle"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleInputChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <ReactQuill
          id="description"
          value={formData.description}
          onChange={handleDescriptionChange}
          className="mt-1 w-full"
        />
      </div>

      {/* Paragraph */}
      <div>
        <label htmlFor="paragraph" className="block text-sm font-medium text-gray-700">Paragraph</label>
        <ReactQuill
          id="paragraph"
          name="paragraph"
          value={formData.paragraph}
          onChange={handleParagraphChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Author */}
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleInputChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Author Photo */}
      <div>
        <label htmlFor="authPhoto" className="block text-sm font-medium text-gray-700">Author Photo</label>
        <input
          type="file"
          id="authPhoto"
          name="authPhoto"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, authPhoto: e.target.files[0] })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
        {formData.authPhoto && (
          <img
            src={formData.authPhoto}
            alt={formData.authPhotoAltName}
            title={formData.authPhotoTitleName}
            className="mt-2 w-32 h-32 object-cover"
          />
        )}
        {formData.authPhoto && (
          <button
            type="button"
            onClick={handleAuthPhotoRemove}
            className="mt-2 text-red-500"
          >
            Remove Author Photo
          </button>
        )}
        <label className="block text-sm font-medium text-gray-700">authPhotoAltName</label>
        <input
          type="text"
          name="authPhotoAltName"
          value={formData.authPhotoAltName}
          onChange={handleInputChange}
          placeholder="Author Photo Alt Name"
          className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
        />
        <label className="block text-sm font-medium text-gray-700">authPhotoTitleName</label>
        <input
          type="text"
          name="authPhotoTitleName"
          value={formData.authPhotoTitleName}
          onChange={handleInputChange}
          placeholder="Author Photo Title Name"
          className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Icons */}
      <div>
        {formData.iconPhoto.map((icon, index) => (
          <div key={index} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Icon Photo {index + 1}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, index, 'iconPhoto')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            {icon && (
              <img
                src={icon}
                alt={formData.iconPhotoAltName[index]}
                title={formData.iconPhotoTitleName[index]}
                className="mt-2 w-32 h-32 object-cover"
              />
            )}
            {icon && (
              <button
                type="button"
                onClick={() => handleRemoveIconPhoto(index)}
                className="mt-2 text-red-500"
              >
                Remove Icon Photo
              </button>
            )}
            <input
              type="text"
              value={formData.iconPhotoAltName[index]}
              onChange={(e) => {
                const updatedAltNames = [...formData.iconPhotoAltName];
                updatedAltNames[index] = e.target.value;
                setFormData({ ...formData, iconPhotoAltName: updatedAltNames });
              }}
              placeholder="Icon Photo Alt Name"
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="text"
              value={formData.iconPhotoTitleName[index]}
              onChange={(e) => {
                const updatedTitleNames = [...formData.iconPhotoTitleName];
                updatedTitleNames[index] = e.target.value;
                setFormData({ ...formData, iconPhotoTitleName: updatedTitleNames });
              }}
              placeholder="Icon Photo Title Name"
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
            />
            <input
              type="text"
              value={formData.iconTitle[index]}
              onChange={(e) => handleIconTitleChange(index, e.target.value)}
              placeholder="Icon Title"
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddIcon}
          className="mt-2 bg-green-500 text-white py-2 px-4 rounded-md"
        >
          Add Icon
        </button>
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
      >
        Save Changes
      </button>
    </form>
  );
};

export default HomeAnimationForm;
