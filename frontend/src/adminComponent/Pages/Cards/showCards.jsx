// src/components/CardsTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import React Quill styles
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CardsTable() {
  const [cards, setCards] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [photo, setPhoto] = useState(null); // State for uploaded photo
  const [photoPreview, setPhotoPreview] = useState(null); // State for preview of uploaded photo
  const [existingPhoto, setExistingPhoto] = useState(null); // State for existing photo from the backend
  const [imgTitle, setImgTitle] = useState("");
  const [alt, setAlt] = useState("");


  const notify = () => {
    toast.success("Updated Successfully!");
  };

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=howrndhelp', { withCredentials: true });
      const { heading, subheading, photo,alt,imgTitle } = response.data;
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
    formData.append("pagetype", 'howrndhelp');
    formData.append("heading", heading);
    formData.append("subheading", subheading);
    formData.append("alt", alt);
    formData.append("imgTitle", imgTitle);
    if (photo) formData.append("photo", photo); // Append photo if a new one is uploaded

    try {
      await axios.put('/api/pageHeading/updateHeading?pageType=howrndhelp', formData, {
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
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file)); // Generate preview URL for photo
  };


  useEffect(() => {
    axios
      .get('/api/card/getAllCards')
      .then((response) => setCards(response.data))
      .catch((error) => console.error('Error fetching cards:', error));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`/api/card/deleteCard?id=${id}`)
      .then(() => setCards(cards.filter((card) => card._id !== id)))
      .catch((error) => console.error('Error deleting card:', error));
  };

  return (
    <div className="container mx-auto my-10">
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cards</h1>
        <Link to="/Card/createCard" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add New Card
        </Link>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Icon</th>
            <th className="py-2 px-4 border">Title</th>
            <th className="py-2 px-4 border">Questions & Answers</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card._id}>
              <td className="py-2 px-4 border">
                {card.icon && (
                  <img
                    src={`/api/icon/download/${card.icon}`}
                    alt={card.altName}
                    title={card.iconName}
                    className="h-12 w-12 object-cover"
                  />
                )}
              </td>
              <td className="py-2 px-4 border">{card.title}</td>
              <td className="py-2 px-4 border">
                {card.questionsAndAnswers.map((qa, index) => (
                  <div key={index} className="mb-2">
                    <strong>Q:</strong>
                    <ReactQuill
                      value={qa.question}
                      readOnly
                      theme="bubble"
                      className="bg-white border border-gray-300 rounded p-2"
                    />
                    <br />
                    <strong>A:</strong>
                    <ReactQuill
                      value={qa.answer}
                      readOnly
                      theme="bubble"
                      className="bg-white border border-gray-300 rounded p-2"
                    />
                  </div>
                ))}
              </td>
              <td className="py-2 px-4 border">
                <Link to={`/Card/editCard/${card._id}`} className="text-blue-500 mr-2">Edit</Link>
                <button
                  onClick={() => handleDelete(card._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CardsTable;
