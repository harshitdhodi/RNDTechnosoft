import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import React Quill styles

function UpdateCard() {
  const { id } = useParams();
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState('');
  const [iconName, setIconName] = useState('');
  const [altName, setAltName] = useState('');
  const [title, setTitle] = useState('');
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([{ question: '', answer: '' }]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/card/getCardById?id=${id}`)
      .then((response) => {
        const { icon, iconName, altName, title, questionsAndAnswers } = response.data;
        setTitle(title);
        setQuestionsAndAnswers(questionsAndAnswers);
        setIconPreview(icon);
        setIconName(iconName);
        setAltName(altName);
      })
      .catch((error) => console.error('Error fetching card:', error));
  }, [id]);

  const handleAddQA = () => {
    setQuestionsAndAnswers([...questionsAndAnswers, { question: '', answer: '' }]);
  };

  const handleRemoveQA = (index) => {
    setQuestionsAndAnswers(questionsAndAnswers.filter((_, i) => i !== index));
  };

  const handleChangeQA = (index, field, value) => {
    const updatedQA = questionsAndAnswers.map((qa, i) =>
      i === index ? { ...qa, [field]: value } : qa
    );
    setQuestionsAndAnswers(updatedQA);
  };

  const handleFileChange = (e) => {
    setIcon(e.target.files[0]);
  };

  const handleRemoveIcon = () => {
    axios
      .delete(`/api/card/removeIcon?id=${id}`)
      .then(() => {
        setIconPreview('');
        setIconName('');
        setAltName('');
      })
      .catch((error) => console.error('Error removing icon:', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (icon) formData.append('icon', icon);
    formData.append('iconName', iconName);
    formData.append('altName', altName);
    formData.append('title', title);
    formData.append('questionsAndAnswers', JSON.stringify(questionsAndAnswers));

    axios
      .put(`/api/card/updateCard?id=${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => navigate('/Card'))
      .catch((error) => console.error('Error updating card:', error));
  };

  return (
    <div className="container mx-auto my-10">
      <h1 className="text-2xl font-bold mb-4">Update Card</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Icon</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {iconPreview && (
            <div className="mt-2">
              <img
                src={`/api/icon/download/${iconPreview}`}
                alt="Icon Preview"
                className="w-32 h-32 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveIcon}
                className="text-red-500 mt-2"
              >
                Remove Icon
              </button>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Icon Name</label>
          <input
            type="text"
            value={iconName}
            onChange={(e) => setIconName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Alt Name</label>
          <input
            type="text"
            value={altName}
            onChange={(e) => setAltName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Questions and Answers</label>
          {questionsAndAnswers.map((qa, index) => (
            <div key={index} className="mb-2">
              <ReactQuill
                value={qa.question}
                onChange={(value) => handleChangeQA(index, 'question', value)}
                placeholder="Question"
                className="mb-2"
              />
              <ReactQuill
                value={qa.answer}
                onChange={(value) => handleChangeQA(index, 'answer', value)}
                placeholder="Answer"
              />
              <button
                type="button"
                onClick={() => handleRemoveQA(index)}
                className="text-red-500 mt-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddQA}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Add Another Question
          </button>
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        >
          Update Card
        </button>
      </form>
    </div>
  );
}

export default UpdateCard;
