import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const VisionForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState([]);
    const [status, setStatus] = useState('');
    const [initialPhotos, setInitialPhotos] = useState([]);
    const [photoAlts, setPhotoAlts] = useState([]);
    const [initialphotoAlts, setInitialPhotoAlts] = useState([]);

    const notify = () => {
        toast.success("Updated Successfully!");
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

    const fetchVisionData = () => {
        axios.get('/api/vision/getVision', { withCredentials: true })
            .then(response => {
                const mission = response.data.data || {};
                setTitle(mission.title || '');
                setDescription(mission.description || '');
                setInitialPhotos(mission.photo || []);
                setStatus(mission.status || 'active');
                setInitialPhotoAlts(mission.alt || []);
            })
            .catch(error => {
                console.error('Error fetching mission data:', error);
            });
    };

    useEffect(() => {
        fetchVisionData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('status', status);

        const combinedAlts = [...initialphotoAlts, ...photoAlts];
        photo.forEach((p) => {
            formData.append(`photo`, p);
        });

        combinedAlts.forEach((a) => {
            formData.append(`alt`, a);
        });

        axios.put('/api/vision/updateVision', formData, { withCredentials: true })
            .then(response => {
                notify();
                setPhoto([]);
                setPhotoAlts([]);
                fetchVisionData();  // Fetch updated data after successful update
            })
            .catch(error => {
                console.error('Error updating mission:', error);
            });
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

    const handleDeleteNewPhoto = (e, index) => {
        e.preventDefault();
        const updatedPhotos = [...photo];
        updatedPhotos.splice(index, 1);
        setPhoto(updatedPhotos);
        const updatedPhotoAlts = [...initialphotoAlts];
        updatedPhotoAlts.splice(index, 1);
        setInitialPhotoAlts(updatedPhotoAlts);
    };

    const handleDeleteInitialPhoto = (e, photoFilename, index) => {
        e.preventDefault();
        axios.delete(`/api/vision/image/${photoFilename}/${index}`, { withCredentials: true })
            .then(response => {
                const updatedPhotos = initialPhotos.filter(photo => photo !== photoFilename);
                setInitialPhotos(updatedPhotos);
                const updatedPhotoAlts = [...initialphotoAlts];
                updatedPhotoAlts.splice(index, 1);
                setInitialPhotoAlts(updatedPhotoAlts);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className='p-4'>
                {/* <ToastContainer /> */}
                <h1 className='text-xl font-bold  text-gray-700 font-serif uppercase text-center'>Manage Vision</h1>
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
                                    Alternative Text:
                                    <input
                                        type="text"
                                        id={`alt-${index}`}
                                        value={initialphotoAlts[index]}
                                        onChange={(e) => handleInitialAltTextChange(e, index)}
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
                    <div className="fle flex-wrap gap-4 mt-4">
                        {photo.map((file, index) => (
                            <div key={index} className="relative w-56">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`New Photo ${index + 1}`}
                                    className="w-56 h-32 object-cover"
                                />
                                <label htmlFor={`alt-new-${index}`} className="block mt-2">
                                    Alternative Text:
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
                                    className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex justify-center items-center"
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
                    className="bg-slate-700 text-white py-2 px-4 rounded hover:bg-slate-800"
                >
                    Update Vision
                </button>
            </form>

        </div>
    );
};

export default VisionForm;
