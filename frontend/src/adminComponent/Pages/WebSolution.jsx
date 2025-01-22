import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SubsectionsComponent from "../Pages/SubsectionEditor";
import QuestionsComponent from "../Pages/QuestionEditor";

const EditExtraPage = () => {
  const { contentType } = useParams();
  const [photo, setPhoto] = useState([]);
  const [video, setVideo] = useState("");
  const [videoAlt, setVideoAlt] = useState("");
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([{ question: "", answer: "" }]);
  const [subsections, setSubsections] = useState([
    { photo: "", photoAlt: "", title: "", description: "" },
  ]);
  const [status, setStatus] = useState(false);

  const [contentId, setContentId] = useState("");

  const [videotitle, setVideotitle] = useState("")
  const [imgtitle, setImgtitle] = useState([])

  const [initialPhotos, setInitialPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [initialphotoAlts, setInitialPhotoAlts] = useState([]);
  const [initialVideoAlt, setInitialVideoAlt] = useState("");
  const [initialImgtitle, setInitialImgtitle] = useState([]);
  const [initialVideo, setInitialVideo] = useState("")
  const [initialVideotitle, setInitialVideotitle] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    fetchContentDetails();
  }, []);


  const fetchContentDetails = async () => {
    try {
      const response = await axios.get(`/api/content/types/${contentType}`, {
        withCredentials: true,
      });
      const content = response.data[0];
      setHeading(content.heading || "");
      setSubheading(content.subheading || "");
      setDescription(content.description || "");
      setInitialPhotos(content.photo);
      setStatus(content.status);

      setInitialPhotoAlts(content.photoAlt);
      setInitialVideo(content.video);

      setInitialVideoAlt(content.videoAlt);
      setInitialImgtitle(content.imgtitle)
      setInitialVideotitle(content.videotitle)
      setQuestions(
        content.questions.length > 0
          ? content.questions
          : [{ question: "", answer: "" }]
      );
      setSubsections(
        content.subsections.length > 0
          ? content.subsections
          : [{ photo: "", photoAlt: "", title: "", description: "" }]
      );
      setContentId(content._id || "");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("heading", heading);
      formData.append("subheading", subheading);
      formData.append("description", description);
      formData.append("status", status);


      formData.append('video', video || initialVideo);
      formData.append('videoAlt', videoAlt || initialVideoAlt);
      formData.append('videotitle', videotitle || initialVideotitle); // Ensure this line is correct


      const combinedAlts = [...initialphotoAlts, ...photoAlts];
      const combinedImgtitle = [...initialImgtitle, ...imgtitle];

      photo.forEach((p) => {
        formData.append('photo', p);
      });

      combinedAlts.forEach((a) => {
        formData.append('photoAlt', a);
      });

      combinedImgtitle.forEach((m) => {
        formData.append('imgtitle', m);
      });

      // Log formData to the console
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      await axios.put(`/api/content/${contentType}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      navigate(`/extrapages/${contentType}`);
    } catch (error) {
      console.error(error);
    }
  };



  const handleFileChange = (e) => {
    const newPhotos = Array.from(e.target.files);
    setPhoto([...photo, ...newPhotos]);
  };

  const handleVideoChange = (e) => {
    const selectedVideo = e.target.files[0];
    console.log(selectedVideo)
    setVideo(selectedVideo);
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
    setImgtitle(newImgtitles);
  };




  const handleDeleteInitialPhoto = async (e, photoFilename, index) => {
    e.preventDefault();
    await axios.delete(
      `/api/content/deletePhotoAndAltText/${contentId}/${photoFilename}/${index}`, { withCredentials: true })
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
    setPhotoAlts(updatedImgtitle);
  };

  const handleDeleteVideo = async (e) => {
    e.preventDefault();
    try {
      const videoFilename = video.name; // Get the current video filename
      await axios.delete(`/api/content/${contentId}/video/${videoFilename}`, {
        withCredentials: true,
      });
      // Reset video state
      setVideo(null);
      setVideoAlt(""); // Optionally reset alt text
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="p-4">
        <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit Testimonial</h1>
        {/* Heading */}
        <div className="mb-4">
          <label htmlFor="heading" className="block font-semibold mb-2">
            Heading
          </label>

          <ReactQuill
            value={heading}
            onChange={setHeading}
            className="bg-white"
            modules={modules} // Include modules for image handling

          />
        </div>
        {/* Subheading */}
        <div className="mb-4">
          <label htmlFor="subheading" className="block font-semibold mb-2">
            Subheading
          </label>

          <ReactQuill
            value={subheading}
            onChange={setSubheading}
            className="bg-white"
            modules={modules} // Include modules for image handling

          />
        </div>


        {/* Description */}
        <div className="mb-8">
          <label htmlFor="description" className="block font-semibold mb-2">
            Description
          </label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            className="bg-white"
            modules={modules} // Include modules for image handling

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
                <label htmlFor={`alt-${index}`} className="block mt-2">
                  Title Text:
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
                  className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 flex justify-center items-center"
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
                <label htmlFor={`imgtitle-new-${index}`} className="block mt-2">
                  Alternative Text:
                  <input
                    type="text"
                    id={`alt-new-${index}`}
                    value={photoAlts[index] || ""}
                    onChange={(e) => handleNewAltTextChange(e, index)}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </label>
                <label htmlFor={`imgtitle-new-${index}`} className="block mt-2">
                  Title Text:
                  <input
                    type="text"
                    id={`imgtitle-new-${index}`}
                    value={imgtitle[index] || ""}
                    onChange={(e) => handleNewImgtitleChange(e, index)}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </label>
                <button
                  onClick={(e) => handleDeleteNewPhoto(e, index)}
                  className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 flex justify-center items-center"
                >
                  <span className="text-xs">X</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="video" className="block font-semibold mb-2">
            Upload Video
          </label>
          <input
            type="file"
            id="video"
            onChange={handleVideoChange}
            accept="video/*"
            className="p-2 border rounded"
          />
          {(video || initialVideo) && (
            <div className="mt-4">
              <label className="block font-semibold mb-2">Current Video</label>
              <div className="relative w-56">
                <video
                  src={video ? URL.createObjectURL(video) : `/api/video/download/${initialVideo}`} // Update this to match your API endpoint for video
                  controls
                  className="w-56 h-32 object-cover"
                />
                <label htmlFor="videoAlt" className="block mt-2">
                  Video Alt Text:
                  <input
                    type="text"
                    id="videoAlt"
                    value={videoAlt || initialVideoAlt}
                    onChange={(e) => setVideoAlt(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </label>
                <label htmlFor="videotitle" className="block mt-2">
                  title Text:
                  <input
                    type="text"
                    id="videotitle"
                    value={videotitle || initialVideotitle}
                    onChange={(e) => setVideotitle(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </label>
                <button
                  onClick={handleDeleteVideo}
                  className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 flex justify-center items-center"
                >
                  <span className="text-xs">X</span>
                </button>
              </div>
            </div>
          )}
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

        <div className="mt-8 text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Update Detsils
          </button>
        </div>
      </form>

      {/* Subsections Component */}
      <SubsectionsComponent
        subsections={subsections}
        setSubsections={setSubsections}
        contentId={contentId}
      />

      {/* Questions Component */}
      <QuestionsComponent
        questions={questions}
        setQuestions={setQuestions}
        contentId={contentId}
      />
    </div>

  );
};

export default EditExtraPage;
