import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
<<<<<<< HEAD
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

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
    cards: [{ title: "", details: "", photo: "", altName: "", imgTitle: "" }]
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const pageSectionOptions = [
    { value: "info", label: "Information" },
    { value: "applications", label: "Applications" },
    { value: "software-service", label: "Software Service" },
    { value: "case-studies", label: "Case Studies" },
    { value: "build", label: "Build" }
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
      ["link"],
      ["clean"]
    ]
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
    "link"
  ];

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await axios.get("/api/industries/getAll", {
          headers: {
            // Add authentication headers if required
          }
        });
        console.log('API Response:', res.data);
        setIndustries(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching industries:', err.response || err.message);
        setError(`Failed to load industry categories: ${err.response?.data?.error || err.message}`);
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const fetchIndustrySecData = async () => {
        setIsLoading(true);
        try {
          const res = await axios.get(`/api/caseStudy/${id}`);
          const industryData = res.data.data || {};
          setFormData({
            type: industryData.type || "",
            heading: industryData.heading || "",
            subHeading: industryData.subHeading || "",
            category: industryData.category?._id || "",
            cards: industryData.card?.length
              ? industryData.card.map(card => ({
                  title: card.title || "",
                  details: card.details || "",
                  photo: card.photo || "",
                  altName: card.altName || "",
                  imgTitle: card.imgTitle || ""
                }))
              : [{ title: "", details: "", photo: "", altName: "", imgTitle: "" }]
          });
          setImagePreviews(
            industryData.card?.map(card =>
              card.photo ? `/api/logo/download/${card.photo}` : ""
            ) || []
          );
        } catch (err) {
          setError("Failed to load industry section data.");
<<<<<<< HEAD
          toast.error("Failed to load industry section data.");
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        } finally {
          setIsLoading(false);
        }
      };
      fetchIndustrySecData();
    }
  }, [id, isEditMode]);

  const handleInputChange = (value, cardIndex, field) => {
    const updatedFormData = { ...formData };
    if (["type", "heading", "subHeading", "category"].includes(field)) {
      updatedFormData[field] = value;
    } else {
      updatedFormData.cards[cardIndex][field] = value;
    }
    setFormData(updatedFormData);
  };

  const handleImageChange = (e, cardIndex) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedFormData = { ...formData };
        updatedFormData.cards[cardIndex].photo = file;
        setFormData(updatedFormData);
        const updatedPreviews = [...imagePreviews];
        updatedPreviews[cardIndex] = URL.createObjectURL(file);
        setImagePreviews(updatedPreviews);
      };
      reader.readAsDataURL(file);
<<<<<<< HEAD
      toast.success("Image selected successfully.");
    } else {
      setError("Please upload a valid image file.");
      toast.error("Please upload a valid image file.");
=======
    } else {
      setError("Please upload a valid image file.");
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    }
  };

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { title: "", details: "", photo: "", altName: "", imgTitle: "" }]
    });
    setImagePreviews([...imagePreviews, ""]);
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
  setIsLoading(true);
  setError(null);
  setSuccess(null);

  // Validate only non-empty cards
  const validCards = formData.cards.filter(card => {
    const hasTitle = card.title.trim() !== "";
    const hasDetails = card.details.trim() !== "";
    return hasTitle || hasDetails; // keep cards that have something filled
  });

  // Validation: If any card exists but missing title/details
  const invalidCards = validCards.filter(card => {
    return !card.title.trim() || !card.details.trim();
  });

  if (!formData.type) {
    setError("Type is required");
    setIsLoading(false);
    return;
  }
  if (!formData.heading) {
    setError("Heading is required");
    setIsLoading(false);
    return;
  }
  if (!formData.category) {
    setError("Please select an industry category");
    setIsLoading(false);
    return;
  }
  if (invalidCards.length > 0) {
    setError("Each filled card must have a title and details");
    setIsLoading(false);
    return;
  }

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("type", formData.type.trim());
    formDataToSend.append("heading", formData.heading.trim());
    formDataToSend.append("subHeading", formData.subHeading.trim());
    formDataToSend.append("category", formData.category);

    // ✅ Append only valid cards
    validCards.forEach((card, index) => {
      formDataToSend.append(`card[${index}].title`, card.title.trim());
      formDataToSend.append(`card[${index}].details`, card.details.trim());
      if (card.photo instanceof File) {
        formDataToSend.append(`card[${index}].photo`, card.photo);
      } else if (isEditMode && card.photo) {
        formDataToSend.append(`card[${index}].photo`, card.photo);
      }
      formDataToSend.append(`card[${index}].altName`, card.altName.trim());
      formDataToSend.append(`card[${index}].imgTitle`, card.imgTitle.trim());
    });

    const url = isEditMode ? `/api/caseStudy/${id}` : "/api/caseStudy";
    const method = isEditMode ? "put" : "post";

    await axios[method](url, formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });
<<<<<<< HEAD
    toast.success(`Data ${isEditMode ? "updated" : "submitted"} successfully!`);
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

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
      navigate("/industry-data");
    }
  } catch (err) {
    const errorMessage =
      err.response?.data?.message ||
      `Error ${isEditMode ? "updating" : "submitting"} data.`;
    setError(errorMessage);
<<<<<<< HEAD
    toast.error(errorMessage);
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
<<<<<<< HEAD
      <ToastContainer />
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
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
            <label className="block text-sm font-medium text-gray-700">Type <span className="text-red-500">*</span></label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange(e.target.value, null, "type")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isLoading}
            >
              <option value="">Select Type</option>
              {pageSectionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Industry Category <span className="text-red-500">*</span></label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange(e.target.value, null, "category")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isLoading}
            >
              <option value="">Select Industry</option>
              {industries.length > 0 ? (
                industries.map(industry => (
                  <option key={industry._id} value={industry._id}>
                    {industry.category}
                  </option>
                ))
              ) : (
                <option disabled>No industries available</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Heading <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.heading}
              onChange={(e) => handleInputChange(e.target.value, null, "heading")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subheading</label>
            <textarea
              value={formData.subHeading}
              onChange={(e) => handleInputChange(e.target.value, null, "subHeading")}
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
                  <label className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleInputChange(e.target.value, cardIndex, "title")}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    // required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Details <span className="text-red-500">*</span></label>
                  <ReactQuill
                    value={card.details}
                    onChange={(value) => handleInputChange(value, cardIndex, "details")}
                    modules={quillModules}
                    formats={quillFormats}
                    className="mt-1"
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
                  />
                  {imagePreviews[cardIndex] && (
                    <img
                      src={imagePreviews[cardIndex]}
                      alt={card.altName || `Card ${cardIndex + 1}`}
                      className="image-preview"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Alt Text</label>
                  <input
                    type="text"
                    value={card.altName}
                    onChange={(e) => handleInputChange(e.target.value, cardIndex, "altName")}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image Title</label>
                  <input
                    type="text"
                    value={card.imgTitle}
                    onChange={(e) => handleInputChange(e.target.value, cardIndex, "imgTitle")}
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