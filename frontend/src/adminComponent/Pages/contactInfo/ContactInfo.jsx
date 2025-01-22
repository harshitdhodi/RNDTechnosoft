import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Address from "../Address";

const ContactInfoData = () => {
  const [contactInfos, setContactInfos] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [photo, setPhoto] = useState(null); // State for uploaded photo
  const [photoPreview, setPhotoPreview] = useState(null); // State for preview of uploaded photo
  const [existingPhoto, setExistingPhoto] = useState(null); // State for existing photo from the backend
  const [imgTitle, setImgTitle] = useState("");
  const [alt, setAlt] = useState("");


  const notify = () => {
    toast.success("Updated Successfully!");
  };

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=contactus', { withCredentials: true });
      const { heading, subheading, photo,alt,imgTitle } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
      setAlt(alt || '');
      setImgTitle(imgTitle || '');
      setExistingPhoto(photo);
    } catch (error) {
      console.error(error);
    }
  };

  const saveHeadings = async () => {
    const formData = new FormData();
    formData.append("pagetype", 'contactus');
    formData.append("heading", heading);
    formData.append("subheading", subheading);
    formData.append("alt", alt);
    formData.append("imgTitle", imgTitle);
    if (photo) formData.append("photo", photo); // Append photo if a new one is uploaded

    try {
      await axios.put('/api/pageHeading/updateHeading?pageType=contactus', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      notify();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHeadings();
  }, []);

  const handleHeadingChange = (e) => setHeading(e.target.value);
  const handleSubheadingChange = (e) => setSubheading(e.target.value);

  // Handle file change and set preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file)); // Generate preview URL for photo
  };

  // Fetch contact info data with authentication
  useEffect(() => {
    axios.get(`/api/contactInfo/getcontactinfo`, { withCredentials: true })
      .then((response) => {
        const fetchedContactInfos = response.data.data || response.data;
        setContactInfos(fetchedContactInfos);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          navigate("/login");
        }
      });
  }, []);

  const handleDelete = (contactInfoId) => {
    if (window.confirm("Are you sure you want to delete this contact info?")) {
      axios
        .delete(`/api/contactInfo/deletecontactinfo?id=${contactInfoId}`, {
          withCredentials: true,
        })
        .then((response) => {
          setContactInfos((prevContactInfos) =>
            prevContactInfos.filter((contactInfo) => contactInfo._id !== contactInfoId)
          );
        })
        .catch((error) => {
          if (error.response?.status === 403) {
            navigate("/login");
          }
        });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="mb-8 border border-gray-200 shadow-lg p-4 rounded">
        <div className="grid md:grid-cols-2 md:gap-2 grid-cols-1">
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Heading</label>
            <input
              type="text"
              value={heading}
              onChange={handleHeadingChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Sub heading</label>
            <input
              type="text"
              value={subheading}
              onChange={handleSubheadingChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Photo</label>
            <input
              type="file"
              onChange={handlePhotoChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
            />
          </div>
          {/* Preview Section */}
          <div className="mb-6">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview"
                className="w-32 h-32 object-cover mt-2"
              />
            ) : existingPhoto ? (
              <img
                src={`/api/logo/download/${existingPhoto}`}
                alt="Existing photo"
                className="w-32 h-32 object-cover mt-2"
              />
            ) : (
              <p>No photo uploaded</p>
            )}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Image Title</label>
          <input
            type="text"
            value={imgTitle}
            onChange={(e) => setImgTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Alt Text</label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
          />
        </div>

        <button
          onClick={saveHeadings}
          className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif"
        >
          Save
        </button>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Contact Info</h1>
        <button className="px-4 py-2 mt-3 bg-[#021660] text-white rounded hover:bg-red-600 transition duration-300">
          <Link to={`/contactinfo/createContactinfo`}>Add Contact Info</Link>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full mt-8 bg-white border border-blue-200">
          <thead className="bg-[#021045] text-white">
            <tr>
              <th className="px-4 py-2 border">Photo</th>
              <th className="px-4 py-2 border">Image Title</th>
              <th className="px-4 py-2 border">Alt Text</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contactInfos.length > 0 ? (
              contactInfos.map((contactInfo) => (
                <tr key={contactInfo._id}>
                  <td className="px-4 py-2 border">
                    {contactInfo.photo ? (
                      <img
                        src={`/api/icon/download/${contactInfo.photo}`}
                        alt={contactInfo.alt}
                        className="w-16 h-16 object-cover"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="px-4 py-2 border">{contactInfo.imgTitle}</td>
                  <td className="px-4 py-2 border">{contactInfo.alt}</td>
                  <td className="px-4 py-2 border">{contactInfo.title}</td>
                  <td className="px-4 py-2 border">{contactInfo.address}</td>
                  <td className="px-4 py-2 border w-full flex items-center justify-left space-x-2">
                    <Link
                      to={`/contactinfo/editContactinfo/${contactInfo._id}`}
                      className="bg-blue-500 text-white p-2 rounded flex items-center justify-center"
                    >
                      <FaEdit title="Edit" />
                    </Link>
                    <button
                      onClick={() => handleDelete(contactInfo._id)}
                      className="bg-red-500 text-white p-2 rounded flex items-center justify-center"
                    >
                      <MdDelete title="Delete" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 border text-center">
                  No contact info available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Address />
    </div>
  );
};

export default ContactInfoData;
