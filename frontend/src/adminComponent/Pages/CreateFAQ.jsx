import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const FAQForm = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("active");
  
  // Service category state
  const [servicecategories, setServiceCategories] = useState([]);
  const [serviceparentCategoryId, setServiceParentCategoryId] = useState("");
  const [servicesubCategoryId, setServiceSubCategoryId] = useState("");
  const [servicesubSubCategoryId, setServiceSubSubCategoryId] = useState("");

  // Industry category state
  const [industrycategories, setIndustryCategories] = useState([]);
  const [industryparentCategoryId, setIndustryParentCategoryId] = useState("");
  const [industrysubCategoryId, setIndustrySubCategoryId] = useState("");
  const [industrysubSubCategoryId, setIndustrySubSubCategoryId] = useState("");

  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/faq/insertFAQ', {
        question,
        answer,
        status,
        serviceparentCategoryId,
        servicesubCategoryId,
        servicesubSubCategoryId,
        industryparentCategoryId,
        industrysubCategoryId,
        industrysubSubCategoryId
      }, { withCredentials: true });

      setQuestion("");
      setAnswer("");
      setStatus("active");
      navigate('/faq');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchServiceCategories();
    fetchIndustryCategories();
  }, []);

  // Fetch all service categories
  const fetchServiceCategories = async () => {
    try {
      const response = await axios.get('/api/services/getall', { withCredentials: true });
      setServiceCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch all industry categories
  const fetchIndustryCategories = async () => {
    try {
      const response = await axios.get('/api/industries/getall', { withCredentials: true });
      setIndustryCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Render options for the parent, sub, and sub-sub categories
  const renderCategoryOptions = (category) => (
    <option key={category._id} value={category.slug}>
      {category.category}
    </option>
  );

  // Handle changes for service parent category
  const handleServiceParentCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setServiceParentCategoryId(selectedCategoryId);
    setServiceSubCategoryId(""); // Reset subcategory selection
    setServiceSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  // Handle changes for industry parent category
  const handleIndustryParentCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setIndustryParentCategoryId(selectedCategoryId);
    setIndustrySubCategoryId(""); // Reset subcategory selection
    setIndustrySubSubCategoryId(""); // Reset sub-subcategory selection
  };

  // Handle changes for service subcategory
  const handleServiceSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setServiceSubCategoryId(selectedSubCategoryId);
    setServiceSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  // Handle changes for industry subcategory
  const handleIndustrySubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setIndustrySubCategoryId(selectedSubCategoryId);
    setIndustrySubSubCategoryId(""); // Reset sub-subcategory selection
  };

  // Handle changes for service sub-subcategory
  const handleServiceSubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setServiceSubSubCategoryId(selectedSubSubCategoryId);
  };

  // Handle changes for industry sub-subcategory
  const handleIndustrySubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setIndustrySubSubCategoryId(selectedSubSubCategoryId);
  };

  // Find categories recursively
  const findCategoryById = (categories, slug) => {
    for (const category of categories) {
      if (category.slug === slug) return category;
      if (category.subCategories) {
        const subCategory = findCategoryById(category.subCategories, slug);
        if (subCategory) return subCategory;
      }
    }
    return null;
  };

  // Get subcategories and sub-subcategories for services
  const subServiceCategories = serviceparentCategoryId ? findCategoryById(servicecategories, serviceparentCategoryId)?.subCategories || [] : [];
  const subSubServiceCategories = (serviceparentCategoryId && servicesubCategoryId) ? findCategoryById(servicecategories, serviceparentCategoryId)?.subCategories.find(sub => sub.slug === servicesubCategoryId)?.subSubCategory || [] : [];

  // Get subcategories and sub-subcategories for industries
  const subIndustryCategories = industryparentCategoryId ? findCategoryById(industrycategories, industryparentCategoryId)?.subCategories || [] : [];
  const subSubIndustryCategories = (industryparentCategoryId && industrysubCategoryId) ? findCategoryById(industrycategories, industryparentCategoryId)?.subCategories.find(sub => sub.slug === industrysubCategoryId)?.subSubCategory || [] : [];

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Add FAQ</h1>
      
      {/* Service Categories */}
      <div className="mb-4">
        <label htmlFor="serviceParentCategory" className="block font-semibold mb-2">
          Parent Service Category
        </label>
        <select
          id="serviceParentCategory"
          value={serviceparentCategoryId}
          onChange={handleServiceParentCategoryChange}
          className="w-full p-2 border rounded focus:outline-none"
        >
          <option value="">Select Parent Service Category</option>
          {servicecategories.map(renderCategoryOptions)}
        </select>
      </div>

      {subServiceCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="serviceSubCategory" className="block font-semibold mb-2">
            Sub-Service Category (optional)
          </label>
          <select
            id="serviceSubCategory"
            value={servicesubCategoryId}
            onChange={handleServiceSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Sub-Service Category</option>
            {subServiceCategories.map(renderCategoryOptions)}
          </select>
        </div>
      )}

      {subSubServiceCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="serviceSubSubCategory" className="block font-semibold mb-2">
            Sub-Sub-Service Category (optional)
          </label>
          <select
            id="serviceSubSubCategory"
            value={servicesubSubCategoryId}
            onChange={handleServiceSubSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Sub-Sub-Service Category</option>
            {subSubServiceCategories.map(renderCategoryOptions)}
          </select>
        </div>
      )}

      {/* Industry Categories */}
      <div className="mb-4">
        <label htmlFor="industryParentCategory" className="block font-semibold mb-2">
          Parent Industry Category
        </label>
        <select
          id="industryParentCategory"
          value={industryparentCategoryId}
          onChange={handleIndustryParentCategoryChange}
          className="w-full p-2 border rounded focus:outline-none"
        >
          <option value="">Select Parent Industry Category</option>
          {industrycategories.map(renderCategoryOptions)}
        </select>
      </div>

      {subIndustryCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="industrySubCategory" className="block font-semibold mb-2">
            Sub-Industry Category (optional)
          </label>
          <select
            id="industrySubCategory"
            value={industrysubCategoryId}
            onChange={handleIndustrySubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Sub-Industry Category</option>
            {subIndustryCategories.map(renderCategoryOptions)}
          </select>
        </div>
      )}

      {subSubIndustryCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="industrySubSubCategory" className="block font-semibold mb-2">
            Sub-Sub-Industry Category (optional)
          </label>
          <select
            id="industrySubSubCategory"
            value={industrysubSubCategoryId}
            onChange={handleIndustrySubSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Sub-Sub-Industry Category</option>
            {subSubIndustryCategories.map(renderCategoryOptions)}
          </select>
        </div>
      )}

      {/* Question and Answer */}
      <div className="mb-4">
        <label htmlFor="question" className="block font-semibold mb-2">
          Question
        </label>
        <input
          type="text"
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>

      <div className="mb-8">
        <label htmlFor="answer" className="block font-semibold mb-2">
          Answer
        </label>
        <ReactQuill
          value={answer}
          onChange={setAnswer}
          modules={modules} // Include modules for image handling
          className="quill"
        />
      </div>

      {/* Status */}
      <div className="mb-4">
        <label htmlFor="status" className="block font-semibold mb-2">
          Status
        </label>
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

      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Add FAQ
      </button>
    </form>
  );
};

export default FAQForm;
