import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from "react-modal";
import { z } from "zod";
import Address from "../Address";

Modal.setAppElement('#root');

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

  // Define schema inside component to access component state
  const contactSchema = useMemo(() => z.object({
    heading: z.string()
      .min(5, "Heading must be at least 5 characters")
      .max(100, "Heading must be 100 characters or less")
      .trim(),
    subheading: z.string()
      .min(10, "Subheading must be at least 10 characters")
      .max(150, "Subheading must be 150 characters or less")
      .trim(),
    imgTitle: z.string()
      .max(80, "Image Title must be 80 characters or less")
      .trim()
      .optional(),
    alt: z.string()
      .min(1, "Alt Text is required")
      .max(120, "Alt Text must be 120 characters or less")
      .trim(),
    photo: z.any()
      .refine(file => {
        if (!file && !existingPhoto) return false; // Photo is required
        if (!file) return true; // If there's an existing photo, it's okay
        return ['image/jpeg', 'image/png'].includes(file.type);
      }, "Photo must be a JPEG or PNG")
      .refine(file => !file || file.size <= 1 * 1024 * 1024, "Photo must be less than 1MB")
      .refine(file => {
        if (!file) return true; // Skip if no new file
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const { width, height } = img;
            resolve(width >= 800 && height >= 400);
          };
          img.onerror = () => resolve(false);
          img.src = URL.createObjectURL(file);
        });
      }, "Image must be at least 800x400 pixels"),
  }), [existingPhoto]); // Add existingPhoto as a dependency

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
      toast.error(`Failed to fetch headings ${statusCode}.`, {
        position: "top-center"
      });
    }
  };

  const saveHeadings = async () => {
    setIsLoading(true);
    setErrors({});

    const data = { heading, subheading, imgTitle, alt, photo, existingPhoto };
    
    try {
      const validationResult = contactSchema.safeParse(data);

      if (!validationResult.success) {
        const fieldErrors = {};
        validationResult.error.errors.forEach((err) => {
          const field = err.path[0];
          fieldErrors[field] = err.message;
          toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${err.message}`, {
            position: "top-center"
          });
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("pagetype", 'contactus');
      formData.append("heading", validationResult.data.heading);
      formData.append("subheading", validationResult.data.subheading);
      formData.append("alt", validationResult.data.alt);
      if (imgTitle) formData.append("imgTitle", validationResult.data.imgTitle);
      if (photo) formData.append("photo", photo);

      const response = await axios.put('/api/pageHeading/updateHeading?pageType=contactus', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data && response.data.message === 'Error updating page heading') {
        throw new Error('Failed to update page heading. Please try again.');
      }

      toast.success("Contact information updated successfully!", {
        position: "top-center"
      });
      fetchHeadings(); // Refresh headings to get updated data
    } catch (error) {
      console.error("Error updating headings:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update contact information';
      toast.error(errorMessage, {
        position: "top-center"
      });
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
      toast.error(`Failed to fetch contact info ${statusCode}.`, {
        position: "top-center"
      });
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
      toast.success(`Contact info "${contactInfoToDelete.title}" deleted successfully!`, {
        position: "top-center"
      });
      setContactInfos((prevContactInfos) =>
        prevContactInfos.filter((contactInfo) => contactInfo._id !== contactInfoToDelete._id)
      );
    } catch (error) {
      console.error("Error deleting contact info:", error);
      const statusCode = error.response?.status ? `(${error.response.status})` : '';
      toast.error(`Failed to delete contact info ${statusCode}.`, {
        position: "top-center"
      });
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
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset any previous photo errors
    setErrors(prev => ({
      ...prev,
      photo: undefined
    }));

    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        photo: 'Only JPEG and PNG files are allowed'
      }));
      return;
    }

    // Validate file size (1MB)
    if (file.size > 1 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        photo: 'File size must be less than 1MB'
      }));
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    
    // Validate image dimensions
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      if (width < 800 || height < 400) {
        setErrors(prev => ({
          ...prev,
          photo: 'Image must be at least 800x400 pixels'
        }));
        URL.revokeObjectURL(previewUrl); // Clean up the object URL
        return;
      }
      
      // If all validations pass, update state
      setPhoto(file);
      setPhotoPreview(previewUrl);
    };
    
    img.onerror = () => {
      setErrors(prev => ({
        ...prev,
        photo: 'Failed to load image'
      }));
      URL.revokeObjectURL(previewUrl); // Clean up the object URL
    };
    
    img.src = previewUrl;
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
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          zIndex: 9999,
          marginTop: '4rem',
        }}
      />
      <div className="mb-8 border border-gray-200 shadow-lg p-4 sm:p-6 rounded-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Contact Information</h2>
          <p className="text-gray-600">Manage your contact details and information displayed on the website</p>
        </div>
        
        {/* Heading and Subheading Form */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Page Headings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="heading" className="block text-sm font-medium text-gray-700 mb-1">
                Main Heading <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">(5-100 characters)</span>
              </label>
              <input
                type="text"
                id="heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className={`w-full px-3 py-2 border ${errors.heading ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#324154]`}
                placeholder="Enter main heading"
              />
              {errors.heading && (
                <p className="mt-1 text-sm text-red-600">{errors.heading}</p>
              )}
            </div>
            <div>
              <label htmlFor="subheading" className="block text-sm font-medium text-gray-700 mb-1">
                Subheading <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">(10-150 characters)</span>
              </label>
              <input
                type="text"
                id="subheading"
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                className={`w-full px-3 py-2 border ${errors.subheading ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#324154]`}
                placeholder="Enter subheading"
              />
              {errors.subheading && (
                <p className="mt-1 text-sm text-red-600">{errors.subheading}</p>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="imgTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Image Title
                <span className="text-xs text-gray-500 ml-2">(Optional, max 80 characters)</span>
              </label>
              <input
                type="text"
                id="imgTitle"
                value={imgTitle}
                onChange={(e) => setImgTitle(e.target.value)}
                className={`w-full px-3 py-2 border ${errors.imgTitle ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#324154]`}
                placeholder="Enter image title"
              />
              {errors.imgTitle && (
                <p className="mt-1 text-sm text-red-600">{errors.imgTitle}</p>
              )}
            </div>
            <div>
              <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">(Max 120 characters)</span>
              </label>
              <input
                type="text"
                id="alt"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                className={`w-full px-3 py-2 border ${errors.alt ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#324154]`}
                placeholder="Enter alt text for the image"
              />
              {errors.alt && (
                <p className="mt-1 text-sm text-red-600">{errors.alt}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(JPEG/PNG, max 1MB, min 800×400px)</span>
            </label>
            <div className="mt-1 flex items-center">
              <label
                htmlFor="photo"
                className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#324154]"
              >
                Choose File
                <input
                  id="photo"
                  name="photo"
                  type="file"
                  className="sr-only"
                  onChange={handlePhotoChange}
                  accept="image/jpeg, image/png"
                />
              </label>
              <span className="ml-2 text-sm text-gray-500">
                {photo ? photo.name : 'No file chosen'}
              </span>
            </div>
            {photoPreview && (
              <div className="mt-2">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="h-40 w-auto object-cover rounded"
                />
              </div>
            )}
            {existingPhoto && !photo && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Current Image:</p>
                <img
                  src={`/api/logo/download/${existingPhoto}`}
                  alt={alt || 'Current'}
                  className="h-40 w-auto object-cover rounded mt-1"
                />
              </div>
            )}
            {errors.photo && (
              <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
            )}
          </div>

          <div className="mt-6 flex justify-start">
            <button
              type="button"
              onClick={saveHeadings}
              disabled={isLoading}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-md font-medium rounded-sm shadow-sm text-white ${isLoading ? 'bg-[#324154]' : 'bg-[#324154] hover:bg-[#324154]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#324154]`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>

        
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-700 font-serif uppercase">Contact Info</h1>
        <button className="px-4 py-2 mt-3 sm:mt-0 bg-[#334155] text-white rounded hover:bg-red-600 transition duration-300 font-serif text-sm sm:text-base">
          <Link to={`/contactinfo/createContactinfo`}>Add Contact Info</Link>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full mt-8 bg-white border border-blue-200">
          <thead className="bg-[#334155] text-white">
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