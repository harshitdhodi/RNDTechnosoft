import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditLogotype = () => {
  const { id: logotypeId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState([]);
  const [initialPhoto, setInitialPhoto] = useState([]);
  const [photoAlt, setPhotoAlt] = useState([]);
  const [imgTitle, setImgTitle] = useState([]);
  const [initialphotoAlts, setInitialPhotoAlts] = useState([]);
  const [initialImgtitle, setInitialImgtitle] = useState([]);

  useEffect(() => {
    const fetchLogotypeData = async () => {
      try {
        const response = await axios.get(
          `/api/logotype/getLogotypeById?id=${logotypeId}`,
          { withCredentials: true }
        );
        const logotypeData = response.data.data;
        setTitle(logotypeData.title);
        setDescription(logotypeData.description);
        setInitialPhoto(logotypeData.photo);
        setInitialPhotoAlts(logotypeData.alt);
        setInitialImgtitle(logotypeData.imgtitle);
      } catch (error) {
        console.error("Error fetching logotype:", error);
        toast.error("Failed to fetch logotype data.");
      }
    };

    fetchLogotypeData();
  }, [logotypeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Title and description are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      photo.forEach((p) => formData.append("photo", p));
      formData.append("alt", JSON.stringify(photoAlt));
      formData.append("imgtitle", JSON.stringify(imgTitle));

      await axios.put(
        `/api/logotype/updateLogotype?id=${logotypeId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      navigate("/logotype");
      toast.success("Logotype updated successfully!");
    } catch (error) {
      console.error("Error updating logotype:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleFileChange = (e) => {
    const newPhotos = Array.from(e.target.files);
    setPhoto(newPhotos);
  };

  const handleInitialAltTextChange = (e, index) => {
    const updatedAlts = [...initialphotoAlts];
    updatedAlts[index] = e.target.value;
    setInitialPhotoAlts(updatedAlts);
  };

  const handleInitialImgtitleChange = (e, index) => {
    const updatedTitles = [...initialImgtitle];
    updatedTitles[index] = e.target.value;
    setInitialImgtitle(updatedTitles);
  };

  const handleNewAltTextChange = (e, index) => {
    const updatedAlts = [...photoAlt];
    updatedAlts[index] = e.target.value;
    setPhotoAlt(updatedAlts);
  };

  const handleNewImgtitleChange = (e, index) => {
    const updatedTitles = [...imgTitle];
    updatedTitles[index] = e.target.value;
    setImgTitle(updatedTitles);
  };

  const handleDeleteInitialPhoto = async (e, index) => {
    e.preventDefault();
    const imageFilename = initialPhoto[index];

    try {
      await axios.delete(
        `/api/logotype/${logotypeId}/image/${imageFilename}/${index}`,
        {
          withCredentials: true,
        }
      );
      const updatedPhotos = initialPhoto.filter((_, i) => i !== index);
      const updatedAlts = initialphotoAlts.filter((_, i) => i !== index);
      const updatedTitles = initialImgtitle.filter((_, i) => i !== index);

      setInitialPhoto(updatedPhotos);
      setInitialPhotoAlts(updatedAlts);
      setInitialImgtitle(updatedTitles);
      toast.success("Photo and alt text deleted successfully!");
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Failed to delete photo.");
    }
  };

  const handleDeleteNewPhoto = (e, index) => {
    e.preventDefault();
    const updatedPhotos = photo.filter((_, i) => i !== index);
    setPhoto(updatedPhotos);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <ToastContainer />
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">
        Edit Logotype
      </h1>

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
        <label htmlFor="description" className="block font-semibold mb-2">
          Description
        </label>
        <ReactQuill
          value={description}
          onChange={setDescription}
          className="quill"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Current Photos</label>
        <div className="flex flex-wrap gap-4">
          {initialPhoto.map((photo, index) => (
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
                  value={initialphotoAlts[index] || ""}
                  onChange={(e) => handleInitialAltTextChange(e, index)}
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </label>
              <label htmlFor={`imgtitle-${index}`} className="block mt-2">
                Title Text:
                <input
                  type="text"
                  id={`imgtitle-${index}`}
                  value={initialImgtitle[index] || ""}
                  onChange={(e) => handleInitialImgtitleChange(e, index)}
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </label>
              <button
                onClick={(e) => handleDeleteInitialPhoto(e, index)}
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
              <label htmlFor={`alt-new-${index}`} className="block mt-2">
                Alternative Text:
                <input
                  type="text"
                  id={`alt-new-${index}`}
                  value={photoAlt[index] || ""}
                  onChange={(e) => handleNewAltTextChange(e, index)}
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </label>
              <label htmlFor={`imgtitle-new-${index}`} className="block mt-2">
                Image Title Text:
                <input
                  type="text"
                  id={`imgtitle-new-${index}`}
                  value={imgTitle[index] || ""}
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

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Update Logotype
      </button>
    </form>
  );
};

export default EditLogotype;
