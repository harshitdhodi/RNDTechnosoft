import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomeHeroForm = () => {
  const [beforeHighlight, setBeforeHighlight] = useState('');
  const [afterHighlight, setAfterHighlight] = useState('');
  const [highlightedTexts, setHighlightedTexts] = useState(['']);
  const [paragraph, setParagraph] = useState('');
  const [labels, setLabels] = useState([{ label: '', color: '' }]);
  const [smallCircles, setSmallCircles] = useState([{ color: '' }]);
  const [homeHeroId, setHomeHeroId] = useState(null); // To store the ID of the fetched HomeHero

  const notify = () => {
    toast.success("Updated Successfully!");
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

  // Fetch HomeHero data on component mount
  useEffect(() => {
    const fetchHomeHeros = async () => {
      try {
        const response = await axios.get('/api/homehero', { withCredentials: true });
        const data = response.data;

        // Populate state with fetched data
        if (data && data.length > 0) {
          const firstHero = data[0]; // Get the first HomeHero object
          setHomeHeroId(firstHero._id); // Store the HomeHero ID for updates
          setBeforeHighlight(firstHero.heading.beforeHighlight);
          setAfterHighlight(firstHero.heading.afterHighlight);
          setHighlightedTexts(firstHero.heading.highlightedWords);
          setParagraph(firstHero.paragraph.text);
          setLabels(firstHero.labels);
          setSmallCircles(firstHero.smallCircles);
        }
      } catch (error) {
        console.error('Error fetching HomeHeros:', error);
      }
    };

    fetchHomeHeros();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const homeHeroData = {
      labels,
      smallCircles,
      heading: {
        highlightedWords: highlightedTexts,
        beforeHighlight,
        afterHighlight
      },
      paragraph: {
        text: paragraph
      }
    };

    try {
      // Update the HomeHero data
      await axios.put(`/api/homehero/${homeHeroId}`, homeHeroData, { withCredentials: true });
      notify();
    } catch (error) {
      console.error('Error updating HomeHero:', error);
    }
  };

  const handleAddHighlightedText = () => {
    setHighlightedTexts([...highlightedTexts, '']); // Add a new highlighted text input
  };

  const handleHighlightTextChange = (e, index) => {
    const newHighlightedTexts = [...highlightedTexts];
    newHighlightedTexts[index] = e.target.value;
    setHighlightedTexts(newHighlightedTexts);
  };

  const handleRemoveHighlightedText = async (index) => {
    const textToRemove = highlightedTexts[index];
    try {
      // Call API to remove the highlighted text
      await axios.delete(`/api/homehero/highlightedText/${homeHeroId}`, { data: { text: textToRemove }, withCredentials: true });
      setHighlightedTexts(highlightedTexts.filter((_, i) => i !== index)); // Update local state
    } catch (error) {
      console.error('Error removing highlighted text:', error);
    }
  };

  const handleAddLabel = () => {
    setLabels([...labels, { label: '', color: '' }]);
  };

  const handleLabelChange = (e, index) => {
    const newLabels = [...labels];
    newLabels[index][e.target.name] = e.target.value;
    setLabels(newLabels);
  };

  const handleRemoveLabel = async (index) => {
    const labelToRemove = labels[index];
    try {
      // Call API to remove the label
      await axios.delete(`/api/homehero/label/${homeHeroId}`, { data: { label: labelToRemove }, withCredentials: true });
      setLabels(labels.filter((_, i) => i !== index)); // Update local state
    } catch (error) {
      console.error('Error removing label:', error);
    }
  };

  const handleAddSmallCircle = () => {
    setSmallCircles([...smallCircles, { color: '' }]);
  };

  const handleSmallCircleChange = (e, index) => {
    const newSmallCircles = [...smallCircles];
    newSmallCircles[index].color = e.target.value;
    setSmallCircles(newSmallCircles);
  };

  const handleRemoveSmallCircle = async (index) => {
    const circleToRemove = smallCircles[index];
    try {
      // Call API to remove the small circle
      await axios.delete(`/api/homehero/smallCircle/${homeHeroId}`, { data: { color: circleToRemove.color }, withCredentials: true });
      setSmallCircles(smallCircles.filter((_, i) => i !== index)); // Update local state
    } catch (error) {
      console.error('Error removing small circle:', error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <form onSubmit={handleSubmit} className='p-4'>
        <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Manage Hero Section</h1>
        
        <div className="mb-4">
          <label htmlFor="beforeHighlight" className="block font-semibold mb-2">Before Highlight</label>
          <input
            type="text"
            id="beforeHighlight"
            value={beforeHighlight}
            onChange={(e) => setBeforeHighlight(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="afterHighlight" className="block font-semibold mb-2">After Highlight</label>
          <input
            type="text"
            id="afterHighlight"
            value={afterHighlight}
            onChange={(e) => setAfterHighlight(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none"
          />
        </div>
        
        <div className="mb-4">
          <label className="block font-semibold mb-2">Highlighted Texts</label>
          {highlightedTexts.map((text, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={text}
                onChange={(e) => handleHighlightTextChange(e, index)}
                className="w-full p-2 border rounded focus:outline-none"
                placeholder={`Highlighted Text ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => handleRemoveHighlightedText(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddHighlightedText}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Add Highlighted Text
          </button>
        </div>
        
        <div className="mb-4">
          <label htmlFor="paragraph" className="block font-semibold mb-2">Paragraph</label>
          <ReactQuill 
            value={paragraph}
            onChange={setParagraph}
            modules={modules}
            className="border rounded"
          />
        </div>

        {/* Labels Input */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Labels</label>
          {labels.map((labelObj, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                name="label"
                value={labelObj.label}
                onChange={(e) => handleLabelChange(e, index)}
                className="w-full p-2 border rounded focus:outline-none"
                placeholder={`Label ${index + 1}`}
              />
              <input
                type="color"
                name="color"
                value={labelObj.color}
                onChange={(e) => handleLabelChange(e, index)}
                className="ml-2"
              />
              <button
                type="button"
                onClick={() => handleRemoveLabel(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddLabel}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Add Label
          </button>
        </div>

        {/* Small Circles Input */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Small Circles</label>
          {smallCircles.map((circle, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="color"
                value={circle.color}
                onChange={(e) => handleSmallCircleChange(e, index)}
                className="w-12 h-12 border rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveSmallCircle(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSmallCircle}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Add Small Circle
          </button>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
};

export default HomeHeroForm;
