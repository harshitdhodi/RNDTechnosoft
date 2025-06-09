import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const HireTalentForm = () => {
  const { id } = useParams(); // Get ID from URL parameters
  const isEditMode = !!id; // Determine if in edit mode
  const [formData, setFormData] = useState({
    heading: '',
    subHeading: '',
    cards: [{ cardInfo: '', photo: '', altImg: '', imgTitle: '' }],
    pageSection: 'TeamService',
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/hire-talent/${id}`);
          const data = response.data;
          setFormData({
            heading: data.heading || '',
            subHeading: data.subHeading || '',
            cards: data.card.length > 0 
              ? data.card.map(card => ({
                  cardInfo: card.cardInfo || '',
                  photo: card.photo || '', // Store the image name/path
                  altImg: card.altImg || '',
                  imgTitle: card.imgTitle || '',
                }))
              : [{ cardInfo: '', photo: '', altImg: '', imgTitle: '' }],
            pageSection: data.pageSection || 'TeamService',
          });
          // Set image previews for existing images
          setImagePreviews(data.card.map(card => 
            card.photo ? `/api/logo/download/${card.photo}` : ''
          ));
        } catch (err) {
          setError('Error fetching data: ' + err.message);
        }
      };
      fetchData();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e, cardIndex, field) => {
    const updatedFormData = { ...formData };
    if (field === 'heading' || field === 'subHeading' || field === 'pageSection') {
      updatedFormData[field] = e.target.value;
    } else {
      updatedFormData.cards[cardIndex][field] = e.target.value;
    }
    setFormData(updatedFormData);
  };

  const handleImageChange = (e, cardIndex) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedFormData = { ...formData };
        updatedFormData.cards[cardIndex].photo = file; // Store file for FormData
        setFormData(updatedFormData);

        const updatedPreviews = [...imagePreviews];
        updatedPreviews[cardIndex] = URL.createObjectURL(file); // Use object URL for new images
        setImagePreviews(updatedPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { cardInfo: '', photo: '', altImg: '', imgTitle: '' }],
    });
    setImagePreviews([...imagePreviews, '']);
  };

  const removeCard = (cardIndex) => {
    if (formData.cards.length > 1) {
      const updatedFormData = { ...formData };
      updatedFormData.cards.splice(cardIndex, 1);
      setFormData(updatedFormData);
      const updatedPreviews = [...imagePreviews];
      updatedPreviews.splice(cardIndex, 1);
      setImagePreviews(updatedPreviews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('heading', formData.heading);
      formDataToSend.append('subHeading', formData.subHeading);
      formDataToSend.append('pageSection', formData.pageSection);
      formData.cards.forEach((card, index) => {
        formDataToSend.append(`card[${index}][cardInfo]`, card.cardInfo);
        if (card.photo instanceof File) {
          formDataToSend.append(`card[${index}][photo]`, card.photo);
        } else if (card.photo) {
          formDataToSend.append(`card[${index}][photo]`, card.photo); // Send existing image name
        }
        formDataToSend.append(`card[${index}][altImg]`, card.altImg);
        formDataToSend.append(`card[${index}][imgTitle]`, card.imgTitle);
      });

      const url = isEditMode ? `/api/hire-talent/${id}` : '/api/hire-talent';
      const method = isEditMode ? 'put' : 'post';

      const response = await axios[method](url, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(`Data ${isEditMode ? 'updated' : 'submitted'} successfully!`);
      if (!isEditMode) {
        setFormData({
          heading: '',
          subHeading: '',
          cards: [{ cardInfo: '', photo: '', altImg: '', imgTitle: '' }],
          pageSection: 'TeamService',
        });
        setImagePreviews([]);
      }
    } catch (err) {
      setError(`Error ${isEditMode ? 'updating' : 'submitting'} data: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Hire Talent' : 'Hire Talent Form'}</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Heading</label>
          <input
            type="text"
            value={formData.heading}
            onChange={(e) => handleInputChange(e, null, 'heading')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sub Heading</label>
          <input
            type="text"
            value={formData.subHeading}
            onChange={(e) => handleInputChange(e, null, 'subHeading')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Page Section</label>
          <select
            value={formData.pageSection}
            onChange={(e) => handleInputChange(e, null, 'pageSection')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="TeamService">Team Service</option>
            <option value="Applications">Applications</option>
            <option value="WhyChoose">Why Choose</option>
          </select>
        </div>
        {formData.cards.map((card, cardIndex) => (
          <div key={cardIndex} className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Card {cardIndex + 1}</h2>
              <button
                type="button"
                onClick={() => removeCard(cardIndex)}
                className="text-red-500 text-sm disabled:opacity-50"
                disabled={formData.cards.length === 1}
              >
                Remove Card
              </button>
            </div>
            <div className="space-y-4 mt-4 border-l-4 pl-4 border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Info</label>
                <input
                  type="text"
                  value={card.cardInfo}
                  onChange={(e) => handleInputChange(e, cardIndex, 'cardInfo')}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, cardIndex)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required={!isEditMode || !card.photo} // Required if creating or no existing photo
                />
                {imagePreviews[cardIndex] && (
                  <img
                    src={imagePreviews[cardIndex]}
                    alt={card.altImg || 'Preview'}
                    className="mt-2 h-32 w-32 object-cover rounded-md"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Alt Text</label>
                <input
                  type="text"
                  value={card.altImg}
                  onChange={(e) => handleInputChange(e, cardIndex, 'altImg')}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image Title</label>
                <input
                  type="text"
                  value={card.imgTitle}
                  onChange={(e) => handleInputChange(e, cardIndex, 'imgTitle')}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addCard}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Another Card
        </button>
        <button
          type="submit"
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          {isEditMode ? 'Update' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default HireTalentForm;