import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { v4 as uuidv4 } from 'uuid';

const TechnologySecDataForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isUpdate = !!id;

  const [formData, setFormData] = useState({
    technologyId: '',
    type: '',
    heading: '',
    card: [{ photo: '', heading: '', subHeading: '', altName: '', imgTitle: '', key: uuidv4() }],
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const typeOptions = [
    { value: 'hire developer', label: 'Hire Developer' },
    { value: 'Why Choose', label: 'Why Choose' },
    { value: 'Technology Application', label: 'Technology Application' },
  ];

  // Fetch technologies for dropdown
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await axios.get('/api/technology');
        console.log('Fetched technologies:', response.data.data);
        setTechnologies(response.data.data || response.data);
      } catch (err) {
        setError('Failed to fetch technologies');
        console.error('Fetch technologies error:', err);
      }
    };
    fetchTechnologies();
  }, []);

  // Fetch data for update
  useEffect(() => {
    if (isUpdate) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/technologySecData/${id}`);
          const data = response.data.data || response.data;
          setFormData({
            technologyId: data.technologyId || '',
            type: data.type || '',
            heading: data.heading || '',
            card: data.card && Array.isArray(data.card)
              ? data.card.map(card => ({ ...card, key: uuidv4() }))
              : [{ photo: '', heading: '', subHeading: '', altName: '', imgTitle: '', key: uuidv4() }],
          });
          setPreviews(data.card ? data.card.map(card => card.photo || null) : []);
          setFiles(data.card ? data.card.map(() => null) : []);
        } catch (err) {
          setError('Failed to fetch data');
          console.error('Fetch error:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id, isUpdate]);

  // Clean up previews
  useEffect(() => {
    return () => {
      previews.forEach(preview => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name.includes('card.')) {
      const cardField = name.split('.')[1];
      const updatedCards = [...formData.card];
      updatedCards[index] = { ...updatedCards[index], [cardField]: value };
      setFormData({ ...formData, card: updatedCards });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleQuillChange = debounce((field, value, index) => {
    if (field === 'heading') {
      setFormData({ ...formData, heading: value });
    } else if (field === 'card.heading' || field === 'card.subHeading') {
      const cardField = field.split('.')[1];
      const updatedCards = [...formData.card];
      updatedCards[index] = { ...updatedCards[index], [cardField]: value };
      setFormData({ ...formData, card: updatedCards });
    }
  }, 300);

  const handleFileChange = (e, index) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setError(`File for card ${index + 1} must be less than 5MB`);
      return;
    }
    const updatedFiles = [...files];
    updatedFiles[index] = selectedFile;
    setFiles(updatedFiles);

    const updatedPreviews = [...previews];
    updatedPreviews[index] = selectedFile ? URL.createObjectURL(selectedFile) : null;
    console.log('Preview for index', index, ':', updatedPreviews[index]);
    setPreviews(updatedPreviews);
  };

  const addCard = () => {
    setFormData({
      ...formData,
      card: [...formData.card, { photo: '', heading: '', subHeading: '', altName: '', imgTitle: '', key: uuidv4() }],
    });
    setFiles([...files, null]);
    setPreviews([...previews, null]);
  };

  const removeCard = (index) => {
    if (formData.card.length === 1) {
      setError('At least one card is required');
      return;
    }
    setFormData({
      ...formData,
      card: formData.card.filter((_, i) => i !== index),
    });
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.card.length !== files.length || formData.card.length !== previews.length) {
      setError('Card, files, and previews arrays are out of sync');
      setLoading(false);
      return;
    }

    if (!formData.technologyId) {
      setError('Please select a technology');
      setLoading(false);
      return;
    }

    try {
      const fileFormData = new FormData();
      fileFormData.append('type', formData.type || '');
      fileFormData.append('heading', formData.heading || '');
      fileFormData.append('technologyId', formData.technologyId || '');

      formData.card.forEach((card, index) => {
        fileFormData.append(`card[${index}]heading`, card.heading || '');
        fileFormData.append(`card[${index}]subHeading`, card.subHeading || '');
        fileFormData.append(`card[${index}]altName`, card.altName || '');
        fileFormData.append(`card[${index}]imgTitle`, card.imgTitle || '');
        if (files[index]) {
          fileFormData.append(`card[${index}][photo]`, files[index]);
        } else if (card.photo) {
          fileFormData.append(`card[${index}][photo]`, card.photo);
        }
      });

      // Log FormData entries
      for (let [key, value] of fileFormData.entries()) {
        console.log(key, value instanceof File ? value.name : value);
      }

      const response = await axios({
        method: isUpdate ? 'put' : 'post',
        url: `/api/technologySecData${isUpdate ? `/${id}` : ''}`,
        data: fileFormData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('API Response:', response.data);

      setFormData(prev => ({
        ...prev,
        technologyId: response.data.data?.technologyId || response.data.technologyId || prev.technologyId,
        type: response.data.data?.type || response.data.type || prev.type,
        heading: response.data.data?.heading || response.data.heading || prev.heading,
        card: response.data.data?.card && Array.isArray(response.data.data.card)
          ? response.data.data.card.map((card, i) => ({
            ...prev.card[i],
            ...card,
            key: prev.card[i]?.key || uuidv4(),
          }))
          : response.data.card && Array.isArray(response.data.card)
            ? response.data.card.map((card, i) => ({
              ...prev.card[i],
              ...card,
              key: prev.card[i]?.key || uuidv4(),
            }))
            : prev.card,
      }));
      setPreviews(
        response.data.data?.card
          ? response.data.data.card.map(card => card.photo || null)
          : response.data.card
            ? response.data.card.map(card => card.photo || null)
            : []
      );
      setFiles([]);
      navigate('/tech-sec-data');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save data');
      console.error('API Error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">
        {isUpdate ? 'Update Technology Section' : 'Add Technology Section'}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500 mb-4">Loading...</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Technology</label>
          <select
            name="technologyId"
            value={formData.technologyId}
            onChange={(e) => handleChange(e)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>Select Technology</option>
            {technologies.map((tech) => (
              <option key={tech._id} value={tech._id}>
                {tech.imgTitle}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={(e) => handleChange(e)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>Select Type</option>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Heading</label>
          <ReactQuill
            value={formData.heading}
            onChange={(value) => handleQuillChange('heading', value)}
            className="mt-1 border border-gray-300 rounded-md"
            theme="snow"
            modules={{
              toolbar: [
                [{ font: [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
                [{ script: 'sub' }, { script: 'super' }],
                [{ indent: '-1' }, { indent: '+1' }],
                ['link', 'image', 'video'],
                [{ direction: 'rtl' }],
                [
                  { color: ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff','#f3ca0d'] }, // custom colors
                  { background: ['#ffffff', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#cfe2f3', '#d9d2e9'] } // custom backgrounds
                ],
                [{ align: [] }],
                ['clean'],
              ],
            }}
          />

        </div>
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Cards</h3>
          {formData.card.map((card, index) => (
            <div key={card.key} className="border p-4 rounded-md mb-4 relative">
              <h4 className="text-md font-medium mb-2">Card {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeCard(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                disabled={formData.card.length === 1}
              >
                Remove
              </button>
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, index)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
                {(previews[index] || card.photo) && (
                  <div className="mt-2">
                    <img
                      src={
                        previews[index] ||
                        (card.photo.startsWith('http')
                          ? card.photo
                          : `/api/logo/download/${card.photo}?t=${Date.now()}`)
                      }
                      alt={card.altName || `Card ${index + 1} preview`}
                      className="max-w-xs h-auto rounded-md"
                      onError={(e) => console.error('Image load error:', e.target.src)}
                    />
                  </div>
                )}
                {card.photo && !previews[index] && (
                  <p className="text-sm text-gray-500 mt-1">
                    Current photo: <a href={card.photo} target="_blank" rel="noopener noreferrer">View</a>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Heading</label>
                <ReactQuill
                  value={card.heading}
                  onChange={(value) => handleQuillChange('card.heading', value, index)}
                  className="mt-1 border border-gray-300 rounded-md"
                  theme="snow"
                  modules={{
                    toolbar: [
                      [{ font: [] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
                      [{ script: 'sub' }, { script: 'super' }],
                      [{ indent: '-1' }, { indent: '+1' }],
                      ['link', 'image', 'video'],
                      [{ direction: 'rtl' }],
                      [{ color: [] }, { background: [] }],
                      [{ align: [] }],
                      ['clean'],
                    ],
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Sub Heading</label>
                <ReactQuill
                  value={card.subHeading}
                  onChange={(value) => handleQuillChange('card.subHeading', value, index)}
                  className="mt-1 border border-gray-300 rounded-md"
                  theme="snow"
                  modules={{
                    toolbar: [
                      [{ font: [] }],
                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
                      [{ script: 'sub' }, { script: 'super' }],
                      [{ indent: '-1' }, { indent: '+1' }],
                      ['link', 'image', 'video'],
                      [{ direction: 'rtl' }],
                      [{ color: [] }, { background: [] }],
                      [{ align: [] }],
                      ['clean'],
                    ],
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Alt Name</label>
                <input
                  type="text"
                  name="card.altName"
                  value={card.altName}
                  onChange={(e) => handleChange(e, index)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Photo Title</label>
                <input
                  type="text"
                  name="card.imgTitle"
                  value={card.imgTitle}
                  onChange={(e) => handleChange(e, index)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addCard}
            className="mt-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
          >
            Add Card
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Saving...' : isUpdate ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default TechnologySecDataForm;