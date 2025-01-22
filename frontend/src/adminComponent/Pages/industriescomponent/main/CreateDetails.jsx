import React, { useState ,useEffect} from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewIndustriesForm = () => {
  const { categoryId } = useParams(); // Extract categoryId and subcategoryId from URL
  const [heading, setHeading] = useState(""); // State for heading
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [imgtitle, setImgtitle] = useState([]);
  const [video, setVideo] = useState(null);
  const [altVideo, setVideoAlt] = useState("");
  const [videotitle, setVideotitle] = useState("");
  const [status, setStatus] = useState(true);
  const [questions, setQuestions] = useState([{ question: "", answer: "" }]);
    // State for categories, parent, sub, and sub-sub categories with updated naming convention
    const [servicecategories, setServiceCategories] = useState([]);
    const [serviceparentCategoryId, setServiceParentCategoryId] = useState("");
    const [servicesubCategoryId, setServiceSubCategoryId] = useState("");
    const [servicesubSubCategoryId, setServiceSubSubCategoryId] = useState("");
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

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      toast.error("You can only upload up to 5 photos");
      return;
    }
    setPhotos([...photos, ...files]);
    const newPhotoAlts = Array.from({ length: files.length }, () => "");
    setPhotoAlts([...photoAlts, ...newPhotoAlts]);
    const newImgtitles = Array.from({ length: files.length }, () => "");
    setImgtitle([...imgtitle, ...newImgtitles]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleDeleteImage = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    setPhotoAlts((prevPhotoAlts) => prevPhotoAlts.filter((_, i) => i !== index));
    setImgtitle((prevImgtitle) => prevImgtitle.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", answer: "" }]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('heading', heading); // Use heading as the name field
      formData.append('description', description);
      formData.append('status', status);
      formData.append('altVideo', altVideo);
      formData.append('categoryId', categoryId); // Send categoryId from URL
      formData.append('videotitle', videotitle);
      formData.append("servicecategories", serviceparentCategoryId);
      formData.append("servicesubcategories", servicesubCategoryId);
      formData.append("servicesubSubcategories", servicesubSubCategoryId);
      photos.forEach((photo, index) => {
        formData.append('photo', photo);
        formData.append('alt', photoAlts[index]);
        formData.append('imgtitle', imgtitle[index]);
      });

      if (video) {
        formData.append('video', video);
      }

      questions.forEach((qa) => {
        formData.append('questions', JSON.stringify(qa));
      });

      await axios.post('/api/industiesDetails/insertIndustriesDetail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      // Reset form fields
      setDescription("");
      setHeading(""); // Reset heading
      setPhotos([]);
      setVideo(null);
      setVideoAlt("");
      setStatus(true);
      setPhotoAlts([]);
      setImgtitle([]);
      setVideotitle("");
      setQuestions([{ question: "", answer: "" }]);
      navigate(`/industries`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create Industries.");
    }
  };


  useEffect(() => {
    fetchServiceCategories();
  }, []);

  // Fetch all service categories
  const fetchServiceCategories = async () => {
    try {
      const response = await axios.get("/api/services/getall", {
        withCredentials: true,
      });
      setServiceCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Render options for the parent, sub, and sub-sub categories
  const renderServiceCategoryOptions = (category) => (
    <option key={category._id} value={category.slug}>
      {category.category}
    </option>
  );

  // Handle changes for parent category
  const handleServiceParentCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setServiceParentCategoryId(selectedCategoryId);
    setServiceSubCategoryId(""); // Reset subcategory selection
    setServiceSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  // Handle changes for subcategory
  const handleServiceSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setServiceSubCategoryId(selectedSubCategoryId);
    setServiceSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  // Handle changes for sub-subcategory
  const handleServiceSubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setServiceSubSubCategoryId(selectedSubSubCategoryId);
  };

  // Find category by ID recursively
  const findServiceCategoryById = (categories, id) => {
    for (const category of categories) {
      if (category.slug === id) return category;
      if (category.subCategories) {
        const subCategory = findServiceCategoryById(category.subCategories, id);
        if (subCategory) return subCategory;
      }
    }
    return null;
  };

  // Find subcategories based on selected parent category
  const findServiceSubCategories = (categories, serviceparentCategoryId) => {
    const parentCategory = findServiceCategoryById(
      categories,
      serviceparentCategoryId
    );
    return parentCategory ? parentCategory.subCategories || [] : [];
  };

  // Find sub-subcategories based on selected subcategory
  const findServiceSubSubCategories = (
    categories,
    serviceparentCategoryId,
    servicesubCategoryId
  ) => {
    const parentCategory = findServiceCategoryById(
      categories,
      serviceparentCategoryId
    );
    if (parentCategory && parentCategory.subCategories) {
      const subCategory = findServiceCategoryById(
        parentCategory.subCategories,
        servicesubCategoryId
      );
      return subCategory ? subCategory.subSubCategory || [] : [];
    }
    return [];
  };

  // Get subcategories and sub-subcategories based on the selected parent and subcategory
  const subServiceCategories = serviceparentCategoryId
    ? findServiceSubCategories(servicecategories, serviceparentCategoryId)
    : [];
  const subSubServiceCategories =
    serviceparentCategoryId && servicesubCategoryId
      ? findServiceSubSubCategories(
          servicecategories,
          serviceparentCategoryId,
          servicesubCategoryId
        )
      : [];



  return (
    <form onSubmit={handleSubmit} className="p-4">
      <ToastContainer />
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Add Industries</h1>
  
      <div className="mb-4">
        <label htmlFor="parentCategory" className="block font-semibold mb-2">
          Parent Service Category
        </label>
        <select
          id="parentCategory"
          value={serviceparentCategoryId}
          onChange={handleServiceParentCategoryChange}
          className="w-full p-2 border rounded focus:outline-none"
          
        >
          <option value="">Select Parent Category</option>
          {servicecategories.map(renderServiceCategoryOptions)}
        </select>
      </div>

      {/* Subcategory */}
      {subServiceCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="subCategory" className="block font-semibold mb-2">
            Sub-Service Category (optional)
          </label>
          <select
            id="subCategory"
            value={servicesubCategoryId}
            onChange={handleServiceSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Subcategory</option>
            {subServiceCategories.map(renderServiceCategoryOptions)}
          </select>
        </div>
      )}

      {/* Sub-Subcategory */}
      {subSubServiceCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="subSubCategory" className="block font-semibold mb-2">
            Sub-Sub-Service Category (optional)
          </label>
          <select
            id="subSubCategory"
            value={servicesubSubCategoryId}
            onChange={handleServiceSubSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Sub-Subcategory</option>
            {subSubServiceCategories.map(renderServiceCategoryOptions)}
          </select>
        </div>
      )}



      {/* Heading Field */}
      <div className="mb-4">
        <label htmlFor="heading" className="block font-semibold mb-2">Heading</label>
        <ReactQuill
          value={heading}
          onChange={setHeading}
          modules={modules}
          className="quill"
        />
      </div>
      
      {/* Description Field */}
      <div className="mb-8">
        <label htmlFor="description" className="block font-semibold mb-2">Description</label>
        <ReactQuill
          value={description}
          onChange={setDescription}
          modules={modules}
          className="quill"
        />
      </div>
      
      {/* Photo Upload Field */}
      <div className="mt-12">
        <label htmlFor="photo" className="block font-semibold mb-2">Photos</label>
        <input
          type="file"
          name="photo"
          id="photo"
          multiple
          onChange={handlePhotoChange}
          className="border rounded focus:outline-none"
          accept="image/*"
        />
        {photos.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative group flex flex-col items-center w-56">
                <div className="relative w-56">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Industries ${index + 1}`}
                    className="w-56 h-32 object-cover"
                  />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
                  >
                    X
                  </button>
                </div>
                <label className="block mt-2">
                  Alternative Text:
                  <input
                    type="text"
                    value={photoAlts[index]}
                    onChange={(e) => {
                      const newPhotoAlts = [...photoAlts];
                      newPhotoAlts[index] = e.target.value;
                      setPhotoAlts(newPhotoAlts);
                    }}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </label>
                <label className="block mt-2">
                  Image title Text:
                  <input
                    type="text"
                    value={imgtitle[index]}
                    onChange={(e) => {
                      const newImgtitles = [...imgtitle];
                      newImgtitles[index] = e.target.value;
                      setImgtitle(newImgtitles);
                    }}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Video Upload Field */}
      <div className="mt-4">
        <label htmlFor="video" className="block font-semibold mb-2">Video</label>
        <input
          type="file"
          id="video"
          onChange={handleVideoChange}
          className="border rounded focus:outline-none"
          accept="video/*"
        />
        {video && (
          <div className="mt-4">
            <label htmlFor="videoAlt" className="block font-semibold mb-2">Video Alt Text</label>
            <input
              type="text"
              id="videoAlt"
              value={altVideo}
              onChange={(e) => setVideoAlt(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none"
              
            />
                 <div className="mt-4">
          <label htmlFor="videotitle" className="block font-semibold mb-2">Video title Text</label>
          <input
            type="text"
            id="videotitle"
            value={videotitle}
            onChange={(e) => setVideotitle(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none"
            
          />
        </div>
          </div>
        )}
   
      </div>

      {/* Questions Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Questions and Answers</h3>
        {questions.map((qa, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-1 font-medium">Question</label>
            <input
              type="text"
              name="question"
              value={qa.question}
              onChange={(event) => handleQuestionChange(index, event)}
              className="w-full p-2 border rounded focus:outline-none mb-2"
              
            />
            <label className="block mb-1 font-medium">Answer</label>
            <input
              type="text"
              name="answer"
              value={qa.answer}
              onChange={(event) => handleQuestionChange(index, event)}
              className="w-full p-2 border rounded focus:outline-none"
              
            />
            {questions.length > 1 && (
              <button
                type="button"
                className="mt-2 text-red-600"
                onClick={() => handleRemoveQuestion(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddQuestion}
        >
          Add Another Question
        </button>
      </div>

      {/* Status Toggle */}
      <div className="mt-8">
        <label htmlFor="status" className="inline-flex items-center">
          <input
            type="checkbox"
            id="status"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 font-medium">Active</span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Create Industries
        </button>
      </div>
    </form>
  );
};

export default NewIndustriesForm;
