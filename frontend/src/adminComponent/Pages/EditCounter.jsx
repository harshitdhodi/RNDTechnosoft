import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

const EditCounterForm = () => {
  const [title, setTitle] = useState("");
  const [no, setNo] = useState("");
  const [sign, setSign] = useState("");
  const [status, setStatus] = useState("active");
  const [photo, setPhoto] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [altText, setAltText] = useState("");
  const [imgtitle,setImgtitle]=useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCounter = async () => {
      try {
        const response = await axios.get(`/api/counter/getCounterById?id=${id}`, { withCredentials: true });
        const counter = response.data;
        setTitle(counter.title);
        setNo(counter.no);
        setSign(counter.sign);
        setStatus(counter.status);
        setCurrentPhoto(counter.photo);
        setAltText(counter.alt);
        setImgtitle(counter.imgtitle)
      } catch (error) {
        console.error(error);
      }
    };

    fetchCounter();
  }, [id]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleDeleteImage = () => {
    setPhoto(null);
    setCurrentPhoto("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("no", no);
    formData.append("sign", sign);
    formData.append("status", status);
    formData.append("alt", altText);
    formData.append("imgtitle",imgtitle)
    if (photo) {
      formData.append("photo", photo);
    } else if (currentPhoto) {
      formData.append("photo", currentPhoto);
    }

    try {
      await axios.put(`/api/counter/updateCounter?id=${id}`, formData, { withCredentials: true });
      navigate('/counter');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit Counter</h1>
      <div className="mb-4">
        <label htmlFor="title" className="block font-semibold mb-2">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="no" className="block font-semibold mb-2">Number</label>
        <input
          type="number"
          id="no"
          value={no}
          onChange={(e) => setNo(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="sign" className="block font-semibold mb-2">Sign</label>
        <select
          id="sign"
          value={sign}
          onChange={(e) => setSign(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        >
          <option value="" disabled>Select Sign</option>
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">*</option>
          <option value="/">/</option>
          <option value="%">%</option>
          <option value="₹">₹</option>
          <option value="k">k</option>
          <option value="units">units</option>
          <option value="km">km</option>
          <option value="m">m</option>
          <option value="L">L</option>
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="s">s</option>
          <option value="min">min</option>
          <option value="h">h</option>
          <option value="days">days</option>
          <option value="weeks">weeks</option>
          <option value="months">months</option>
          <option value="years">years</option>
        </select>
      </div>
      <div className="mb-8">
        <label htmlFor="photo" className="block font-semibold mb-2">Photo</label>
        <input
          type="file"
          name="photo"
          id="photo"
          onChange={handlePhotoChange}
          className="border rounded focus:outline-none"
          accept="image/*"
        />

        {(photo || currentPhoto) && (
          <div className="mt-2 w-56 relative group">
            <img
              src={photo ? URL.createObjectURL(photo) : `/api/logo/download/${currentPhoto}`}
              alt={altText}
              className="h-32 w-56 object-cover"
            />
            <button
              type="button"
              onClick={handleDeleteImage}
              className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
            >
              X
            </button>
            <div className="mb-4">
              <label htmlFor="alt" className="block font-semibold mb-2">Alternative Text</label>
              <input
                type="text"
                id="alt"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-56 p-2 border rounded focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="imgtitle" className="block font-semibold mb-2">Title Text</label>
              <input
                type="text"
                id="imgtitle"
                value={imgtitle}
                onChange={(e) => setImgtitle(e.target.value)}
                className="w-56 p-2 border rounded focus:outline-none"
                required
              />
            </div>
          </div>

        )}
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
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Update Counter</button>
    </form>
  );
};

export default EditCounterForm;
