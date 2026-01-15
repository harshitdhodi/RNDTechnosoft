import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewServiceForm = () => {
  const { categoryId } = useParams(); // Extract categoryId and subcategoryId from URL
  const [heading, setHeading] = useState(""); // State for heading
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [imgtitle, setImgtitle] = useState([]);
  const [video, setVideo] = useState(null);
  const [altVideo, setVideoAlt] = useState("");
  const [videotitle, setVideotitle] = useState("");
  const [status, setStatus] = useState(true);
  const [questions, setQuestions] = useState([{ question: "", answer: "" }]);
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ font: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image", "video"],
      [{ direction: "rtl" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
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
    setImgtitle([...imgtitle, ...newImgtitles]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleDeleteImage = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    setPhotoAlts((prevPhotoAlts) =>
      prevPhotoAlts.filter((_, i) => i !== index)
    );
    setImgtitle((prevImgtitle) => prevImgtitle.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", answer: "" }]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!heading.trim()) {
      toast.error("Please enter a heading");
      return;
    }
    
    if (!description.trim() || description === "<p><br></p>") {
      toast.error("Please enter a description");
      return;
    }
    
    if (photos.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }
    
    // Validate photo alts and titles
    const hasEmptyAlt = photoAlts.some(alt => !alt.trim());
    const hasEmptyTitle = imgtitle.some(title => !title.trim());
    
    if (hasEmptyAlt) {
      toast.error("Please enter alt text for all photos");
      return;
    }
    
    if (hasEmptyTitle) {
      toast.error("Please enter a title for all photos");
      return;
    }
    
    // Validate questions
    const hasEmptyQuestion = questions.some(q => !q.question.trim() || !q.answer.trim());
    if (hasEmptyQuestion) {
      toast.error("Please fill in all question and answer fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("heading", heading); // Use heading as the name field
      formData.append("description", description);
      formData.append("status", status);
      formData.append("altVideo", altVideo);
      formData.append("categoryId", categoryId); // Send categoryId from URL
      formData.append("videotitle", videotitle);
      photos.forEach((photo, index) => {
        formData.append("photo", photo);
        formData.append("alt", photoAlts[index]);
        formData.append("imgtitle", imgtitle[index]);
      });

      if (video) {
        formData.append("video", video);
      }

      questions.forEach((qa) => {
        formData.append("questions", JSON.stringify(qa));
      });

      await axios.post("/api/serviceDetails/insertServiceDetail", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      // Reset form fields
      setDescription("");
      setHeading(""); // Reset heading
      setPhotos([]);
      setVideo(null);
      setVideoAlt("");
      setStatus(true);
      setPhotoAlts([]);
      setImgtitle([]);
      setVideotitle("");
      setQuestions([{ question: "", answer: "" }]);
      navigate(`/services`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create service.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Service Detail</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Heading <span className="text-red-500">*</span>
          </label>
          <ReactQuill
            value={heading}
            onChange={setHeading}
            modules={modules}
            placeholder="Enter heading here..."
            className="quill-editor"
            required
          />
          <style jsx global>{`
            .quill-editor .ql-editor {
              min-height: 100px;
              padding-bottom: 1.5rem;
              padding-top: 0.5rem;
            }
            .quill-editor .ql-editor.ql-blank::before {
              color: #6b7280;
              font-style: normal;
              left: 15px;
              right: 15px;
              top: 0.75rem;
              pointer-events: none;
            }
          `}</style>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            modules={modules}
            placeholder="Enter description here..."
            className="quill-editor"
            required
          />
          <style jsx global>{`
            .quill-editor .ql-editor {
              min-height: 100px;
              padding-bottom: 1.5rem;
              padding-top: 0.5rem;
            }
            .quill-editor .ql-editor.ql-blank::before {
              color: #6b7280;
              font-style: normal;
              left: 15px;
              right: 15px;
              top: 0.75rem;
              pointer-events: none;
            }
          `}</style>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Photos (Max 5) <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="mt-1 block w-full"
            required={photos.length === 0}
          />
          {photos.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="border rounded p-2">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Image Title"
                      value={imgtitle[index] || ""}
                      onChange={(e) => {
                        const newTitles = [...imgtitle];
                        newTitles[index] = e.target.value;
                        setImgtitle(newTitles);
                      }}
                      className="w-full p-1 border rounded mt-1"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Alt Text"
                      value={photoAlts[index] || ""}
                      onChange={(e) => {
                        const newAlts = [...photoAlts];
                        newAlts[index] = e.target.value;
                        setPhotoAlts(newAlts);
                      }}
                      className="w-full p-1 border rounded mt-1"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="mt-1 text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Video
          </label>
          <input
            type="file"
            id="video"
            onChange={handleVideoChange}
            className="mt-1 block w-full"
            accept="video/*"
          />
          {video && (
            <div className="mt-4">
              <label htmlFor="videoAlt" className="block font-semibold mb-2">
                Video Alt Text
              </label>
              <input
                type="text"
                id="videoAlt"
                value={altVideo}
                onChange={(e) => setVideoAlt(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none"
                required
              />
              <div className="mt-4">
                <label htmlFor="videotitle" className="block font-semibold mb-2">
                  Video title Text
                </label>
                <input
                  type="text"
                  id="videotitle"
                  value={videotitle}
                  onChange={(e) => setVideotitle(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none"
                  required
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            FAQ Section <span className="text-red-500">*</span>
          </label>
          {questions.map((q, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Question {index + 1}</h3>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                name="question"
                placeholder="Enter question"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, e)}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <ReactQuill
                value={q.answer}
                onChange={(event) => handleQuestionChange(index, event)}
                modules={modules}
                placeholder="Enter answer here..."
                className="quill-editor"
              />
              <style jsx global>{`
                .quill-editor .ql-editor {
                  min-height: 100px;
                  padding-bottom: 1.5rem;
                  padding-top: 0.5rem;
                }
                .quill-editor .ql-editor.ql-blank::before {
                  color: #6b7280;
                  font-style: normal;
                  left: 15px;
                  right: 15px;
                  top: 0.75rem;
                  pointer-events: none;
                }
              `}</style>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddQuestion}
            className="mt-2 text-white bg-[#324154] border border-gray-300 rounded p-2 text-sm"
          >
            + Add Another Question
          </button>
        </div>

        <div className="flex  items-center gap-2">
          <label className="block text-sm font-medium text-gray-700">
            Status <span className="text-red-500">*</span>
          </label>
          <input
            type="checkbox"
            id="status"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
            className="h-4 w-4 text-[#324154] focus:ring-[#324154] border-gray-300 rounded"
          />
          <label htmlFor="status" className="ml-2 block text-sm text-gray-700">
            Active
          </label>
        </div>

        <div className="flex justify-start space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#324154]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#324154] hover:bg-[#324154] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#324154]"
          >
            Save Service
          </button>
        </div>
      </form>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default NewServiceForm;
