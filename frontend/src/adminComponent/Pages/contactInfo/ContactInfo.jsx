import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
<<<<<<< HEAD
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import { z } from "zod";
import Address from "../Address";

Modal.setAppElement('#root');

// Define Zod schema for validation
const contactSchema = z.object({
  heading: z.string()
    .min(1, "Heading is required")
    .max(100, "Heading must be 100 characters or less")
    .trim(),
  subheading: z.string()
    .min(1, "Subheading is required")
    .max(200, "Subheading must be 200 characters or less")
    .trim(),
  imgTitle: z.string()
    .min(1, "Image Title is required")
    .max(100, "Image Title must be 100 characters or less")
    .trim(),
  alt: z.string()
    .min(1, "Alt Text is required")
    .max(150, "Alt Text must be 150 characters or less")
    .trim(),
  photo: z.any()
    .refine((file) => !file || (file instanceof File && ["image/jpeg", "image/png"].includes(file.type)), "Photo must be a JPEG or PNG")
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, "Photo must be less than 5MB"),
});

=======
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Address from "../Address";

>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
const ContactInfoData = () => {
  const [contactInfos, setContactInfos] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
<<<<<<< HEAD
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState(null);
  const [imgTitle, setImgTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactInfoToDelete, setContactInfoToDelete] = useState(null);
  const navigate = useNavigate();
=======
  const [photo, setPhoto] = useState(null); // State for uploaded photo
  const [photoPreview, setPhotoPreview] = useState(null); // State for preview of uploaded photo
  const [existingPhoto, setExistingPhoto] = useState(null); // State for existing photo from the backend
  const [imgTitle, setImgTitle] = useState("");
  const [alt, setAlt] = useState("");


  const notify = () => {
    toast.success("Updated Successfully!");
  };
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=contactus', { withCredentials: true });
<<<<<<< HEAD
      const { heading, subheading, photo, alt, imgTitle } = response.data;
=======
      const { heading, subheading, photo,alt,imgTitle } = response.data;
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      setHeading(heading || '');
      setSubheading(subheading || '');
      setAlt(alt || '');
      setImgTitle(imgTitle || '');
      setExistingPhoto(photo);
    } catch (error) {
<<<<<<< HEAD
      console.error("Error fetching headings:", error);
      const statusCode = error.response?.status ? `(${error.response.status})` : '';
      toast.error(`Failed to fetch headings ${statusCode}.`);
=======
      console.error(error);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    }
  };

  const saveHeadings = async () => {
<<<<<<< HEAD
    setIsLoading(true);
    setErrors({});

    const data = { heading, subheading, imgTitle, alt, photo };
    const validationResult = contactSchema.safeParse(data);

    if (!validationResult.success) {
      const fieldErrors = {};
      validationResult.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      toast.error("Validation failed. Please check the form.");
      return;
    }

    const formData = new FormData();
    formData.append("pagetype", 'contactus');
    formData.append("heading", validationResult.data.heading);
    formData.append("subheading", validationResult.data.subheading);
    formData.append("alt", validationResult.data.alt);
    formData.append("imgTitle", validationResult.data.imgTitle);
    if (photo) formData.append("photo", photo);
=======
    const formData = new FormData();
    formData.append("pagetype", 'contactus');
    formData.append("heading", heading);
    formData.append("subheading", subheading);
    formData.append("alt", alt);
    formData.append("imgTitle", imgTitle);
    if (photo) formData.append("photo", photo); // Append photo if a new one is uploaded
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

    try {
      await axios.put('/api/pageHeading/updateHeading?pageType=contactus', formData, {
        withCredentials: true,
<<<<<<< HEAD
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success("Updated Successfully!");
      fetchHeadings(); // Refresh headings to get updated photo
    } catch (error) {
      console.error("Error updating headings:", error);
      const statusCode = error.response?.status ? `(${error.response.status})` : '';
      toast.error(`Failed to update headings ${statusCode}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContactInfos = async () => {
    try {
      const response = await axios.get(`/api/contactInfo/getcontactinfo`, { withCredentials: true });
      const fetchedContactInfos = response.data.data || response.data;
      setContactInfos(fetchedContactInfos);
    } catch (error) {
      console.error("Error fetching contact infos:", error);
      const statusCode = error.response?.status ? `(${error.response.status})` : '';
      toast.error(`Failed to fetch contact info ${statusCode}.`);
      if (error.response?.status === 403) {
        navigate("/login");
      }
    }
  };

  const handleDelete = async () => {
    if (!contactInfoToDelete) return;
    try {
      await axios.delete(`/api/contactInfo/deletecontactinfo?id=${contactInfoToDelete._id}`, {
        withCredentials: true,
      });
      toast.success(`Contact info "${contactInfoToDelete.title}" deleted successfully!`);
      setContactInfos((prevContactInfos) =>
        prevContactInfos.filter((contactInfo) => contactInfo._id !== contactInfoToDelete._id)
      );
    } catch (error) {
      console.error("Error deleting contact info:", error);
      const statusCode = error.response?.status ? `(${error.response.status})` : '';
      toast.error(`Failed to delete contact info ${statusCode}.`);
      if (error.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setIsDeleteModalOpen(false);
      setContactInfoToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setContactInfoToDelete(null);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  useEffect(() => {
    fetchHeadings();
    fetchContactInfos();
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview); // Cleanup preview URL
    };
  }, [navigate]);

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <ToastContainer />
      <div className="mb-8 border border-gray-200 shadow-lg p-4 sm:p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ...form fields unchanged... */}
        </div>
        <button
          onClick={saveHeadings}
          disabled={isLoading}
          className={`px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif text-sm sm:text-base ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-700 font-serif uppercase">Contact Info</h1>
        <button className="px-4 py-2 mt-3 sm:mt-0 bg-[#021660] text-white rounded hover:bg-red-600 transition duration-300 font-serif text-sm sm:text-base">
=======
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
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          <Link to={`/contactinfo/createContactinfo`}>Add Contact Info</Link>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full mt-8 bg-white border border-blue-200">
          <thead className="bg-[#021045] text-white">
            <tr>
<<<<<<< HEAD
              <th className="px-4 py-2 border text-sm sm:text-base">Photo</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Image Title</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Alt Text</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Type</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Phone Number(s)</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Email(s)</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Address</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Actions</th>
=======
              <th className="px-4 py-2 border">Photo</th>
              <th className="px-4 py-2 border">Image Title</th>
              <th className="px-4 py-2 border">Alt Text</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Actions</th>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
            </tr>
          </thead>
          <tbody>
            {contactInfos.length > 0 ? (
              contactInfos.map((contactInfo) => (
<<<<<<< HEAD
                <tr key={contactInfo._id} className="hover:bg-gray-100 transition duration-150">
=======
                <tr key={contactInfo._id}>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
                  <td className="px-4 py-2 border">
                    {contactInfo.photo ? (
                      <img
                        src={`/api/icon/download/${contactInfo.photo}`}
<<<<<<< HEAD
                        alt={contactInfo.alt || 'Contact Info Image'}
                        className="w-16 h-16 object-cover rounded"
=======
                        alt={contactInfo.alt}
                        className="w-16 h-16 object-cover"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
<<<<<<< HEAD
                  <td className="px-4 py-2 border break-words">{contactInfo.imgTitle || 'N/A'}</td>
                  <td className="px-4 py-2 border break-words">{contactInfo.alt || 'N/A'}</td>
                  <td className="px-4 py-2 border break-words">{contactInfo.type || 'N/A'}</td>
                  <td className="px-4 py-2 border break-words">
                    {contactInfo.phone1 || contactInfo.phone2
                      ? [contactInfo.phone1, contactInfo.phone2].filter(Boolean).join(', ')
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-2 border break-words">
                    {contactInfo.email1 || contactInfo.email2
                      ? [contactInfo.email1, contactInfo.email2].filter(Boolean).join(', ')
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-2 border break-words">{contactInfo.address || 'N/A'}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex items-center justify-left space-x-2">
                      <Link
                        to={`/contactinfo/editContactinfo/${contactInfo._id}`}
                        className="bg-blue-500 text-white p-2 rounded flex items-center justify-center hover:bg-blue-600 transition"
                        aria-label="Edit contact info"
                      >
                        <FaEdit title="Edit" />
                      </Link>
                      <button
                        onClick={() => {
                          setContactInfoToDelete(contactInfo);
                          setIsDeleteModalOpen(true);
                        }}
                        className="bg-red-500 text-white p-2 rounded flex items-center justify-center hover:bg-red-600 transition"
                        aria-label="Delete contact info"
                      >
                        <MdDelete title="Delete" />
                      </button>
                    </div>
=======
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
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
                  </td>
                </tr>
              ))
            ) : (
              <tr>
<<<<<<< HEAD
                <td colSpan="8" className="px-4 py-2 border text-center text-sm sm:text-base">
=======
                <td colSpan="6" className="px-4 py-2 border text-center">
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
                  No contact info available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
<<<<<<< HEAD
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleCancelDelete}
        contentLabel="Delete Confirmation"
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
          <h2 className="text-lg sm:text-xl font-bold font-serif text-gray-800 mb-4">Confirm Delete</h2>
          <p className="text-sm sm:text-base">
            Are you sure you want to delete the contact info "{contactInfoToDelete?.title || 'this item'}"?
          </p>
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={handleCancelDelete}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition duration-300 font-serif text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 font-serif text-sm sm:text-base"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      <Address />
    </div>
  );
};

<<<<<<< HEAD
export default ContactInfoData;
=======
export default ContactInfoData;
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
