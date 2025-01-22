import { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";

const EditContactInfo = () => {
  const { id } = useParams(); // Get the contact ID from the URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imgTitle: "",
    alt: "",
    title: "",
    description: "",
    photo: null,
    type: "",
    address: "",
    phone1: "",
    phone2: "",
    email1: "",
    email2: "",
  });
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  useEffect(() => {
    // Fetch the existing contact info based on ID
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get(`/api/contactInfo/getcontactinfobyid?id=${id}`);
        const data = response.data.data;
        setFormData({
          imgTitle: data.imgTitle || "",
          alt: data.alt || "",
          title: data.title || "",
          photo: data.photo, 
          type: data.type || "",
          address: data.address || "",
          phone1: data.phone1 || "",
          phone2: data.phone2 || "",
          email1: data.email1 || "",
          email2: data.email2 || "",
        });
        if (data.photo) {
          setImagePreview(`/api/icon/download/${data.photo}`); 
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    fetchContactInfo();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQuillChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      photo: file,
    }));
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      await axios.put(`/api/contactInfo/putcontactinfo?id=${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      navigate(`/contactinfo`); // Redirect after successful update
    } catch (error) {
      console.error("Error updating contact info:", error);
    }
  };

  const renderConditionalFields = () => {
    switch (formData.type) {
      case "Head Office Address":
      case "Sales Office Address":
        return (
          <div className="mb-4">
            <label className="block mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="border rounded w-full p-2"
              required
            />
          </div>
        );
      case "Phone No":
        return (
          <>
            <div className="mb-4">
              <label className="block mb-1">Phone 1</label>
              <input
                type="text"
                name="phone1"
                value={formData.phone1}
                onChange={handleChange}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Phone 2</label>
              <input
                type="text"
                name="phone2"
                value={formData.phone2}
                onChange={handleChange}
                className="border rounded w-full p-2"
              />
            </div>
          </>
        );
      case "Email":
        return (
          <>
            <div className="mb-4">
              <label className="block mb-1">Email 1</label>
              <input
                type="email"
                name="email1"
                value={formData.email1}
                onChange={handleChange}
                className="border rounded w-full p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Email 2</label>
              <input
                type="email"
                name="email2"
                value={formData.email2}
                onChange={handleChange}
                className="border rounded w-full p-2"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Contact Info</h1>
      <form onSubmit={handleSubmit}>
        {/* New Type Field */}
        <div className="mb-4">
          <label className="block mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          >
            <option value="">Select Type</option>
            <option value="Phone No">Phone No</option>
            <option value="Email">Email</option>
            <option value="Head Office Address">Head Office Address</option>
            <option value="Sales Office Address">Sales Office Address</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="border rounded w-full p-2"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Selected" className="mt-2 w-32 h-32 object-cover" />
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Image Title</label>
          <input
            type="text"
            name="imgTitle"
            value={formData.imgTitle}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Alt Text</label>
          <input
            type="text"
            name="alt"
            value={formData.alt}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>

        {renderConditionalFields()}

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Update Contact Info
        </button>
      </form>
    </div>
  );
};

export default EditContactInfo;
