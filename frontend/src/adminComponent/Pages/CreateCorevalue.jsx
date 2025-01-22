import React, { useState, useEffect } from "react";
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewCoreValueForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [imgtitle, setImgtitle] = useState([]);
  const [status, setStatus] = useState("active");
  const navigate = useNavigate();

 
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      toast.error("You can only upload up to 5 photos");
      return;
    }
    setPhotos([...photos, ...files]);
    const newPhotoAlts = Array.from({ length: files.length }, () => "");
    setPhotoAlts([...photoAlts, ...newPhotoAlts]);
    const newImgtitles = Array.from({ length: files.length }, () => "");
    setImgtitle([...imgtitle, ...newImgtitles]);
  };

  const handleDeleteImage = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    setPhotoAlts((prevPhotoAlts) => prevPhotoAlts.filter((_, i) => i !== index));
    setImgtitle((prevImgtitle) => prevImgtitle.filter((_, i) => i !== index));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      photos.forEach((photo, index) => {
        formData.append(`photo`, photo);
        formData.append(`alt`, photoAlts[index]);
        formData.append(`imgtitle`, imgtitle[index]);
      });
      formData.append('status', status);

      const response = await axios.post('/api/corevalue/createCoreValue', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      // Reset form state
      setTitle("");
      setDescription("");
      setPhotos([]);
      setStatus("active");
      setPhotoAlts([]);
      setImgtitle([]);
      navigate('/CoreValue');
    } catch (error) {
      console.error(error);
    }
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

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <ToastContainer/>
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Add Core Value</h1>
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
          modules={modules} 
          className="quill"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="photo" className="block font-semibold mb-2">
          Photos
        </label>
        <input
          type="file"
          name="photo"
          id="photo"
          multiple
          onChange={handlePhotoChange}
          className="border rounded focus:outline-none"
          accept="image/*"
        />
        {photos.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative w-56">
                <button
                  type="button"
                  className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex justify-center items-center"
                  onClick={() => handleDeleteImage(index)}
                >
                  X
                </button>
                <img
                  src={URL.createObjectURL(photo)}
                  alt={photoAlts[index]}
                  className="w-56 h-32 object-cover"
                />
                <label>Alternative Text :
                <input
                  type="text"
                  placeholder="Enter Alt Text"
                  value={photoAlts[index]}
                  onChange={(e) => {
                    const newPhotoAlts = [...photoAlts];
                    newPhotoAlts[index] = e.target.value;
                    setPhotoAlts(newPhotoAlts);
                  }}
                  className="block w-full mt-1 p-1 border rounded focus:outline-none"
                />
                </label>
                <label>Title Text :
                <input
                  type="text"
                  placeholder="Enter Title Text"
                  value={imgtitle[index]}
                  onChange={(e) => {
                    const newImgtitles = [...imgtitle];
                    newImgtitles[index] = e.target.value;
                    setImgtitle(newImgtitles);
                  }}
                  className="block w-full mt-1 p-1 border rounded focus:outline-none"
                />
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-8">
        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
          Submit
        </button>
      </div>
    </form>
  );
};

export default NewCoreValueForm;
