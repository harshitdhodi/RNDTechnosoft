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
  const [homeHeroId, setHomeHeroId] = useState(null);
  const [errors, setErrors] = useState({});
  const [minItemCounts] = useState({
    highlightedTexts: 1,
    labels: 1,
    smallCircles: 3
  });

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

  const canDeleteItem = (itemType, currentCount) => {
    return currentCount > minItemCounts[itemType];
  };

  const handleRemoveHighlightedText = async (index) => {
    if (!canDeleteItem('highlightedTexts', highlightedTexts.length)) {
      toast.warning(`Cannot delete. Minimum ${minItemCounts.highlightedTexts} highlighted text(s) required.`);
      return;
    }

    const textToRemove = highlightedTexts[index];
    try {
      await axios.delete(`/api/homehero/highlightedText/${homeHeroId}`, { 
        data: { text: textToRemove }, 
        withCredentials: true 
      });
      setHighlightedTexts(highlightedTexts.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error removing highlighted text:', error);
      toast.error('Failed to remove highlighted text');
    }
  };

  const handleRemoveLabel = async (index) => {
    if (!canDeleteItem('labels', labels.length)) {
      toast.warning(`Cannot delete. Minimum ${minItemCounts.labels} label(s) required.`);
      return;
    }

    const labelToRemove = labels[index];
    try {
      await axios.delete(`/api/homehero/label/${homeHeroId}`, { 
        data: { label: labelToRemove }, 
        withCredentials: true 
      });
      setLabels(labels.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error removing label:', error);
      toast.error('Failed to remove label');
    }
  };

  const handleRemoveSmallCircle = async (index) => {
    if (!canDeleteItem('smallCircles', smallCircles.length)) {
      toast.warning(`Cannot delete. Minimum ${minItemCounts.smallCircles} small circle(s) required.`);
      return;
    }

    const circleToRemove = smallCircles[index];
    try {
      await axios.delete(`/api/homehero/smallCircle/${homeHeroId}`, { 
        data: { color: circleToRemove.color }, 
        withCredentials: true 
      });
      setSmallCircles(smallCircles.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error removing small circle:', error);
      toast.error('Failed to remove small circle');
    }
  };

  const validateField = (name, value) => {
    if (!value || value.trim() === '') {
      return `${name} cannot be empty`;
    }
    if (name === 'label' && value.length < 2) {
      return 'Label must be at least 2 characters';
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate before highlight
    const beforeHighlightError = validateField('Before highlight', beforeHighlight);
    if (beforeHighlightError) newErrors.beforeHighlight = beforeHighlightError;
    
    // Validate after highlight
    const afterHighlightError = validateField('After highlight', afterHighlight);
    if (afterHighlightError) newErrors.afterHighlight = afterHighlightError;
    
    // Validate highlighted texts
    highlightedTexts.forEach((text, index) => {
      const error = validateField('Highlighted text', text);
      if (error) {
        newErrors[`highlightedText-${index}`] = error;
      }
    });
    
    // Validate labels
    labels.forEach((label, index) => {
      const error = validateField('Label', label.label);
      if (error) {
        newErrors[`label-${index}`] = error;
      }
      if (!label.color) {
        newErrors[`labelColor-${index}`] = 'Please select a color';
      }
    });
    
    // Validate small circles
    smallCircles.forEach((circle, index) => {
      if (!circle.color) {
        newErrors[`circleColor-${index}`] = 'Please select a color';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

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
      await axios.put(`/api/homehero/${homeHeroId}`, homeHeroData, { withCredentials: true });
      notify();
    } catch (error) {
      console.error('Error updating HomeHero:', error);
      toast.error('Failed to update hero section');
    }
  };

  const renderInputField = (label, value, onChange, name, errorKey, placeholder = '') => (
    <div className="mb-4">
      <label htmlFor={name} className="block font-semibold mb-2">
        {label} {errors[errorKey] && <span className="text-red-500 text-sm">*</span>}
      </label>
      <input
        type="text"
        id={name}
        value={value}
        onChange={onChange}
        className={`w-full p-2 border rounded focus:outline-none ${
          errors[errorKey] ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
      />
      {errors[errorKey] && (
        <p className="text-red-500 text-sm mt-1">{errors[errorKey]}</p>
      )}
    </div>
  );

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

  useEffect(() => {
    const fetchMinItemCounts = async () => {
      try {
        const response = await axios.get('/api/settings/min-item-counts', { withCredentials: true });
        if (response.data) {
          // Use defaults if API call fails
        }
      } catch (error) {
        console.error('Error fetching min item counts:', error);
      }
    };
    fetchMinItemCounts();
  }, []);

  const handleAddHighlightedText = () => {
    setHighlightedTexts([...highlightedTexts, '']); // Add a new highlighted text input
  };

  const handleHighlightTextChange = (e, index) => {
    const newHighlightedTexts = [...highlightedTexts];
    newHighlightedTexts[index] = e.target.value;
    setHighlightedTexts(newHighlightedTexts);
  };

  const handleAddLabel = () => {
    setLabels([...labels, { label: '', color: '' }]);
  };

  const handleLabelChange = (e, index) => {
    const newLabels = [...labels];
    newLabels[index][e.target.name] = e.target.value;
    setLabels(newLabels);
  };

  const handleAddSmallCircle = () => {
    setSmallCircles([...smallCircles, { color: '' }]);
  };

  const handleSmallCircleChange = (e, index) => {
    const newSmallCircles = [...smallCircles];
    newSmallCircles[index].color = e.target.value;
    setSmallCircles(newSmallCircles);
  };

  return (
    <div>
      <ToastContainer />
      <form onSubmit={handleSubmit} className='p-4'>
        <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center mb-6">
          Manage Hero Section
        </h1>
        
        {renderInputField(
          'Before Highlight',
          beforeHighlight,
          (e) => setBeforeHighlight(e.target.value),
          'beforeHighlight',
          'beforeHighlight',
          'Text before highlighted section'
        )}
        
        {renderInputField(
          'After Highlight',
          afterHighlight,
          (e) => setAfterHighlight(e.target.value),
          'afterHighlight',
          'afterHighlight',
          'Text after highlighted section'
        )}
        
        <div className="mb-4">
          <label className="block font-semibold mb-2">Highlighted Texts</label>
          {highlightedTexts.map((text, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={text}
                onChange={(e) => {
                  const newHighlightedTexts = [...highlightedTexts];
                  newHighlightedTexts[index] = e.target.value;
                  setHighlightedTexts(newHighlightedTexts);
                  // Clear error when user types
                  if (errors[`highlightedText-${index}`]) {
                    const newErrors = { ...errors };
                    delete newErrors[`highlightedText-${index}`];
                    setErrors(newErrors);
                  }
                }}
                className={`flex-1 p-2 border rounded focus:outline-none ${
                  errors[`highlightedText-${index}`] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={`Highlighted Text ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => handleRemoveHighlightedText(index)}
                className="ml-2 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canDeleteItem('highlightedTexts', highlightedTexts.length)}
                title={!canDeleteItem('highlightedTexts', highlightedTexts.length) 
                  ? `Minimum ${minItemCounts.highlightedTexts} required` 
                  : 'Remove'}
              >
                Remove
              </button>
              {errors[`highlightedText-${index}`] && (
                <p className="text-red-500 text-sm ml-2">{errors[`highlightedText-${index}`]}</p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddHighlightedText}
            className="mt-2 text-blue-500 hover:text-blue-700"
          >
            + Add Highlighted Text
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
                onChange={(e) => {
                  const newLabels = [...labels];
                  newLabels[index][e.target.name] = e.target.value;
                  setLabels(newLabels);
                  // Clear error when user types
                  if (errors[`label-${index}`]) {
                    const newErrors = { ...errors };
                    delete newErrors[`label-${index}`];
                    setErrors(newErrors);
                  }
                }}
                className={`w-full p-2 border rounded focus:outline-none ${
                  errors[`label-${index}`] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={`Label ${index + 1}`}
              />
              <input
                type="color"
                name="color"
                value={labelObj.color}
                onChange={(e) => {
                  const newLabels = [...labels];
                  newLabels[index][e.target.name] = e.target.value;
                  setLabels(newLabels);
                  // Clear error when user selects color
                  if (errors[`labelColor-${index}`]) {
                    const newErrors = { ...errors };
                    delete newErrors[`labelColor-${index}`];
                    setErrors(newErrors);
                  }
                }}
                className="ml-2"
              />
              <button
                type="button"
                onClick={() => handleRemoveLabel(index)}
                className="ml-2 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canDeleteItem('labels', labels.length)}
                title={!canDeleteItem('labels', labels.length) 
                  ? `Minimum ${minItemCounts.labels} required` 
                  : 'Remove'}
              >
                Remove
              </button>
              {errors[`label-${index}`] && (
                <p className="text-red-500 text-sm ml-2">{errors[`label-${index}`]}</p>
              )}
              {errors[`labelColor-${index}`] && (
                <p className="text-red-500 text-sm ml-2">{errors[`labelColor-${index}`]}</p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddLabel}
            className="mt-2 text-blue-500 hover:text-blue-700"
          >
            + Add Label
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
                onChange={(e) => {
                  const newSmallCircles = [...smallCircles];
                  newSmallCircles[index].color = e.target.value;
                  setSmallCircles(newSmallCircles);
                  // Clear error when user selects color
                  if (errors[`circleColor-${index}`]) {
                    const newErrors = { ...errors };
                    delete newErrors[`circleColor-${index}`];
                    setErrors(newErrors);
                  }
                }}
                className="w-12 h-12 border rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveSmallCircle(index)}
                className="ml-2 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canDeleteItem('smallCircles', smallCircles.length)}
                title={!canDeleteItem('smallCircles', smallCircles.length) 
                  ? `Minimum ${minItemCounts.smallCircles} required` 
                  : 'Remove'}
              >
                Remove
              </button>
              {errors[`circleColor-${index}`] && (
                <p className="text-red-500 text-sm ml-2">{errors[`circleColor-${index}`]}</p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSmallCircle}
            className="mt-2 text-blue-500 hover:text-blue-700"
          >
            + Add Small Circle
          </button>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomeHeroForm;
