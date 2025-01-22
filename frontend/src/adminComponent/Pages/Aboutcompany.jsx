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
    const [bannerphoto, setBannerPhoto] = useState(null); // State for uploaded photo
    const [photoPreview, setPhotoPreview] = useState(null); // State for preview of uploaded photo
    const [existingPhoto, setExistingPhoto] = useState(null); // State for existing photo from the backend
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

    const navigate = useNavigate()


    const notify = () => {
        toast.success("Updated Successfully!");
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
        }
    };
    const saveHeadings = async () => {
        const formData = new FormData();
        formData.append("pagetype", 'aboutcompany');
        formData.append("heading", heading);
        formData.append("subheading", subheading);
        formData.append("alt", alt);
        formData.append("imgTitle", imgTitle);
        if (photo) formData.append("photo", bannerphoto); // Append photo if a new one is uploaded

        try {
            await axios.put('/api/pageHeading/updateHeading?pageType=aboutcompany', formData, {
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
        setBannerPhoto(file);
        setPhotoPreview(URL.createObjectURL(file)); // Generate preview URL for photo
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
            setInitialImgtitle(mission.imgtitle || [])
        } catch (error) {
            console.error('Error fetching mission data:', error);
        }
    };

    useEffect(() => {
        fetchAboutCompany();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        })

        combinedImgtitle.forEach((m) => {
            formData.append(`imgtitle`, m);
        })

        try {
            await axios.put('/api/aboutcompany/updateAboutcompany', formData, { withCredentials: true });
            notify();
            setPhoto([])
            setPhotoAlts([])
            setImgtitle([])
            await fetchAboutCompany(); // Fetch the updated data
        } catch (error) {
            console.error('Error updating mission:', error);
        }
    };
    const handleFileChange = (e) => {
        const newPhotos = Array.from(e.target.files);
        setPhoto([...photo, ...newPhotos]);
    };

    const handleInitialAltTextChange = (e, index) => {
        const newPhotoAlts = [...initialphotoAlts];
        newPhotoAlts[index] = e.target.value;
        setInitialPhotoAlts(newPhotoAlts);
    };

    const handleNewAltTextChange = (e, index) => {
        const newPhotoAlts = [...photoAlts];
        newPhotoAlts[index] = e.target.value;
        setPhotoAlts(newPhotoAlts);
    };


    const handleInitialImgtitleChange = (e, index) => {
        const newImgtitles = [...initialImgtitle];
        newImgtitles[index] = e.target.value;
        setInitialImgtitle(newImgtitles);
    };

    const handleNewImgtitleChange = (e, index) => {
        const newImgtitles = [...imgtitle];
        newImgtitles[index] = e.target.value;
        setPhotoAlts(newImgtitles);
    };



    const handleDeleteNewPhoto = (e, index) => {
        e.preventDefault();
        const updatedPhotos = [...photo];
        updatedPhotos.splice(index, 1);
        setPhoto(updatedPhotos);
        const updatedPhotoAlts = [...initialphotoAlts];
        updatedPhotoAlts.splice(index, 1);
        setInitialPhotoAlts(updatedPhotoAlts);
        const updatedImgtitle = [...initialImgtitle];
        updatedImgtitle.splice(index, 1);
        setInitialImgtitle(updatedImgtitle);
    };

    const handleDeleteInitialPhoto = (e, photoFilename, index) => {
        e.preventDefault();
        axios.delete(`/api/aboutcompany/image/${photoFilename}/${index}`, { withCredentials: true })
            .then(response => {
                const updatedPhotos = initialPhotos.filter(photo => photo !== photoFilename);
                setInitialPhotos(updatedPhotos);
                const updatedPhotoAlts = [...initialphotoAlts];
                updatedPhotoAlts.splice(index, 1);
                setInitialPhotoAlts(updatedPhotoAlts);
                const updatedImgtitle = [...initialImgtitle];
                updatedImgtitle.splice(index, 1);
                setInitialImgtitle(updatedImgtitle);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div>
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
            <form onSubmit={handleSubmit} className='p-4 overflow-x-auto'>
                <h1 className='text-xl font-bold  text-gray-700 font-serif uppercase text-center'>About Company</h1>
                <div className="mb-4">
                    <label htmlFor="title" className="block font-semibold mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none"
                        required
                    />
                </div>
                <div className="mb-8">
                    <label htmlFor="details" className="block font-semibold mb-2">
                        Description
                    </label>
                    <ReactQuill
                        value={description}
                        onChange={setDescription}
                        modules={modules} // Include modules for image handling
                        className="quill"
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-2">Current Photos</label>
                    <div className="flex flex-wrap gap-4">
                        {initialPhotos.map((photo, index) => (
                            <div key={index} className="relative w-56">
                                <img
                                    src={`/api/image/download/${photo}`}
                                    alt={`Photo ${index + 1}`}
                                    className="w-56 h-32 object-cover"
                                />
                                <label htmlFor={`alt-${index}`} className="block mt-2">
                                    Alternative Text :
                                    <input
                                        type="text"
                                        id={`alt-${index}`}
                                        value={initialphotoAlts[index]}
                                        onChange={(e) => handleInitialAltTextChange(e, index)}
                                        className="w-full p-2 border rounded focus:outline-none"
                                    />
                                </label>
                                <label htmlFor={`imgtitle-${index}`} className="block mt-2">
                                    Title Text :
                                    <input
                                        type="text"
                                        id={`imgtitle-${index}`}
                                        value={initialImgtitle[index]}
                                        onChange={(e) => handleInitialImgtitleChange(e, index)}
                                        className="w-full p-2 border rounded focus:outline-none"
                                    />
                                </label>
                                <button
                                    onClick={(e) => handleDeleteInitialPhoto(e, photo, index)}
                                    className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex justify-center items-center"
                                >
                                    <span className="text-xs">X</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Add New Photos</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                        className="p-2 border rounded"
                    />
                    <div className="flex flex-wrap gap-4 mt-4">
                        {photo.map((file, index) => (
                            <div key={index} className="relative w-56">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`New Photo ${index + 1}`}
                                    className="w-56 h-32 object-cover"
                                />

                                <label htmlFor={`alt-new-${index}`} className="block mt-2">
                                    Alternative Text :
                                    <input
                                        type="text"
                                        id={`alt-new-${index}`}
                                        value={photoAlts[index] || ""}
                                        onChange={(e) => handleNewAltTextChange(e, index)}
                                        className="w-full p-2 border rounded focus:outline-none"
                                    />
                                </label>
                                <button
                                    onClick={(e) => handleDeleteNewPhoto(e, index)}
                                    className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex
                justify-center items-center"
                                >
                                    <span className="text-xs">X</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="status" className="block font-semibold mb-2">
                        Status
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                >
                    Update Service
                </button>
            </form>
        </div>
    );
};

export default VisionForm;
