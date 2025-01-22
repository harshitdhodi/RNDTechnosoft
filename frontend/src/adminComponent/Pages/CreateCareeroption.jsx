import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewCareerForm = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [jobType, setJobType] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [requirement, setRequirement] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [imgTitles, setImgTitles] = useState([]);
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
    const newImgTitles = Array.from({ length: files.length }, () => "");
    setPhotoAlts([...photoAlts, ...newPhotoAlts]);
    setImgTitles([...imgTitles, ...newImgTitles]);
  };

  const handleDeleteImage = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    setPhotoAlts((prevPhotoAlts) => prevPhotoAlts.filter((_, i) => i !== index));
    setImgTitles((prevImgTitles) => prevImgTitles.filter((_, i) => i !== index));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('jobtitle', jobTitle);
      formData.append('department', department);
      formData.append('jobType', jobType);
      formData.append('employmentType', employmentType);
      formData.append('requirement', requirement);
      formData.append('description', description);
      
      photos.forEach((photo, index) => {
        formData.append('photo', photo);
        formData.append('alt', photoAlts[index]);
        formData.append('imgTitle', imgTitles[index]);
      });

      formData.append('status', status);

      const response = await axios.post('/api/careeroption/CreateCareeroption', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      // Reset form fields
      setJobTitle("");
      setDepartment("");
      setJobType("");
      setEmploymentType("");
      setRequirement("");
      setDescription("");
      setPhotos([]);
      setPhotoAlts([]);
      setImgTitles([]);
      setStatus("active");
      navigate('/careeroption');
    } catch (error) {
      console.error(error);
      toast.error("Error adding career option");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <ToastContainer />
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Add Career Option</h1>
      
      <div className="mb-4">
        <label htmlFor="jobTitle" className="block font-semibold mb-2">Job Title</label>
        <input
          type="text"
          id="jobTitle"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="department" className="block font-semibold mb-2">Department</label>
        <input
          type="text"
          id="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="jobType" className="block font-semibold mb-2">Job Type</label>
        <select
          id="jobType"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        >
          <option value="">Select Job Type</option>
          <option value="Onsite">Onsite</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="employmentType" className="block font-semibold mb-2">Employment Type</label>
        <select
          id="employmentType"
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        >
          <option value="">Select Employment Type</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
      </div>

      <div className="">
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
              <div key={index} className="relative w-56 group flex flex-col items-center">
                <div className="relative w-56">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Career ${index + 1}`}
                    className="h-32 w-56 object-cover"
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
                  Image Title:
                  <input
                    type="text"
                    value={imgTitles[index]}
                    onChange={(e) => {
                      const newImgTitles = [...imgTitles];
                      newImgTitles[index] = e.target.value;
                      setImgTitles(newImgTitles);
                    }}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8 mt-4">
        <label htmlFor="description" className="block font-semibold mb-2">Description</label>
        <ReactQuill
          value={description}
          onChange={setDescription}
          modules={modules}
          className="quill"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="requirement" className="block font-semibold mb-2">Requirement</label>
        <ReactQuill
          value={requirement}
          onChange={setRequirement}
          modules={modules}
          className="quill"
        />
      </div>
     

      <div className="mb-4">
        <label htmlFor="status" className="block font-semibold mb-2">Status</label>
        <div className="flex items-center">
          <label className="mr-4 text-green-500">
            <input
              type="radio"
              value="active"
              checked={status === "active"}
              onChange={() => setStatus("active")}
            />
            Active
          </label>
          <label className="text-red-500">
            <input
              type="radio"
              value="inactive"
              checked={status === "inactive"}
              onChange={() => setStatus("inactive")}
            />
            Inactive
          </label>
        </div>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">
        Add Career Option
      </button>
    </form>
  );
};

export default NewCareerForm;
