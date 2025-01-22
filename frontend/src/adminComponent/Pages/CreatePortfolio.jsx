import React, { useState, useEffect } from "react";
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewPortfolioForm = () => {
  const [title, setTitle] = useState("");
  const [link,setLink]=useState("")
  const [details, setDetails] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [imgtitle, setImgtitle] = useState([]);
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("active");
  const [categories, setCategories] = useState([]);
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subSubCategoryId, setSubSubCategoryId] = useState("");
  // // State for categories, parent, sub, and sub-sub categories with updated naming convention
  const [servicecategories, setServiceCategories] = useState([]);
  const [serviceparentCategoryId, setServiceParentCategoryId] = useState("");
  const [servicesubCategoryId, setServiceSubCategoryId] = useState("");
  const [servicesubSubCategoryId, setServiceSubSubCategoryId] = useState("");

 
  const [industriescategories, setIndustriesCategories] = useState([]);
  const [industriesparentCategoryId, setIndustriesParentCategoryId] = useState("");
  const [industriessubCategoryId, setIndustriesSubCategoryId] = useState("");
  const [industriessubSubCategoryId, setIndustriesSubSubCategoryId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/portfolio/getall', { withCredentials: true });
      setCategories(response.data);
    } catch (error) {
      console.error(error);
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
    const newImgtitle = Array.from({ length: files.length }, () => "");
    setImgtitle([...imgtitle, ...newImgtitle]);
  };

  const handleDeleteImage = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    setPhotoAlts((prevPhotoAlts) => prevPhotoAlts.filter((_, i) => i !== index));
    setImgtitle((prevImgtitle) => prevImgtitle.filter((_, i) => i !== index));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('link', link);
      formData.append('details', details);


      photos.forEach((photo, index) => {
        formData.append(`photo`, photo);
        formData.append(`alt`, photoAlts[index]);
        formData.append(`imgtitle`, imgtitle[index]);

      });
      formData.append('slug', slug);
      formData.append('status', status);
      formData.append('categories', parentCategoryId);
      formData.append('subcategories', subCategoryId);
      formData.append('subSubcategories', subSubCategoryId);
      formData.append('servicecategories', serviceparentCategoryId);
      formData.append('servicesubcategories', servicesubCategoryId);
      formData.append('servicesubSubcategories', servicesubSubCategoryId);
      formData.append('industrycategories', industriesparentCategoryId);
      formData.append('industrysubcategories', industriessubCategoryId);
      formData.append('industrysubSubcategories', industriessubSubCategoryId);
      const response = await axios.post('/api/Portfolio/insertPortfolio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });



      // Reset form state
      setTitle("");
      setLink("");
      setDetails("");
      setPhotos([])
      setStatus("active");
      setParentCategoryId("");
      setSubCategoryId("");
      setSubSubCategoryId("");
      setPhotoAlts([]);
      setImgtitle([]);

      // Navigate to Portfolio page after successful submission
      navigate('/Portfolio');
    } catch (error) {
      console.error(error);
    }
  };

  const renderCategoryOptions = (category) => (
    <option key={category._id} value={category.slug}>
      {category.category}
    </option>
  );

  const handleParentCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setParentCategoryId(selectedCategoryId);
    setSubCategoryId("");
    setSubSubCategoryId("");
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setSubCategoryId(selectedSubCategoryId);
    setSubSubCategoryId("");
  };

  const handleSubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setSubSubCategoryId(selectedSubSubCategoryId);
  };

  const findCategoryById = (categories, id) => {
    for (const category of categories) {
      if (category.slug === id) return category;
      if (category.subCategories) {
        const subCategory = findCategoryById(category.subCategories, id);
        if (subCategory) return subCategory;
      }
    }
    return null;
  };

  const findSubCategories = (categories, parentCategoryId) => {
    const parentCategory = findCategoryById(categories, parentCategoryId);
    return parentCategory ? parentCategory.subCategories || [] : [];
  };

  const findSubSubCategories = (categories, parentCategoryId, subCategoryId) => {
    const parentCategory = findCategoryById(categories, parentCategoryId);
    if (parentCategory && parentCategory.subCategories) {
      const subCategory = findCategoryById(parentCategory.subCategories, subCategoryId);
      return subCategory ? subCategory.subSubCategory || [] : [];
    }
    return [];
  };

  const subCategories = parentCategoryId ? findSubCategories(categories, parentCategoryId) : [];
  const subSubCategories = (parentCategoryId && subCategoryId) ? findSubSubCategories(categories, parentCategoryId, subCategoryId) : [];


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
    fetchServiceCategories();
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

  // // Handle changes for subcategory
  const handleServiceSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setServiceSubCategoryId(selectedSubCategoryId);
    setServiceSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  // // Handle changes for sub-subcategory
  const handleServiceSubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setServiceSubSubCategoryId(selectedSubSubCategoryId);
  };

  // // Find category by ID recursively
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

  // // Find subcategories based on selected parent category
  const findServiceSubCategories = (categories, serviceparentCategoryId) => {
    const parentCategory = findServiceCategoryById(categories, serviceparentCategoryId);
    return parentCategory ? parentCategory.subCategories || [] : [];
  };

  // // Find sub-subcategories based on selected subcategory
  const findServiceSubSubCategories = (categories, serviceparentCategoryId, servicesubCategoryId) => {
    const parentCategory = findServiceCategoryById(categories, serviceparentCategoryId);
    if (parentCategory && parentCategory.subCategories) {
      const subCategory = findServiceCategoryById(parentCategory.subCategories, servicesubCategoryId);
      return subCategory ? subCategory.subSubCategory || [] : [];
    }
    return [];
  };

  // // Get subcategories and sub-subcategories based on the selected parent and subcategory
  const subServiceCategories = serviceparentCategoryId ? findServiceSubCategories(servicecategories, serviceparentCategoryId) : [];
  const subSubServiceCategories = (serviceparentCategoryId && servicesubCategoryId) ? findServiceSubSubCategories(servicecategories, serviceparentCategoryId, servicesubCategoryId) : [];



  useEffect(() => {
      fetchIndustriesCategories();
    }, []);

  // Fetch all Industries categories
  const fetchIndustriesCategories = async () => {
    try {
        const response = await axios.get('/api/industries/getall', { withCredentials: true });
        setIndustriesCategories(response.data);
    } catch (error) {
        console.error(error);
    }
  };

  // Render options for the parent, sub, and sub-sub categories
  const renderIndustriesCategoryOptions = (category) => (
    <option key={category._id} value={category.slug}>
        {category.category}
    </option>
  );

  // Handle changes for parent category
  const handleIndustriesParentCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setIndustriesParentCategoryId(selectedCategoryId);
    setIndustriesSubCategoryId(""); // Reset subcategory selection
    setIndustriesSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  // Handle changes for subcategory
  const handleIndustriesSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setIndustriesSubCategoryId(selectedSubCategoryId);
    setIndustriesSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  // Handle changes for sub-subcategory
  const handleIndustriesSubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setIndustriesSubSubCategoryId(selectedSubSubCategoryId);
  };

  // Find category by ID recursively
  const findIndustriesCategoryById = (categories, id) => {
    for (const category of categories) {
        if (category.slug === id) return category;
        if (category.subCategories) {
            const subCategory = findIndustriesCategoryById(category.subCategories, id);
            if (subCategory) return subCategory;
        }
    }
    return null;
  };

  // Find subcategories based on selected parent category
  const findIndustriesSubCategories = (categories, IndustriesparentCategoryId) => {
    const parentCategory = findIndustriesCategoryById(categories, IndustriesparentCategoryId);
    return parentCategory ? parentCategory.subCategories || [] : [];
  };

  // Find sub-subcategories based on selected subcategory
  const findIndustriesSubSubCategories = (categories, IndustriesparentCategoryId, IndustriessubCategoryId) => {
    const parentCategory = findIndustriesCategoryById(categories, IndustriesparentCategoryId);
    if (parentCategory && parentCategory.subCategories) {
        const subCategory = findIndustriesCategoryById(parentCategory.subCategories, IndustriessubCategoryId);
        return subCategory ? subCategory.subSubCategories || [] : [];
    }
    return [];
  };

  // Get subcategories and sub-subcategories based on the selected parent and subcategory
  const subIndustriesCategories = industriesparentCategoryId ? findIndustriesSubCategories(industriescategories, industriesparentCategoryId) : [];
  const subSubIndustriesCategories = (industriesparentCategoryId && industriessubCategoryId) ? findIndustriesSubSubCategories(industriescategories, industriesparentCategoryId, industriessubCategoryId) : [];

  useEffect(() => {
    setSlug(title.replace(/\s+/g, '-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
    );
  }, [title])

  useEffect(() => {
    setSlug(slug.toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
    );
  }, [slug])

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <ToastContainer />
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Add Portfolio</h1>
      <div className="mb-4">
        <label htmlFor="parentCategory" className="block font-semibold mb-2">
          Parent Category
        </label>
        <select
          id="parentCategory"
          value={parentCategoryId}
          onChange={handleParentCategoryChange}
          className="w-full p-2 border rounded focus:outline-none"
          required
        >
          <option value="">Select Parent Category</option>
          {categories.map(renderCategoryOptions)}
        </select>
      </div>
      {subCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="subCategory" className="block font-semibold mb-2">
            Subcategory (optional)
          </label>
          <select
            id="subCategory"
            value={subCategoryId}
            onChange={handleSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Subcategory</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory._id} value={subCategory.slug}>
                {subCategory.category}
              </option>
            ))}
          </select>
        </div>
      )}
      {subSubCategories.length > 0 && (
        <div className="mb-4">
          <label htmlFor="subSubCategory" className="block font-semibold mb-2">
            Sub-Subcategory (optional)
          </label>
          <select
            id="subSubCategory"
            value={subSubCategoryId}
            onChange={handleSubSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option >Select Sub-Subcategory</option>
            {subSubCategories.map((subSubCategory) => (
              <option key={subSubCategory._id} value={subSubCategory.slug}>
                {subSubCategory.category}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="parentCategory" className="block font-semibold mb-2">
          Parent Service Category
        </label>
        <select
          id="parentCategory"
          value={serviceparentCategoryId}
          onChange={handleServiceParentCategoryChange}
          className="w-full p-2 border rounded focus:outline-none"
          required
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



      <div className="mb-4">
                <label htmlFor="parentCategory" className="block font-semibold mb-2">
                    Parent industries Category
                </label>
                <select
                    id="parentCategory"
                    value={industriesparentCategoryId}
                    onChange={handleIndustriesParentCategoryChange}
                    className="w-full p-2 border rounded focus:outline-none"
                    required
                >
                    <option value="">Select Parent Category</option>
                    {industriescategories.map(renderIndustriesCategoryOptions)}
                </select>
            </div> 

      {/* Subcategory */}
      {subIndustriesCategories.length > 0 && (
                <div className="mb-4">
                    <label htmlFor="subCategory" className="block font-semibold mb-2">
                        Sub-industries Category (optional)
                    </label>
                    <select
                        id="subCategory"
                        value={industriessubCategoryId}
                        onChange={handleIndustriesSubCategoryChange}
                        className="w-full p-2 border rounded focus:outline-none"
                    >
                        <option value="">Select Subcategory</option>
                        {subIndustriesCategories.map(renderIndustriesCategoryOptions)}
                    </select>
                </div>
            )}

      {/* Sub-Subcategory */}
       {subSubIndustriesCategories.length > 0 && (
                <div className="mb-4">
                    <label htmlFor="subSubCategory" className="block font-semibold mb-2">
                        Sub-Sub-industries Category (optional)
                    </label>
                    <select
                        id="subSubCategory"
                        value={industriessubSubCategoryId}
                        onChange={handleIndustriesSubSubCategoryChange}
                        className="w-full p-2 border rounded focus:outline-none"
                    >
                        <option value="">Select Sub-Subcategory</option>
                        {subSubIndustriesCategories.map(renderIndustriesCategoryOptions)}
                    </select>
                </div>
            )}

      <div className="mb-4">
        <label htmlFor="title" className="block font-semibold mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="link" className="block font-semibold mb-2">
          Website Link
        </label>
        <input
          type="text"
          id="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        />
      </div>
      <div className="mb-8">
        <label htmlFor="details" className="block font-semibold mb-2">
          Description
        </label>
        <ReactQuill
          value={details}
          onChange={setDetails}
          modules={modules} // Include modules for image handling
          className="quill"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="photo" className="block font-semibold mb-2">
          Photos
        </label>
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
              <div key={index} className="relative w-56">
                <button
                  type="button"
                  className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
                  onClick={() => handleDeleteImage(index)}
                >
                  X
                </button>
                <img
                  src={URL.createObjectURL(photo)}
                  alt=""
                  className=" h-32 w-56 object-cover"
                />
                <label>Alternative Text :
                  <input
                    type="text"
                    value={photoAlts[index]}
                    onChange={(e) => {
                      const newPhotoAlts = [...photoAlts];
                      newPhotoAlts[index] = e.target.value;
                      setPhotoAlts(newPhotoAlts);
                    }}
                    className="w-full p-2 mt-2 border rounded focus:outline-none"
                  />
                </label>
                <label>Image Title Text :
                  <input
                    type="text"
                    value={imgtitle[index]}
                    onChange={(e) => {
                      const newImgtitle = [...imgtitle];
                      newImgtitle[index] = e.target.value;
                      setImgtitle(newImgtitle);
                    }}
                    className="w-full p-2 mt-2 border rounded focus:outline-none"
                  />
                </label>
              </div>

            ))}
          </div>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="status" className="block font-semibold mb-2">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Add Portfolio
      </button>
    </form>
  );
};

export default NewPortfolioForm;
