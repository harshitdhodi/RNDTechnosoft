
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "react-toastify/dist/ReactToastify.css";

const EditIndustriesDetails = () => {
  const { categoryId } = useParams();
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]); // Renamed for consistency
  const [photoAlts, setPhotoAlts] = useState([]);
  const [imgtitle,setImgtitle] =useState([])
  const [video, setVideo] = useState(null); // Initialized to null
  const [videoAlt, setVideoAlt] = useState("");
  const [videotitle,setVideotitle]= useState("")
  const [status, setStatus] = useState(true);
  const [questions, setQuestions] = useState([{ question: "", answer: "" }]);
  const [initialPhotos, setInitialPhotos] = useState([]);
  const [initialPhotoAlts, setInitialPhotoAlts] = useState([]);
  const [initialVideoAlt, setInitialVideoAlt] = useState("");
  const [initialImgtitle,setInitialImgtitle]=useState([]);
  const [initialVideo,setInitialVideo]=useState("")
  const [initialVideotitle,setInitialVideotitle]=useState("")

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



  useEffect(() => {
    fetchIndustriesDetails();
    fetchServiceCategories();

  }, []);

  const fetchIndustriesDetails = async () => {
    try {
      const response = await axios.get(`/api/industiesDetails/getIndustriesDetailById?id=${categoryId}`, { withCredentials: true });
      const IndustriesDetails = response.data.data;

      setHeading(IndustriesDetails.heading);
      setDescription(IndustriesDetails.description);
      setInitialPhotos(IndustriesDetails.photo || []); // Store initial photos
      setInitialPhotoAlts(IndustriesDetails.alt || []); // Store initial alt texts
      setInitialVideo(IndustriesDetails.video);      
      setInitialVideoAlt(IndustriesDetails.altVideo);
      setInitialImgtitle(IndustriesDetails.imgtitle)
      setInitialVideotitle(IndustriesDetails.videotitle)
      setStatus(IndustriesDetails.status);
      setQuestions(IndustriesDetails.questions || [{ question: "", answer: "" }]);
      

   // Fetch services
   try {
    const serviceCategoryResponse = await axios.get(
      `/api/services/getSpecificCategory?categoryId=${IndustriesDetails.servicecategories}`,
      { withCredentials: true }
    );
    const serviceCategory = serviceCategoryResponse.data;
    setServiceParentCategoryId(serviceCategory.slug);
  } catch (error) {
    console.error("Error fetching service parent category:", error);
  }

  try {
    const serviceSubCategoryResponse = await axios.get(
      `/api/services/getSpecificSubcategory?categoryId=${IndustriesDetails.servicecategories}&subCategoryId=${IndustriesDetails.servicesubcategories}`,
      { withCredentials: true }
    );
    const serviceSubCategory = serviceSubCategoryResponse.data;
    setServiceSubCategoryId(serviceSubCategory.slug);
  } catch (error) {
    console.error("Error fetching service subcategory:", error);
  }

  try {
    const servicesubSubCategoryResponse = await axios.get(
      `/api/services/getSpecificSubSubcategory?categoryId=${IndustriesDetails.servicecategories}&subCategoryId=${IndustriesDetails.servicesubcategories}&subSubCategoryId=${IndustriesDetails.servicesubSubcategories}`,
      { withCredentials: true }
    );
    const servicesubSubCategory = servicesubSubCategoryResponse.data;
    setServiceSubSubCategoryId(servicesubSubCategory.slug);
  } catch (error) {
    console.error("Error fetching service sub-subcategory:", error);
  }


    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('heading', heading);
      formData.append('description', description);
      formData.append('status', status);
      formData.append("servicecategories", serviceparentCategoryId);
      formData.append("servicesubcategories", servicesubCategoryId);
      formData.append("servicesubSubcategories", servicesubSubCategoryId);
      
        formData.append('video', video);
        formData.append('altVideo', videoAlt);
        formData.append('videotitle',videotitle || initialVideotitle)

      
      const combinedAlts = [...initialPhotoAlts, ...photoAlts];
      const combinedImgtitle = [...initialImgtitle, ...imgtitle];


      photos.forEach((p) => {
        formData.append('photo', p);
      });

      combinedAlts.forEach((a) => {
        formData.append('alt', a);
      });

      combinedImgtitle.forEach((m) => {
        formData.append('imgtitle', m);
      });


      questions.forEach((q) => {
        formData.append('questions', JSON.stringify(q));
      });

      await axios.put(`/api/industiesDetails/updateIndustriesDetail?id=${categoryId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      navigate(`/Industries`);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchServiceCategories = async () => {
    try {
      const response = await axios.get("/api/services/getAll", {
        withCredentials: true,
      });
      setServiceCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // For Services
  const renderServiceCategoryOptions = (category) => {
    return (
      <option key={category._id} value={category.slug}>
        {category.category}
      </option>
    );
  };

  const renderServiceSubCategoryOptions = (subCategory) => {
    return (
      <option key={subCategory._id} value={subCategory.slug}>
        {subCategory.category}
      </option>
    );
  };
  const renderServiceSubSubCategoryOptions = (subSubCategory) => {
    return (
      <option key={subSubCategory._id} value={subSubCategory.slug}>
        {subSubCategory.category}
      </option>
    );
  };

  const handleServiceParentCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setServiceParentCategoryId(selectedCategoryId);
    setServiceSubCategoryId(""); // Reset subcategory selection
    setServiceSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  const handleServiceSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setServiceSubCategoryId(selectedSubCategoryId);
    setServiceSubSubCategoryId(""); // Reset sub-subcategory selection
  };

 // Handler for service sub-subcategory (you already had this)
const handleServiceSubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setServiceSubSubCategoryId(selectedSubSubCategoryId);
  };

//   const getSubSubCategories = (categoryId, subCategoryId) => {
//     const category = categories.find((category) => category._id === categoryId);
//     if (!category) {
//       return [];
//     }
  
//     const subCategory = category.subCategories.find(
//       (sub) => sub._id === subCategoryId
//     );
//     if (!subCategory) {
//       return [];
//     }
  
//     return subCategory.subSubCategory || [];
//   };

  // Render services safely
  const getServiceSubCategories = (categoryId) => {
    const category = servicecategories.find(
      (category) => category.slug === categoryId
    );
    return category?.subCategories || [];
  };

  const getServiceSubSubCategories = (categoryId, subCategoryId) => {
    const category = servicecategories.find(
      (category) => category.slug === categoryId
    );
    if (!category) {
      return [];
    }
  
    const subCategory = category.subCategories.find(
      (sub) => sub.slug === subCategoryId
    );
    if (!subCategory) {
      return [];
    }
  
    return subCategory.subSubCategory || [];
  };


  const handleFileChange = (e) => {
    const newPhotos = Array.from(e.target.files);
    setPhotos([...photos, ...newPhotos]);
  };

  const handleVideoChange = (e) => {
    const selectedVideo = e.target.files[0];
    setVideo(selectedVideo);
    setVideoAlt(""); // Reset alt text when new video is uploaded
    setVideotitle(""); // Reset alt text when new video is uploaded

  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", answer: "" }]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleInitialAltTextChange = (e, index) => {
    const newPhotoAlts = [...initialPhotoAlts];
    newPhotoAlts[index] = e.target.value;
    setInitialPhotoAlts(newPhotoAlts);
  };

  const handleNewAltTextChange = (e, index) => {
    const newPhotoAlts = [...photoAlts];
    newPhotoAlts[index] = e.target.value;
    setPhotoAlts(newPhotoAlts);
  };

  const handleInitialImgtitleChange = (e, index) => {
    const newImgtitles = [...initialImgtitle];
    newImgtitles[index] = e.target.value;
    setInitialImgtitle(newImgtitles);
  };

  const handleNewImgtitleChange = (e, index) => {
    const newImgtitles = [...imgtitle];
    newImgtitles[index] = e.target.value;
    setImgtitle(newImgtitles);
  };



  const handleDeleteInitialPhoto = async (e, photoFilename, index) => {
    e.preventDefault();
    try {
      await axios.delete(`/api/industiesDetails/${categoryId}/image/${photoFilename}/${index}`, { withCredentials: true });
      const updatedPhotos = initialPhotos.filter((_, i) => i !== index);
      setInitialPhotos(updatedPhotos);
      const updatedPhotoAlts = initialPhotoAlts.filter((_, i) => i !== index);
      setInitialPhotoAlts(updatedPhotoAlts);
      const updatedImgtitle = [...initialImgtitle];
      updatedImgtitle.splice(index, 1);
      setInitialImgtitle(updatedImgtitle);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteNewPhoto = (e, index) => {
    e.preventDefault();
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    const updatedPhotoAlts = photoAlts.filter((_, i) => i !== index);
    setPhotoAlts(updatedPhotoAlts);
    const updatedImgtitle = [...imgtitle];
    updatedImgtitle.splice(index, 1);
    setPhotoAlts(updatedImgtitle);
  };

  const handleDeleteVideo = async (e) => {
    e.preventDefault();
    try {
      if (video) {
        await axios.delete(`/api/industiesDetails/IndustriesDetail/${categoryId}/video/${video}`, { withCredentials: true });
        setVideo(null);
        setVideoAlt(""); // Optionally reset alt text
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };
  
  const handleDeleteQuestion = async (e, questionId, index) => {
    e.preventDefault();
    try {
      await axios.delete(`/api/industiesDetails/${categoryId}/questions/${questionId}`, { withCredentials: true });
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit Industries Details</h1>
      <div className="mb-4">
        <label
          htmlFor="serviceParentCategory"
          className="block font-semibold mb-2"
        >
          Service Parent Category
        </label>
        <select
          id="serviceParentCategory"
          value={serviceparentCategoryId}
          onChange={handleServiceParentCategoryChange}
          className="w-full p-2 border rounded focus:outline-none"
          
        >
          <option value="">Select Service Parent Category</option>
          {servicecategories.map(renderServiceCategoryOptions)}
        </select>
      </div>

      {getServiceSubCategories(serviceparentCategoryId).length > 0 && (
        <div className="mb-4">
          <label
            htmlFor="serviceSubCategory"
            className="block font-semibold mb-2"
          >
            Service Subcategory
          </label>
          <select
            id="serviceSubCategory"
            value={servicesubCategoryId}
            onChange={handleServiceSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Service Subcategory</option>
            {getServiceSubCategories(serviceparentCategoryId).map(
              renderServiceSubCategoryOptions
            )}
          </select>
        </div>
      )}

{getServiceSubSubCategories(serviceparentCategoryId, servicesubCategoryId).length > 0 && (
  <div className="mb-4">
    <label htmlFor="serviceSubSubCategory" className="block font-semibold mb-2">
      Service Sub-Subcategory
    </label>
    <select
      id="serviceSubSubCategory"
      value={servicesubSubCategoryId}
      onChange={handleServiceSubSubCategoryChange}
      className="w-full p-2 border rounded focus:outline-none"
    >
      <option value="">Select Service Sub-Subcategory</option>
      {getServiceSubSubCategories(serviceparentCategoryId, servicesubCategoryId).map(
        renderServiceSubSubCategoryOptions
      )}
    </select>
  </div>
)}


      <div className="mb-4">
        <label htmlFor="heading" className="block font-semibold mb-2">Heading</label>
       <div className="mb-4">     
           <ReactQuill
          value={heading}
          onChange={setHeading}
          modules={modules}
          className="quill"
          
        />
      </div>

      <div className="mb-8">
        <label htmlFor="description" className="block font-semibold mb-2">Description</label>
        <ReactQuill
          value={description}
          onChange={setDescription}
          modules={modules}
          className="quill"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Current Photos</label>
        <div className="flex flex-wrap gap-4">
          {initialPhotos.map((photo, index) => (
            <div key={index} className="relative w-56">
              <img
                src={`/api/image/download/${photo}`}
                alt={`Photo ${index + 1}`}
                className="w-56 h-32 object-cover"
              />
              <label htmlFor={`alt-${index}`} className="block mt-2">
                Alternative Text:
                <input
                  type="text"
                  id={`alt-${index}`}
                  value={initialPhotoAlts[index] || ""}
                  onChange={(e) => handleInitialAltTextChange(e, index)}
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </label>
              <label htmlFor={`alt-${index}`} className="block mt-2">
                Title Text:
                <input
                  type="text"
                  id={`imgtitle-${index}`}
                  value={initialImgtitle[index]}
                  onChange={(e) => handleInitialImgtitleChange(e, index)}
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </label>
              <button
                onClick={(e) => handleDeleteInitialPhoto(e, photo, index)}
                className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 flex justify-center items-center"
              >
                <span className="text-xs">X</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Add New Photos</label>
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="p-2 border rounded"
        />
        <div className="flex flex-wrap gap-4 mt-4">
          {photos.map((file, index) => (
            <div key={index} className="relative w-56">
              {/* <img
                src={URL.createObjectURL(file)}
                alt={`New Photo ${index + 1}`}
                className="w-56 h-32 object-cover"
              /> */}
              <label htmlFor={`alt-new-${index}`} className="block mt-2">
                Alternative Text:
                <input
                  type="text"
                  id={`alt-new-${index}`}
                  value={photoAlts[index] || ""}
                  onChange={(e) => handleNewAltTextChange(e, index)}
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </label>
              <label htmlFor={`imgtitle-new-${index}`} className="block mt-2">
                Title Text:
                <input
                  type="text"
                  id={`imgtitle-new-${index}`}
                  value={imgtitle[index] || ""}
                  onChange={(e) => handleNewImgtitleChange(e, index)}
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </label>
              <button
                onClick={(e) => handleDeleteNewPhoto(e, index)}
                className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 flex justify-center items-center"
              >
                <span className="text-xs">X</span>
              </button>
            </div>
          ))}
        </div>
      </div>


      <div className="mb-4">
        <label htmlFor="video" className="block font-semibold mb-2">
          Upload Video
        </label>
        <input
          type="file"
          id="video"
          onChange={handleVideoChange}
          accept="video/*"
          className="p-2 border rounded"
        />
        {(video || initialVideo) && (
          <div className="mt-4">
            <label className="block font-semibold mb-2">Current Video</label>
            <div className="relative w-56">
              <video
                src={
                  video
                    ? URL.createObjectURL(video)
                    : `/api/video/download/${initialVideo}`
                } // Update this to match your API endpoint for video
                controls
                className="w-56 h-32 object-cover"
              />
              <label htmlFor="videoAlt" className="block mt-2">
                Video Alt Text:
                <input
                  type="text"
                  id="videoAlt"
                  value={videoAlt || initialVideoAlt}
                  onChange={(e) => setVideoAlt(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </label>
              <label htmlFor="videotitle" className="block mt-2">
                title Text:
                <input
                  type="text"
                  id="videotitle"
                  value={videotitle || initialVideotitle}
                  onChange={(e) => setVideotitle(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </label>
              <button
                onClick={handleDeleteVideo}
                className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 flex justify-center items-center"
              >
                <span className="text-xs">X</span>
              </button>
            </div>
          </div>
        )}
      </div>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value === "true")}
          className="p-2 border rounded focus:outline-none"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Questions & Answers</label>
 

        {questions.map((question, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder="Question"
              value={question.question}
              onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
              className="w-full p-2 mb-2 border rounded focus:outline-none"
            />
            <ReactQuill
              value={question.answer}
              onChange={(value) => handleQuestionChange(index, "answer", value)}
              className="quill"
            />
            <button
              type="button"
              onClick={(e) => handleDeleteQuestion(e, question._id, index)}
              className="mt-2 bg-red-500 text-white rounded-md p-2 flex justify-center items-center"
            >
              <span className="text-xs">Remove</span>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddQuestion}
          className="mt-4 bg-green-500 text-white rounded-md p-2"
        >
          Add Question
        </button>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md p-2 flex justify-center items-center"
        >
          <span className="text-xs">Update Industries Details</span>
        </button>
      </div>
    </form>
  );
};

export default EditIndustriesDetails;
