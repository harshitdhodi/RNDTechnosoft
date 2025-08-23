import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VisionForm = () => {
    const [heading, setHeading] = useState("");
    const [subheading, setSubheading] = useState("");
    const [bannerphoto, setBannerPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [existingPhoto, setExistingPhoto] = useState(null);
    const [imgTitle, setImgTitle] = useState("");
    const [alt, setAlt] = useState("");
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState([]);
    const [status, setStatus] = useState('');
    const [initialPhotos, setInitialPhotos] = useState([]);
    const [photoAlts, setPhotoAlts] = useState([]);
    const [imgtitle, setImgtitle] = useState([]);
    const [initialphotoAlts, setInitialPhotoAlts] = useState([]);
    const [initialImgtitle, setInitialImgtitle] = useState([]);

    // Validation states
    const [headingErrors, setHeadingErrors] = useState({});
    const [aboutCompanyErrors, setAboutCompanyErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    // Validation functions
    const validateHeadingForm = () => {
        const errors = {};
        
        if (!heading.trim()) {
            errors.heading = "Heading is required";
        }
        
        if (!subheading.trim()) {
            errors.subheading = "Subheading is required";
        }
        
        // If there's a photo (new or existing), validate alt and imgTitle
        if (bannerphoto || existingPhoto) {
            if (!alt.trim()) {
                errors.alt = "Alt text is required when image is present";
            }
            if (!imgTitle.trim()) {
                errors.imgTitle = "Image title is required when image is present";
            }
        }
        
        setHeadingErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateAboutCompanyForm = () => {
        const errors = {};
        
        if (!title.trim()) {
            errors.title = "Title is required";
        }
        
        if (!description.trim()) {
            errors.description = "Description is required";
        }
        
        if (!status) {
            errors.status = "Status is required";
        }
        
        // Validate alt texts for initial photos
        initialPhotos.forEach((_, index) => {
            if (!initialphotoAlts[index] || !initialphotoAlts[index].trim()) {
                errors[`initialAlt_${index}`] = "Alt text is required";
            }
            if (!initialImgtitle[index] || !initialImgtitle[index].trim()) {
                errors[`initialImgTitle_${index}`] = "Image title is required";
            }
        });
        
        // Validate alt texts for new photos
        photo.forEach((_, index) => {
            if (!photoAlts[index] || !photoAlts[index].trim()) {
                errors[`newAlt_${index}`] = "Alt text is required";
            }
            if (!imgtitle[index] || !imgtitle[index].trim()) {
                errors[`newImgTitle_${index}`] = "Image title is required";
            }
        });
        
        setAboutCompanyErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Success and error notification functions
    const notifySuccess = (message) => {
        toast.success(message);
    };

    const notifyError = (message) => {
        toast.error(message);
    };

    const fetchHeadings = async () => {
        try {
            const response = await axios.get('/api/pageHeading/heading?pageType=aboutcompany', { withCredentials: true });
            const { heading, subheading, photo, alt, imgTitle } = response.data;
            setHeading(heading || '');
            setSubheading(subheading || '');
            setAlt(alt || '');
            setImgTitle(imgTitle || '');
            setExistingPhoto(photo);
        } catch (error) {
            console.error(error);
            notifyError("Failed to fetch heading data");
        }
    };

    const saveHeadings = async () => {
        if (!validateHeadingForm()) {
            notifyError("Please fix the validation errors");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("pagetype", 'aboutcompany');
        formData.append("heading", heading);
        formData.append("subheading", subheading);
        formData.append("alt", alt);
        formData.append("imgTitle", imgTitle);
        if (bannerphoto) formData.append("photo", bannerphoto);

        try {
            await axios.put('/api/pageHeading/updateHeading?pageType=aboutcompany', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            notifySuccess("Heading updated successfully!");
            // Update existing photo if new photo was uploaded
            if (bannerphoto) {
                setExistingPhoto(bannerphoto.name); // Set to indicate there's now a saved photo
                setPhotoPreview(null);
                setBannerPhoto(null);
                // Refetch to get the actual saved photo
                await fetchHeadings();
            }
        } catch (error) {
            console.error(error);
            notifyError("Failed to update heading");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchHeadings();
    }, []);

    const handleHeadingChange = (e) => {
        setHeading(e.target.value);
        if (headingErrors.heading) {
            setHeadingErrors(prev => ({ ...prev, heading: '' }));
        }
    };

    const handleSubheadingChange = (e) => {
        setSubheading(e.target.value);
        if (headingErrors.subheading) {
            setHeadingErrors(prev => ({ ...prev, subheading: '' }));
        }
    };

    // Enhanced photo change handler with replacement confirmation
    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check if it's an image
        if (!file.type.startsWith('image/')) {
            notifyError("Please select a valid image file");
            e.target.value = ''; // Clear the input
            return;
        }

        // If there's an existing photo, show confirmation and delete it
        if (existingPhoto || photoPreview) {
            const shouldReplace = window.confirm("A photo already exists. The current photo will be replaced with the new photo. Do you want to continue?");
            if (!shouldReplace) {
                e.target.value = ''; // Clear the input
                return;
            }
            
            // If there's an existing photo from backend, delete it
            if (existingPhoto && !photoPreview) {
                try {
                    await axios.delete(`/api/logo/delete/${existingPhoto}`, { withCredentials: true });
                    notifySuccess("Previous heading image deleted successfully!");
                } catch (error) {
                    console.error('Error deleting existing heading image:', error);
                    notifyError("Failed to delete previous heading image");
                }
            }
            
            // Clear existing photo states
            setExistingPhoto(null);
            setPhotoPreview(null);
        }

        setBannerPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
        
        // Clear alt and imgTitle errors when photo is added
        if (headingErrors.alt) {
            setHeadingErrors(prev => ({ ...prev, alt: '' }));
        }
        if (headingErrors.imgTitle) {
            setHeadingErrors(prev => ({ ...prev, imgTitle: '' }));
        }
        
        // Clear the file input
        e.target.value = '';
    };

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

    const fetchAboutCompany = async () => {
        try {
            const response = await axios.get('/api/aboutcompany/getAboutcompany', { withCredentials: true });
            const mission = response.data.data || {};
            setTitle(mission.title || '');
            setDescription(mission.description || '');
            setInitialPhotos(mission.photo || []);
            setStatus(mission.status || 'active');
            setInitialPhotoAlts(mission.alt || []);
            setInitialImgtitle(mission.imgtitle || []);
        } catch (error) {
            console.error('Error fetching mission data:', error);
            notifyError("Failed to fetch about company data");
        }
    };

    useEffect(() => {
        fetchAboutCompany();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateAboutCompanyForm()) {
            notifyError("Please fix the validation errors");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('status', status);

        const combinedAlts = [...initialphotoAlts, ...photoAlts];
        const combinedImgtitle = [...initialImgtitle, ...imgtitle];

        photo.forEach((p) => {
            formData.append(`photo`, p);
        });

        combinedAlts.forEach((a) => {
            formData.append(`alt`, a);
        });

        combinedImgtitle.forEach((m) => {
            formData.append(`imgtitle`, m);
        });

        try {
            await axios.put('/api/aboutcompany/updateAboutcompany', formData, { withCredentials: true });
            notifySuccess("About company updated successfully!");
            setPhoto([]);
            setPhotoAlts([]);
            setImgtitle([]);
            setAboutCompanyErrors({}); // Clear all errors after successful save
            await fetchAboutCompany();
        } catch (error) {
            console.error('Error updating mission:', error);
            notifyError("Failed to update about company");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0]; // Only take the first file for single image
        
        if (!file) return;
        
        // Validate file is an image
        if (!file.type.startsWith('image/')) {
            notifyError("Please select only image files");
            e.target.value = ''; // Clear the input
            return;
        }

        // Check if there are already photos (initial + new)
        const totalPhotos = initialPhotos.length + photo.length;
        if (totalPhotos >= 1) {
            const shouldReplace = window.confirm("Only one image is allowed for About Company section. The current image will be replaced with the new image. Do you want to continue?");
            if (!shouldReplace) {
                e.target.value = ''; // Clear the input
                return;
            }
            
            // Delete existing initial photos from backend
            if (initialPhotos.length > 0) {
                try {
                    await axios.delete(`/api/aboutcompany/image/${initialPhotos[0]}/0`, { withCredentials: true });
                    notifySuccess("Previous image deleted successfully!");
                } catch (error) {
                    console.error('Error deleting existing image:', error);
                    notifyError("Failed to delete previous image");
                }
            }
            
            // Clear all existing photos and related data
            setInitialPhotos([]);
            setInitialPhotoAlts([]);
            setInitialImgtitle([]);
            setPhoto([]);
            setPhotoAlts([]);
            setImgtitle([]);
        }

        // Set new single photo
        setPhoto([file]);
        setPhotoAlts(['']); // Initialize with empty alt text
        setImgtitle(['']); // Initialize with empty title
        
        // Clear the file input
        e.target.value = '';
    };

    const handleInitialAltTextChange = (e, index) => {
        const newPhotoAlts = [...initialphotoAlts];
        newPhotoAlts[index] = e.target.value;
        setInitialPhotoAlts(newPhotoAlts);
        
        // Clear error
        if (aboutCompanyErrors[`initialAlt_${index}`]) {
            setAboutCompanyErrors(prev => ({ ...prev, [`initialAlt_${index}`]: '' }));
        }
    };

    const handleNewAltTextChange = (e, index) => {
        const newPhotoAlts = [...photoAlts];
        newPhotoAlts[index] = e.target.value;
        setPhotoAlts(newPhotoAlts);
        
        // Clear error
        if (aboutCompanyErrors[`newAlt_${index}`]) {
            setAboutCompanyErrors(prev => ({ ...prev, [`newAlt_${index}`]: '' }));
        }
    };

    const handleInitialImgtitleChange = (e, index) => {
        const newImgtitles = [...initialImgtitle];
        newImgtitles[index] = e.target.value;
        setInitialImgtitle(newImgtitles);
        
        // Clear error
        if (aboutCompanyErrors[`initialImgTitle_${index}`]) {
            setAboutCompanyErrors(prev => ({ ...prev, [`initialImgTitle_${index}`]: '' }));
        }
    };

    const handleNewImgtitleChange = (e, index) => {
        const newImgtitles = [...imgtitle];
        newImgtitles[index] = e.target.value;
        setImgtitle(newImgtitles);
        
        // Clear error
        if (aboutCompanyErrors[`newImgTitle_${index}`]) {
            setAboutCompanyErrors(prev => ({ ...prev, [`newImgTitle_${index}`]: '' }));
        }
    };

    const handleDeleteNewPhoto = (e, index) => {
        e.preventDefault();
        const updatedPhotos = [...photo];
        updatedPhotos.splice(index, 1);
        setPhoto(updatedPhotos);
        
        const updatedPhotoAlts = [...photoAlts];
        updatedPhotoAlts.splice(index, 1);
        setPhotoAlts(updatedPhotoAlts);
        
        const updatedImgtitle = [...imgtitle];
        updatedImgtitle.splice(index, 1);
        setImgtitle(updatedImgtitle);
        
        notifySuccess("Photo removed successfully!");
    };

    const handleDeleteInitialPhoto = async (e, photoFilename, index) => {
        e.preventDefault();
        try {
            await axios.delete(`/api/aboutcompany/image/${photoFilename}/${index}`, { withCredentials: true });
            
            const updatedPhotos = initialPhotos.filter(photo => photo !== photoFilename);
            setInitialPhotos(updatedPhotos);
            
            const updatedPhotoAlts = [...initialphotoAlts];
            updatedPhotoAlts.splice(index, 1);
            setInitialPhotoAlts(updatedPhotoAlts);
            
            const updatedImgtitle = [...initialImgtitle];
            updatedImgtitle.splice(index, 1);
            setInitialImgtitle(updatedImgtitle);
            
            notifySuccess("Photo deleted successfully!");
        } catch (error) {
            console.error(error);
            notifyError("Failed to delete photo");
        }
    };

    return (
        <div>
            <ToastContainer />
            <div className="mb-8 border border-gray-200 shadow-lg p-4 rounded">
                <div className="grid md:grid-cols-2 md:gap-2 grid-cols-1">
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
                            Heading <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={heading}
                            onChange={handleHeadingChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ${
                                headingErrors.heading ? 'border-red-500' : ''
                            }`}
                        />
                        {headingErrors.heading && (
                            <p className="text-red-500 text-sm mt-1">{headingErrors.heading}</p>
                        )}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
                            Sub heading <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={subheading}
                            onChange={handleSubheadingChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ${
                                headingErrors.subheading ? 'border-red-500' : ''
                            }`}
                        />
                        {headingErrors.subheading && (
                            <p className="text-red-500 text-sm mt-1">{headingErrors.subheading}</p>
                        )}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
                            {(existingPhoto || photoPreview) ? 'Replace Photo' : 'Add Photo'}
                        </label>
                        <input
                            type="file"
                            onChange={handlePhotoChange}
                            accept="image/*"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
                        />
                        {(existingPhoto || photoPreview) && (
                            <p className="text-sm text-amber-600 mt-1 font-medium">
                                ⚠️ Selecting a new photo will automatically delete and replace the current photo.
                            </p>
                        )}
                    </div>
                    {/* Preview Section */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Current Photo</label>
                        {photoPreview ? (
                            <div>
                                <p className="text-green-600 font-semibold mb-2">New Photo (to be saved):</p>
                                <img
                                    src={photoPreview}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover mt-2 border-2 border-green-300"
                                />
                            </div>
                        ) : existingPhoto ? (
                            <div>
                                <p className="text-gray-600 mb-2">Saved Photo:</p>
                                <img
                                    src={`/api/logo/download/${existingPhoto}`}
                                    alt="Existing photo"
                                    className="w-32 h-32 object-cover mt-2"
                                />
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No photo uploaded</p>
                        )}
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
                        Image Title {(bannerphoto || existingPhoto) && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type="text"
                        value={imgTitle}
                        onChange={(e) => {
                            setImgTitle(e.target.value);
                            if (headingErrors.imgTitle) {
                                setHeadingErrors(prev => ({ ...prev, imgTitle: '' }));
                            }
                        }}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ${
                            headingErrors.imgTitle ? 'border-red-500' : ''
                        }`}
                    />
                    {headingErrors.imgTitle && (
                        <p className="text-red-500 text-sm mt-1">{headingErrors.imgTitle}</p>
                    )}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
                        Alt Text {(bannerphoto || existingPhoto) && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type="text"
                        value={alt}
                        onChange={(e) => {
                            setAlt(e.target.value);
                            if (headingErrors.alt) {
                                setHeadingErrors(prev => ({ ...prev, alt: '' }));
                            }
                        }}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ${
                            headingErrors.alt ? 'border-red-500' : ''
                        }`}
                    />
                    {headingErrors.alt && (
                        <p className="text-red-500 text-sm mt-1">{headingErrors.alt}</p>
                    )}
                </div>

                <button
                    onClick={saveHeadings}
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300 font-serif ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className='p-4 overflow-x-auto'>
                <h1 className='text-xl font-bold text-gray-700 font-serif uppercase text-center'>About Company</h1>
                <div className="mb-4">
                    <label htmlFor="title" className="block font-semibold mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (aboutCompanyErrors.title) {
                                setAboutCompanyErrors(prev => ({ ...prev, title: '' }));
                            }
                        }}
                        className={`w-full p-2 border rounded focus:outline-none ${
                            aboutCompanyErrors.title ? 'border-red-500' : ''
                        }`}
                    />
                    {aboutCompanyErrors.title && (
                        <p className="text-red-500 text-sm mt-1">{aboutCompanyErrors.title}</p>
                    )}
                </div>
                <div className="mb-8">
                    <label htmlFor="details" className="block font-semibold mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <ReactQuill
                        value={description}
                        onChange={(value) => {
                            setDescription(value);
                            if (aboutCompanyErrors.description) {
                                setAboutCompanyErrors(prev => ({ ...prev, description: '' }));
                            }
                        }}
                        modules={modules}
                        className={`quill ${aboutCompanyErrors.description ? 'border-red-500' : ''}`}
                    />
                    {aboutCompanyErrors.description && (
                        <p className="text-red-500 text-sm mt-1">{aboutCompanyErrors.description}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-2">Current Photo</label>
                    <div className="flex flex-wrap gap-4">
                        {initialPhotos.length > 0 && initialPhotos.map((photo, index) => (
                            <div key={index} className="relative w-56">
                                <img
                                    src={`/api/image/download/${photo}`}
                                    alt={`Photo ${index + 1}`}
                                    className="w-56 h-32 object-cover"
                                />
                                <label htmlFor={`alt-${index}`} className="block mt-2">
                                    Alternative Text <span className="text-red-500">*</span>:
                                    <input
                                        type="text"
                                        id={`alt-${index}`}
                                        value={initialphotoAlts[index] || ''}
                                        onChange={(e) => handleInitialAltTextChange(e, index)}
                                        className={`w-full p-2 border rounded focus:outline-none ${
                                            aboutCompanyErrors[`initialAlt_${index}`] ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {aboutCompanyErrors[`initialAlt_${index}`] && (
                                        <p className="text-red-500 text-sm mt-1">{aboutCompanyErrors[`initialAlt_${index}`]}</p>
                                    )}
                                </label>
                                <label htmlFor={`imgtitle-${index}`} className="block mt-2">
                                    Title Text <span className="text-red-500">*</span>:
                                    <input
                                        type="text"
                                        id={`imgtitle-${index}`}
                                        value={initialImgtitle[index] || ''}
                                        onChange={(e) => handleInitialImgtitleChange(e, index)}
                                        className={`w-full p-2 border rounded focus:outline-none ${
                                            aboutCompanyErrors[`initialImgTitle_${index}`] ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {aboutCompanyErrors[`initialImgTitle_${index}`] && (
                                        <p className="text-red-500 text-sm mt-1">{aboutCompanyErrors[`initialImgTitle_${index}`]}</p>
                                    )}
                                </label>
                                <button
                                    onClick={(e) => handleDeleteInitialPhoto(e, photo, index)}
                                    className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex justify-center items-center"
                                >
                                    <span className="text-xs">X</span>
                                </button>
                            </div>
                        ))}
                        {initialPhotos.length === 0 && photo.length === 0 && (
                            <p className="text-gray-500 italic">No image uploaded</p>
                        )}
                    </div>
                </div>
                
                <div className="mb-4">
                    <label className="block font-semibold mb-2">
                        {(initialPhotos.length > 0 || photo.length > 0) ? 'Replace Image' : 'Add Image'}
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="p-2 border rounded"
                    />
                    {(initialPhotos.length > 0 || photo.length > 0) && (
                        <p className="text-sm text-amber-600 mt-1 font-medium">
                            ⚠️ Selecting a new image will automatically delete and replace the current image.
                        </p>
                    )}
                    
                    {/* Display new photo being added */}
                    {photo.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold text-green-600 mb-2">New Image (to be saved):</h4>
                            <div className="flex flex-wrap gap-4">
                                {photo.map((file, index) => (
                                    <div key={index} className="relative w-56">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`New Photo ${index + 1}`}
                                            className="w-56 h-32 object-cover border-2 border-green-300"
                                        />

                                        <label htmlFor={`alt-new-${index}`} className="block mt-2">
                                            Alternative Text <span className="text-red-500">*</span>:
                                            <input
                                                type="text"
                                                id={`alt-new-${index}`}
                                                value={photoAlts[index] || ""}
                                                onChange={(e) => handleNewAltTextChange(e, index)}
                                                className={`w-full p-2 border rounded focus:outline-none ${
                                                    aboutCompanyErrors[`newAlt_${index}`] ? 'border-red-500' : ''
                                                }`}
                                            />
                                            {aboutCompanyErrors[`newAlt_${index}`] && (
                                                <p className="text-red-500 text-sm mt-1">{aboutCompanyErrors[`newAlt_${index}`]}</p>
                                            )}
                                        </label>
                                        
                                        <label htmlFor={`imgtitle-new-${index}`} className="block mt-2">
                                            Title Text <span className="text-red-500">*</span>:
                                            <input
                                                type="text"
                                                id={`imgtitle-new-${index}`}
                                                value={imgtitle[index] || ""}
                                                onChange={(e) => handleNewImgtitleChange(e, index)}
                                                className={`w-full p-2 border rounded focus:outline-none ${
                                                    aboutCompanyErrors[`newImgTitle_${index}`] ? 'border-red-500' : ''
                                                }`}
                                            />
                                            {aboutCompanyErrors[`newImgTitle_${index}`] && (
                                                <p className="text-red-500 text-sm mt-1">{aboutCompanyErrors[`newImgTitle_${index}`]}</p>
                                            )}
                                        </label>
                                        
                                        <button
                                            onClick={(e) => handleDeleteNewPhoto(e, index)}
                                            className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex justify-center items-center"
                                        >
                                            <span className="text-xs">X</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="mb-4">
                    <label htmlFor="status" className="block font-semibold mb-2">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            if (aboutCompanyErrors.status) {
                                setAboutCompanyErrors(prev => ({ ...prev, status: '' }));
                            }
                        }}
                        className={`w-full p-2 border rounded focus:outline-none ${
                            aboutCompanyErrors.status ? 'border-red-500' : ''
                        }`}
                    >
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    {aboutCompanyErrors.status && (
                        <p className="text-red-500 text-sm mt-1">{aboutCompanyErrors.status}</p>
                    )}
                </div>
                
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isSubmitting ? 'Updating...' : 'Update Service'}
                </button>
            </form>
        </div>
    );
};

export default VisionForm;