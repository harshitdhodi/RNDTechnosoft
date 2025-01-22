import React, { useState, useEffect } from "react";
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

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


const sections = [
  { value: "PrivacyPolicy", label: "Privacy Policy" },
  { value: "TermConditions", label: "Terms & Conditions" },
  { value: "CookiePolicy", label: "Cookie Policy" },
  { value: "Contact", label: "Contact" },
  { value: "Collaborationinquiries", label: "Collaboration inquiries" },
];



const NewBannerForm = () => {
  const [section, setSection] = useState("Privacy Policy");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [imgtitle,setImgtitle] = useState([])
  const [status, setStatus] = useState("active");
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState(1); // State to hold selected priority

  const navigate = useNavigate();



  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    // Limit the number of photos to 5
    if (photos.length + files.length > 5) {
      toast.error("You can only upload up to 5 photos");
      return;
    }
    setPhotos([...photos, ...files]);
    // Initialize alt text for each new photo
    const newPhotoAlts = Array.from({ length: files.length }, () => "");
    setPhotoAlts([...photoAlts, ...newPhotoAlts]);
    // Initialize alt text for each new photo
    const newImgtitles = Array.from({ length: files.length }, () => "");
    setImgtitle([...imgtitle, ...newImgtitles]);
  };


  const fetchPriorityOptions = async (section) => {
    try {
        const response = await axios.get(`/api/banner/getCountBySection?section=${section}`, { withCredentials: true });
        const count = response.data;
        if (count > 0) {
            const options = Array.from({ length: count + 1 }, (_, i) => i + 1);
            setPriorityOptions(options);
        } else {
            setPriorityOptions([1]);
        }
    } catch (error) {
        console.error(error);
        setPriorityOptions([1]);
    }
  };

  useEffect(() => {
    fetchPriorityOptions(section);
  }, [section]); 

  const handleDeleteImage = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    setPhotoAlts((prevPhotoAlts) => prevPhotoAlts.filter((_, i) => i !== index));
    setImgtitle((prevImgtitle) => prevImgtitle.filter((_, i) => i !== index));

  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('section', section);
      formData.append('title', title);
      formData.append('details', details);
      formData.append('status', status);
      formData.append('priority', selectedPriority);
      photos.forEach((photo, index) => {
        formData.append(`photo`, photo);
        formData.append(`alt`, photoAlts[index]);
        formData.append(`imgtitle`, imgtitle[index]);

      });

      const response = await axios.post('/api/banner/insertBanner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

    

      setSection("");
      setTitle("");
      setDetails("");
      setPhotos([]);
      setStatus("active");
      setPhotoAlts([]);
      setImgtitle([])
      navigate('/banner')
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
    }}
  };



  return (
    <form onSubmit={handleSubmit} className="p-4">
      <ToastContainer/>
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Add Banner</h1>
      <div className="mb-4">
        <label htmlFor="section" className="block font-semibold mb-2">
          Section
        </label>
        <select
          value={section}
          onChange={(e) => {setSection(e.target.value)}}
          className="w-full p-2 border rounded focus:outline-none"
          required
        >
          {sections.map((section, index) => (
            <option key={index} value={section.value}>{section.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="title" className="block font-semibold mb-2">
          Title</label>
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
                    value={details}
                    onChange={setDetails}
                    modules={modules} // Include modules for image handling
                    className="quill"
                />
            </div>
      <div className="mt-12">
        <label htmlFor="photo" className="block font-semibold mb-2">
          Photos
        </label>
        <input
          type="file"
          name="photo"
          id="photo"
          multiple
          onChange={handlePhotoChange}
          className="border rounded focus:outline-none "
          accept="image/*"
        />
        {photos.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative group flex flex-col items-center">
                <div className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Service ${index + 1}`}
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
                  Alt Text:
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
                  Title Text:
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
      <div className="mb-4">
                <label htmlFor="priority" className="block font-semibold mb-2">
                    Priority
                </label>
                <select
                    id="priority"
                    className="w-full p-2 border rounded focus:outline-none"
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(parseInt(e.target.value))}
                    required
                >
                    {priorityOptions.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
      <div className="mb-4">
        <label htmlFor="status" className="block font-semibold mb-2">
          Status
        </label>
        <div className="flex items-center">
          <label className="mr-4 text-green-500">
            <input
              type="radio"
              value="active"
              checked={status === "active"}
              onChange={() => setStatus("active")}
              className="mr-2"
            />
            Active
          </label>
          <label className="text-red-500">
            <input
              type="radio"
              value="inactive"
              checked={status === "inactive"}
              onChange={() => setStatus("inactive")}
              className="mr-2"
            />
            Inactive
          </label>
        </div>
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Add Banner
      </button>
    </form>
  );
};

export default NewBannerForm;