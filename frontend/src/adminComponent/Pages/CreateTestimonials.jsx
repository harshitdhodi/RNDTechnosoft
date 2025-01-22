import React, { useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewTestimonialForm = () => {
  const { categoryId } = useParams();
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [testimony, setTestimony] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [imgtitle, setImgtitle] = useState([])
  const [video, setVideo] = useState(null);
  const [altVideo, setVideoAlt] = useState("");
  const [videotitle, setVideotitle] = useState("")
  const [heading, setHeading] = useState("");
  const [rating, setRating] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState(true);
  const navigate = useNavigate();

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
    setPhotoAlts([...imgtitle, ...newImgtitles]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
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
      formData.append('name', name);
      formData.append('designation', designation);
      formData.append('testimony', testimony);
      formData.append('heading', heading);
      formData.append('rating', rating);
      formData.append('categoryId', categoryId);

      formData.append('priority', priority);
      formData.append('status', status); // Sending the status as a boolean
      formData.append('altVideo', altVideo);
      formData.append('videotitle', videotitle)
      photos.forEach((photo, index) => {
        formData.append('photo', photo);
        formData.append('alt', photoAlts[index]);
        formData.append('imgtitle', imgtitle)

      });

      if (video) {
        formData.append('video', video);
      }

      await axios.post('/api/testimonial/insertTestinomial', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      // Reset form fields
      setName("");
      setDesignation("");
      setTestimony("");
      setHeading("");
      setRating("");
      setPriority("medium");
      setPhotos([]);
      setVideo(null);
      setVideoAlt("");
      setImgtitle([])
      setVideotitle("")
      setStatus(true);
      setPhotoAlts([]);
      navigate('/services');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <ToastContainer />
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Add Testimonial</h1>
      <div className="mb-4">
        <label htmlFor="name" className="block font-semibold mb-2">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="designation" className="block font-semibold mb-2">Designation</label>
        <input
          type="text"
          id="designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="rating" className="block font-semibold mb-2">
          Rating
        </label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(parseFloat(e.target.value))}
          step="0.5"
          min="1"
          max="5"
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>

      <div className="mb-8">
        <label htmlFor="testimony" className="block font-semibold mb-2">Testimony</label>
        <ReactQuill
          value={testimony}
          onChange={setTestimony}
          modules={modules}
          className="quill"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Priority</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="high"
              checked={priority === "high"}
              onChange={() => setPriority("high")}
              className="mr-2"
            />
            High
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="medium"
              checked={priority === "medium"}
              onChange={() => setPriority("medium")}
              className="mr-2"
            />
            Medium
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="low"
              checked={priority === "low"}
              onChange={() => setPriority("low")}
              className="mr-2"
            />
            Low
          </label>
        </div>
      </div>
      <div className="mt-12">
        <label htmlFor="photo" className="block font-semibold mb-2">Photos</label>
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
              <div key={index} className="relative group flex flex-col items-center w-56">
                <div className="relative w-56">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Testimonial ${index + 1}`}
                    className="w-56 h-32 object-cover"
                  />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
                  >
                    X
                  </button>
                </div>
                <label className="block mt-2">
                  Alternative Text:
                  <input
                    type="text"
                    value={photoAlts[index]}
                    onChange={(e) => {
                      const newPhotoAlts = [...photoAlts];
                      newPhotoAlts[index] = e.target.value;
                      setPhotoAlts(newPhotoAlts);
                    }}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </label>
                <label className="block mt-2">
                  Title Text
                  <input
                    type="text"
                    value={imgtitle[index]}
                    onChange={(e) => {
                      const newImgtitles = [...imgtitle];
                      newImgtitles[index] = e.target.value;
                      setImgtitle(newImgtitles);
                    }}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4">
        <label htmlFor="video" className="block font-semibold mb-2">Video</label>
        <input
          type="file"
          id="video"
          onChange={handleVideoChange}
          className="border rounded focus:outline-none"
          accept="video/*"
        />
        {video && (
          <div className="mt-4">
            <label htmlFor="videoAlt" className="block font-semibold mb-2">Video Alt Text</label>
            <input
              type="text"
              id="videoAlt"
              value={altVideo}
              onChange={(e) => setVideoAlt(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none"
              required
            />
          </div>
        )}
        {video && (
          <div className="mt-4">
            <label htmlFor="videotitle" className="block font-semibold mb-2">Video title Text</label>
            <input
              type="text"
              id="videotitle"
              value={videotitle}
              onChange={(e) => setVideotitle(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none"
              required
            />
          </div>
        )}
      </div>
      <div className="mt-4">
        <label className="block font-semibold mb-2">Status</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value={true}
              checked={status === true}
              onChange={() => setStatus(true)}
              className="mr-2"
            />
            Active
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value={false}
              checked={status === false}
              onChange={() => setStatus(false)}
              className="mr-2"
            />
            Inactive
          </label>
        </div>
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none"
        >
          Add Testimonial
        </button>
      </div>
    </form>
  );
};

export default NewTestimonialForm;
