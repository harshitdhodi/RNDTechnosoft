import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Custom CSS to ensure Quill editor styling
const quillStyles = `
  .ql-container {
    background-color: white;
    border-radius: 0.25rem;
    min-height: 150px;
  }
  .ql-editor {
    min-height: 100px;
    font-size: 1rem;
    line-height: 1.5;
  }
  .ql-toolbar {
    border-radius: 0.25rem 0.25rem 0 0;
  }
  .ql-container .ql-editor p,
  .ql-container .ql-editor h1,
  .ql-container .ql-editor h2,
  .ql-container .ql-editor h3 {
    margin-bottom: 0.5rem;
  }
  .image-preview {
    max-width: 150px;
    max-height: 150px;
    object-fit: cover;
    margin-top: 0.5rem;
    border-radius: 0.25rem;
  }
`;

const CreateIndustrySecData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [formData, setFormData] = useState({
    type: "",
    heading: "",
    subHeading: "",
    category: "",
    cards: [{ title: "", details: "", photo: "", altName: "", imgTitle: "" }],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const pageSectionOptions = [
    {value:"info", label:"Information"},
    { value: "applications", label: "Applications" },
    { value: "software-service", label: "Software Service" },
    { value: "case-studies", label: "Case Studies" },
  ];

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "color",
    "background",
    "link",
    "image",
    "video",
  ];

  // Fetch Industry Categories
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await axios.get("/api/industries/getAll");
        setIndustries(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to load industry categories.");
      }
    };
    fetchIndustries();
  }, []);

  // Fetch IndustrySecData by ID if editing
  useEffect(() => {
    if (isEditMode) {
      const fetchIndustrySecData = async () => {
        setIsLoading(true);
        try {
          const res = await axios.get(`/api/caseStudy/${id}`);
          const industryData = res.data || {};
          setFormData({
            type: industryData.type || "",
            heading: industryData.heading || "",
            subHeading: industryData.subHeading || "",
            category: industryData.category?._id || "",
            cards: industryData.card?.length
              ? industryData.card.map((card) => ({
                  title: card.title || "",
                  details: card.details || "",
                  photo: card.photo || "", // Store image name/path
                  altName: card.altName || "",
                  imgTitle: card.imgTitle || "",
                }))
              : [{ title: "", details: "", photo: "", altName: "", imgTitle: "" }],
          });
          setImagePreviews(
            industryData.card?.map((card) =>
              card.photo ? `/api/logo/download/${card.photo}` : ""
            ) || []
          );
        } catch (err) {
          setError("Failed to load industry section data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchIndustrySecData();
    }
  }, [id, isEditMode]);

  // Handle text inputs
  const handleInputChange = (e, cardIndex, field) => {
    const updatedFormData = { ...formData };
    if (field === "type" || field === "heading" || field === "subHeading" || field === "category") {
      updatedFormData[field] = e.target.value;
    } else {
      updatedFormData.cards[cardIndex][field] = e.target.value;
    }
    setFormData(updatedFormData);
  };

  // Handle card photo change
  const handleImageChange = (e, cardIndex) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedFormData = { ...formData };
        updatedFormData.cards[cardIndex].photo = file; // Store file for FormData
        setFormData(updatedFormData);

        const updatedPreviews = [...imagePreviews];
        updatedPreviews[cardIndex] = URL.createObjectURL(file);
        setImagePreviews(updatedPreviews);
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  // Add a new card
  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { title: "", details: "", photo: "", altName: "", imgTitle: "" }],
    });
    setImagePreviews([...imagePreviews, ""]);
  };

  // Remove a card
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

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("type", formData.type);
      formDataToSend.append("heading", formData.heading);
      formDataToSend.append("subHeading", formData.subHeading);
      formDataToSend.append("category", formData.category);
      formData.cards.forEach((card, index) => {
        formDataToSend.append(`card[${index}][title]`, card.title);
        formDataToSend.append(`card[${index}][details]`, card.details);
        if (card.photo instanceof File) {
          formDataToSend.append(`card[${index}][photo]`, card.photo);
        } else if (card.photo) {
          formDataToSend.append(`card[${index}][photo]`, card.photo); // Send existing image name
        }
        formDataToSend.append(`card[${index}][altName]`, card.altName);
        formDataToSend.append(`card[${index}][imgTitle]`, card.imgTitle);
      });

      const url = isEditMode ? `/api/caseStudy/${id}` : "/api/caseStudy";
      const method = isEditMode ? "put" : "post";

      await axios[method](url, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(`Data ${isEditMode ? "updated" : "submitted"} successfully!`);
      if (!isEditMode) {
        setFormData({
          type: "",
          heading: "",
          subHeading: "",
          category: "",
          cards: [{ title: "", details: "", photo: "", altName: "", imgTitle: "" }],
        });
        setImagePreviews([]);
      }
      navigate("/industry-data");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || `Error ${isEditMode ? "updating" : "submitting"} data.`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <style>{quillStyles}</style>
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? "Edit Industry Section Data" : "Create Industry Section Data"}
      </h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      {isLoading && <div className="text-center">Loading...</div>}
      {!isLoading && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={(e) => handleInputChange(e, null, "type")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isLoading}
            >
              <option value="">Select Type</option>
              {pageSectionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Industry Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => handleInputChange(e, null, "category")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isLoading}
            >
              <option value="">Select Industry</option>
              {industries.map((industry) => (
                <option key={industry._id} value={industry._id}>
                  {industry.category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Heading</label>
            <input
              type="text"
              name="heading"
              value={formData.heading}
              onChange={(e) => handleInputChange(e, null, "heading")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subheading</label>
            <textarea
              name="subHeading"
              value={formData.subHeading}
              onChange={(e) => handleInputChange(e, null, "subHeading")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              disabled={isLoading}
            />
          </div>

          {formData.cards.map((card, cardIndex) => (
            <div key={cardIndex} className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Card {cardIndex + 1}</h2>
                <button
                  type="button"
                  onClick={() => removeCard(cardIndex)}
                  className="text-red-500 text-sm disabled:opacity-50"
                  disabled={formData.cards.length === 1 || isLoading}
                >
                  Remove Card
                </button>
              </div>
              <div className="space-y-4 mt-4 border-l-4 pl-4 border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleInputChange(e, cardIndex, "title")}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Details</label>
                  <ReactQuill
                    value={card.details}
                    onChange={(value) => handleInputChange({ target: { value } }, cardIndex, "details")}
                    modules={quillModules}
                    formats={quillFormats}
                    readOnly={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, cardIndex)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    disabled={isLoading}
                    // required={!isEditMode && cardIndex === 0 && !card.photo}
                  />
                  {imagePreviews[cardIndex] && (
                    <img
                      src={imagePreviews[cardIndex]}
                      alt={card.altName || `Card ${cardIndex + 1}`}
                      className="mt-2 h-32 w-32 object-cover rounded-md"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Alt Text</label>
                  <input
                    type="text"
                    value={card.altName}
                    onChange={(e) => handleInputChange(e, cardIndex, "altName")}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Image Title</label>
                  <input
                    type="text"
                    value={card.imgTitle}
                    onChange={(e) => handleInputChange(e, cardIndex, "imgTitle")}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addCard}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isLoading}
          >
            Add Another Card
          </button>
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-green-300"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : isEditMode ? "Update" : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateIndustrySecData;