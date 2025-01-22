import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const MissionForm = () => {
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState([]);
  const [status, setStatus] = useState('');
  const [initialPhotos, setInitialPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [initialphotoAlts, setInitialPhotoAlts] = useState([]);
  const navigate = useNavigate();

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

  const fetchMission = async () => {
    try {
      const response = await axios.get('/api/mission/getMission', { withCredentials: true });
      const mission = response.data.data || {};
      setTitle(mission.title || '');
      setDescription(mission.description || '');
      setInitialPhotos(mission.photo || []);
      setStatus(mission.status || 'active');
      setInitialPhotoAlts(mission.alt || []);
    } catch (error) {
      console.error('Error fetching mission data:', error);
    }
  };

  useEffect(() => {
    fetchMission();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('status', status);

    const combinedAlts = [...initialphotoAlts, ...photoAlts];
    photo.forEach((p) => {
      formData.append('photo', p);
    });

    combinedAlts.forEach((a) => {
      formData.append('alt', a);
    });

    try {
      await axios.put('/api/mission/updateMission', formData, { withCredentials: true });
      notify();
      setPhoto([]);
      setPhotoAlts([]);
      await fetchMission();
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

  const handleDeleteNewPhoto = (e, index) => {
    e.preventDefault();
    const updatedPhotos = [...photo];
    updatedPhotos.splice(index, 1);
    setPhoto(updatedPhotos);
    const updatedPhotoAlts = [...photoAlts];
    updatedPhotoAlts.splice(index, 1);
    setPhotoAlts(updatedPhotoAlts);
  };

  const handleDeleteInitialPhoto = (e, photoFilename, index) => {
    e.preventDefault();
    axios.delete(`/api/mission/image/${photoFilename}/${index}`, { withCredentials: true })
      .then(response => {
        const updatedPhotos = initialPhotos.filter((_, i) => i !== index);
        setInitialPhotos(updatedPhotos);
        const updatedPhotoAlts = [...initialphotoAlts];
        updatedPhotoAlts.splice(index, 1);
        setInitialPhotoAlts(updatedPhotoAlts);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=missionvision', { withCredentials: true });
      const { heading, subheading } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
    } catch (error) {
      console.error(error);
    }
  };

  const saveHeadings = async () => {
    try {
      await axios.put('/api/pageHeading/updateHeading?pageType=missionvision', {
        pagetype: 'missionvision',
        heading,
        subheading,
      }, { withCredentials: true });
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

  return (
    <div>
      <ToastContainer />
      <div className="mb-8 m-4 border border-gray-200 shadow-lg p-4 rounded ">
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
        </div>
        <button
          onClick={saveHeadings}
          className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition  duration-300 font-serif"
        >
          Save
        </button>
      </div>
      <form onSubmit={handleSubmit} className='p-4'>
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Manage Mission</h1>
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
          <div className="grid grid-cols-3 gap-4">
            {initialPhotos.map((photo, index) => (
              <div key={index} className="relative w-56">
                <img
                  src={`/api/image/download/${photo}`}
                  alt={`Photo ${index + 1}`}
                  className="w-56 h-32 object-cover"
                />
                <button
                  onClick={(e) => handleDeleteInitialPhoto(e, photo, index)}
                  className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex justify-center items-center"
                >
                  &times;
                </button>
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
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Add New Photos</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4"
          />
          {photo.map((p, index) => (
            <div key={index} className="relative w-56 mb-2">
              <img
                src={URL.createObjectURL(p)}
                alt={`New Photo ${index + 1}`}
                className="w-56 h-32 object-cover"
              />
              <button
                onClick={(e) => handleDeleteNewPhoto(e, index)}
                className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex justify-center items-center"
              >
                &times;
              </button>
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
            </div>
          ))}
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
        <div className="">
          <button
            type="submit"
            className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300"
          >
            Update Mission
          </button>
        </div>
      </form>
    </div>
  );
};

export default MissionForm;
