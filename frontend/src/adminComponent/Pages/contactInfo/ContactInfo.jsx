import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
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

const ContactInfoData = () => {
  const [contactInfos, setContactInfos] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
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

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=contactus', { withCredentials: true });
      const { heading, subheading, photo, alt, imgTitle } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
      setAlt(alt || '');
      setImgTitle(imgTitle || '');
      setExistingPhoto(photo);
    } catch (error) {
      console.error("Error fetching headings:", error);
      const statusCode = error.response?.status ? `(${error.response.status})` : '';
      toast.error(`Failed to fetch headings ${statusCode}.`);
    }
  };

  const saveHeadings = async () => {
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

    try {
      await axios.put('/api/pageHeading/updateHeading?pageType=contactus', formData, {
        withCredentials: true,
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
          <Link to={`/contactinfo/createContactinfo`}>Add Contact Info</Link>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full mt-8 bg-white border border-blue-200">
          <thead className="bg-[#021045] text-white">
            <tr>
              <th className="px-4 py-2 border text-sm sm:text-base">Photo</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Image Title</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Alt Text</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Type</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Phone Number(s)</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Email(s)</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Address</th>
              <th className="px-4 py-2 border text-sm sm:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contactInfos.length > 0 ? (
              contactInfos.map((contactInfo) => (
                <tr key={contactInfo._id} className="hover:bg-gray-100 transition duration-150">
                  <td className="px-4 py-2 border">
                    {contactInfo.photo ? (
                      <img
                        src={`/api/icon/download/${contactInfo.photo}`}
                        alt={contactInfo.alt || 'Contact Info Image'}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-2 border text-center text-sm sm:text-base">
                  No contact info available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
      <Address />
    </div>
  );
};

export default ContactInfoData;