import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const EditPortfolio = () => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [details, setDetails] = useState("");
  const [photo, setPhoto] = useState([]);
  const [slug, setSlug] = useState("");

  const [status, setStatus] = useState("active");
  const [categories, setCategories] = useState([]);
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subSubCategoryId, setSubSubCategoryId] = useState("");
  // State for categories, parent, sub, and sub-sub categories with updated naming convention
  const [servicecategories, setServiceCategories] = useState([]);
  const [serviceparentCategoryId, setServiceParentCategoryId] = useState("");
  const [servicesubCategoryId, setServiceSubCategoryId] = useState("");
  const [servicesubSubCategoryId, setServiceSubSubCategoryId] = useState("");

  // state for industries 
  // State for categories, parent, sub, and sub-sub categories with updated naming convention
  const [industriescategories, setIndustriesCategories] = useState([]);
  const [industriesparentCategoryId, setIndustriesParentCategoryId] = useState("");
  const [industriessubCategoryId, setIndustriesSubCategoryId] = useState("");
  const [industriessubSubCategoryId, setIndustriesSubSubCategoryId] = useState("");
  const { slugs } = useParams();
  const [initialPhotos, setInitialPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [imgtitle, setImgtitle] = useState([]);
  const [initialphotoAlts, setInitialPhotoAlts] = useState([])
  const [initialimgtitle, setInitialImgtitle] = useState([])


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
  const fetchServiceCategories = async () => {
    try {
      const response = await axios.get('/api/services/getAll', { withCredentials: true });
      setServiceCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchIndustriesCategories = async () => {
    try {
      const response = await axios.get('/api/industries/getAll', { withCredentials: true });
      setIndustriesCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/Portfolio/getAll', { withCredentials: true });
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    fetchCategories();
    fetchServiceCategories()
    fetchIndustriesCategories()
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`/api/Portfolio/getPortfolioById?slugs=${slugs}`, { withCredentials: true });
      const Portfolio = response.data.data;
      setTitle(Portfolio.title);
      setDetails(Portfolio.details);
      setInitialPhotos(Portfolio.photo);
      setLink(Portfolio.link)
      setStatus(Portfolio.status);
      setInitialPhotoAlts(Portfolio.alt);
      setInitialImgtitle(Portfolio.imgtitle);


      setSlug(Portfolio.slug);


      // Fetch categories
      try {
        const categoryResponse = await axios.get(`/api/portfolio/getSpecificCategory?categoryId=${Portfolio.categories}`, { withCredentials: true });
        const category = categoryResponse.data;
        setParentCategoryId(category.slug);
      } catch (error) {
        console.error('Error fetching parent category:', error);
      }

      try {
        const subCategoryResponse = await axios.get(`/api/portfolio/getSpecificSubcategory?categoryId=${Portfolio.categories}&subCategoryId=${Portfolio.subcategories}`, { withCredentials: true });
        const subCategory = subCategoryResponse.data;
        setSubCategoryId(subCategory.slug);
      } catch (error) {
        console.error('Error fetching subcategory:', error);
      }

      try {
        const subSubCategoryResponse = await axios.get(`/api/portfolio/getSpecificSubSubcategory?categoryId=${Portfolio.categories}&subCategoryId=${Portfolio.subcategories}&subSubCategoryId=${Portfolio.subSubcategories}`, { withCredentials: true });
        const subSubCategory = subSubCategoryResponse.data
        setSubSubCategoryId(subSubCategory.slug);
      } catch (error) {
        console.error('Error fetching sub-subcategory:', error);
      }

      // // Fetch services
      try {
        const serviceCategoryResponse = await axios.get(`/api/services/getSpecificCategory?categoryId=${Portfolio.servicecategories}`, { withCredentials: true });
        const serviceCategory = serviceCategoryResponse.data;
        setServiceParentCategoryId(serviceCategory.slug);
      } catch (error) {
        console.error('Error fetching service parent category:', error);
      }

      try {
        const serviceSubCategoryResponse = await axios.get(`/api/services/getSpecificSubcategory?categoryId=${Portfolio.servicecategories}&subCategoryId=${Portfolio.servicesubcategories}`, { withCredentials: true });
        const serviceSubCategory = serviceSubCategoryResponse.data;
        setServiceSubCategoryId(serviceSubCategory.slug);
      } catch (error) {
        console.error('Error fetching service subcategory:', error);
      }

      try {
        const serviceSubSubCategoryResponse = await axios.get(`/api/services/getSpecificSubSubcategory?categoryId=${Portfolio.servicecategories}&subCategoryId=${Portfolio.servicesubcategories}&subSubCategoryId=${Portfolio.servicesubSubcategories}`, { withCredentials: true });
        const serviceSubSubCategory = serviceSubSubCategoryResponse.data;
        setServiceSubSubCategoryId(serviceSubSubCategory.slug);
      } catch (error) {
        console.error('Error fetching service sub-subcategory:', error);
      }


      // Fetch services
      try {
        const industriesCategoryResponse = await axios.get(`/api/industries/getSpecificCategory?categoryId=${Portfolio.industriescategories}`, { withCredentials: true });
        const industriesCategory = industriesCategoryResponse.data;
        setIndustriesParentCategoryId(industriesCategory.slug);
      } catch (error) {
        console.error('Error fetching industries parent category:', error);
      }

      try {
        const industriesSubCategoryResponse = await axios.get(`/api/industries/getSpecificSubcategory?categoryId=${Portfolio.servicecategories}&subCategoryId=${Portfolio.servicesubcategories}`, { withCredentials: true });
        const industriesSubCategory = industriesSubCategoryResponse.data;
        setIndustriesSubCategoryId(industriesSubCategory.slug);
      } catch (error) {
        console.error('Error fetching industries subcategory:', error);
      }

      try {
        const industriesSubSubCategoryResponse = await axios.get(`/api/industries/getSpecificSubSubcategory?categoryId=${Portfolio.servicecategories}&subCategoryId=${Portfolio.servicesubcategories}&subSubCategoryId=${Portfolio.servicesubSubcategories}`, { withCredentials: true });
        const industriesSubSubCategory = industriesSubSubCategoryResponse.data;
        setIndustriesSubSubCategoryId(industriesSubSubCategory.slug);
      } catch (error) {
        console.error('Error fetching service sub-subcategory:', error);
      }


    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('link', link);
      formData.append('details', details);

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

      // Combine initial and new photo alts into a single array
      const combinedAlts = [...initialphotoAlts, ...photoAlts];
      const combinedImgtitle = [...initialimgtitle, ...imgtitle];

      // Append photos and their respective alts to FormData
      photo.forEach((p) => {
        formData.append(`photo`, p);
      });

      combinedAlts.forEach((a) => {
        formData.append(`alt`, a);
      })
      combinedImgtitle.forEach((m) => {
        formData.append(`imgtitle`, m);
      })
      const response = await axios.put(`/api/portfolio/updatePortfolio?slugs=${slugs}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });


      navigate('/portfolio');
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const newPhotos = Array.from(e.target.files);
    setPhoto([...photo, ...newPhotos]);
  };

  const handleInitialAltTextChange = (e, index) => {
    const newPhotoAlts = [...initialphotoAlts];
    newPhotoAlts[index] = e.target.value;

    setInitialPhotoAlts(newPhotoAlts);
  };


  const handleInitialImgtitleChange = (e, index) => {
    const newImgtitle = [...initialimgtitle];
    newImgtitle[index] = e.target.value;

    setInitialImgtitle(newImgtitle);
  };
  const handleNewAltTextChange = (e, index) => {
    const newPhotoAlts = [...photoAlts];
    newPhotoAlts[index] = e.target.value;

    setPhotoAlts(newPhotoAlts);
  };
  const handleNewImgtitleChange = (e, index) => {
    const newImgtitle = [...imgtitle];
    newImgtitle[index] = e.target.value;

    setImgtitle(newImgtitle);
  };


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

  const handleDeleteInitialPhoto = (e, photoFilename, index) => {
    e.preventDefault();
    axios.delete(`/api/Portfolio/${slugs}/image/${photoFilename}/${index}`, { withCredentials: true })
      .then(response => {
        const updatedPhotos = initialPhotos.filter(photo => photo !== photoFilename);
        setInitialPhotos(updatedPhotos);
        const updatedPhotoAlts = [...initialphotoAlts];
        updatedPhotoAlts.splice(index, 1);
        setInitialPhotoAlts(updatedPhotoAlts);

        const updatedImgtitle = [...initialimgtitle];
        updatedImgtitle.splice(index, 1);
        setInitialImgtitle(updatedImgtitle);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleDeleteNewPhoto = (e, index) => {
    e.preventDefault();
    const updatedPhotos = [...photo];
    updatedPhotos.splice(index, 1);
    setPhoto(updatedPhotos);
    const updatedPhotoAlts = [...initialphotoAlts];
    updatedPhotoAlts.splice(index, 1);
    setInitialPhotoAlts(updatedPhotoAlts);

    const updatedImgtitle = [...initialimgtitle];
    updatedImgtitle.splice(index, 1);
    setInitialImgtitle(updatedImgtitle);
  };

  const renderCategoryOptions = (category) => {
    return (
      <option key={category._id} value={category.slug}>
        {category.category}
      </option>
    );
  };

  const renderSubCategoryOptions = (subCategory) => {
    return (
      <option key={subCategory._id} value={subCategory.slug}>
        {subCategory.category}
      </option>
    );
  };

  const renderSubSubCategoryOptions = (subSubCategory) => {
    return (
      <option key={subSubCategory._id} value={subSubCategory.slug}>
        {subSubCategory.category}
      </option>
    );
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


  // For inddustries
  const renderIndustriesCategoryOptions = (category) => {
    return (
      <option key={category._id} value={category.slug}>
        {category.category}
      </option>
    );
  };

  const renderIndustriesSubCategoryOptions = (subCategory) => {
    return (
      <option key={subCategory._id} value={subCategory.slug}>
        {subCategory.category}
      </option>
    );
  };

  const renderIndustriesSubSubCategoryOptions = (subSubCategory) => {
    return (
      <option key={subSubCategory._id} value={subSubCategory.slug}>
        {subSubCategory.category}
      </option>
    );
  };

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

  const handleServiceSubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setServiceSubSubCategoryId(selectedSubSubCategoryId);
  };

  const handleIndustriesParentCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setIndustriesParentCategoryId(selectedCategoryId);
    setIndustriesSubCategoryId(""); // Reset subcategory selection
    setIndustriesSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  const handleIndustriesSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setIndustriesSubCategoryId(selectedSubCategoryId);
    setIndustriesSubSubCategoryId(""); // Reset sub-subcategory selection
  };

  const handleIndustriesSubSubCategoryChange = (e) => {
    const selectedSubSubCategoryId = e.target.value;
    setIndustriesSubSubCategoryId(selectedSubSubCategoryId);
  };



  // Render categories safely
  const getSubCategories = (categoryId) => {
    const category = categories.find(category => category.slug === categoryId);
    return category?.subCategories || [];
  };

  const getSubSubCategories = (categoryId, subCategoryId) => {
    const category = categories.find(category => category.slug === categoryId);
    const subCategory = category?.subCategories.find(sub => sub.slug === subCategoryId);
    return subCategory?.subSubCategories || [];
  };

  // Render services safely
  const getServiceSubCategories = (categoryId) => {
    const category = servicecategories.find(category => category.slug === categoryId);
    return category?.subCategories || [];
  };

  const getServiceSubSubCategories = (categoryId, subCategoryId) => {
    const category = servicecategories.find(category => category.slug === categoryId);
    const subCategory = category?.subCategories.find(sub => sub.slug === subCategoryId);
    return subCategory?.subSubCategory || [];
  };

  // Render services safely
  const getIndustriesSubCategories = (categoryId) => {
    const category = industriescategories.find(category => category.slug === categoryId);
    return category?.subCategories || [];
  };

  const getIndustriesSubSubCategories = (categoryId, subCategoryId) => {
    const category = industriescategories.find(category => category.slug === categoryId);
    const subCategory = category?.subCategories.find(sub => sub.slug === subCategoryId);
    return subCategory?.subSubCategories || [];
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit Portfolio</h1>
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

      {getSubCategories(parentCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="subCategory" className="block font-semibold mb-2">
            Subcategory
          </label>
          <select
            id="subCategory"
            value={subCategoryId}
            onChange={handleSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Subcategory</option>
            {getSubCategories(parentCategoryId).map(renderSubCategoryOptions)}
          </select>
        </div>
      )}

      {getSubSubCategories(parentCategoryId, subCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="subSubCategory" className="block font-semibold mb-2">
            Sub-Subcategory
          </label>
          <select
            id="subSubCategory"
            value={subSubCategoryId}
            onChange={(e) => setSubSubCategoryId(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Sub-Subcategory</option>
            {getSubSubCategories(parentCategoryId, subCategoryId).map(renderSubSubCategoryOptions)}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="serviceParentCategory" className="block font-semibold mb-2">
          Service Parent Category
        </label>
        <select
          id="serviceParentCategory"
          value={serviceparentCategoryId}
          onChange={handleServiceParentCategoryChange}
          className="w-full p-2 border rounded focus:outline-none"
          required
        >
          <option value="">Select Service Parent Category</option>
          {servicecategories.map(renderServiceCategoryOptions)}
        </select>
      </div>

      {getServiceSubCategories(serviceparentCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="serviceSubCategory" className="block font-semibold mb-2">
            Service Subcategory
          </label>
          <select
            id="serviceSubCategory"
            value={servicesubCategoryId}
            onChange={handleServiceSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Service Subcategory</option>
            {getServiceSubCategories(serviceparentCategoryId).map(renderServiceSubCategoryOptions)}
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
            {getServiceSubSubCategories(serviceparentCategoryId, servicesubCategoryId).map(renderServiceSubSubCategoryOptions)}
          </select>
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="industriesParentCategory" className="block font-semibold mb-2">
          Industries Parent Category
        </label>
        <select
          id="industriesParentCategory"
          value={industriesparentCategoryId}
          onChange={handleIndustriesParentCategoryChange}
          className="w-full p-2 border rounded focus:outline-none"
          required
        >
          <option value="">Select Industries Parent Category</option>
          {industriescategories.map(renderIndustriesCategoryOptions)}
        </select>
      </div>

      {getIndustriesSubCategories(industriesparentCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="industriesSubCategory" className="block font-semibold mb-2">
            Industries Subcategory
          </label>
          <select
            id="industriesSubCategory"
            value={industriessubCategoryId}
            onChange={handleIndustriesSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Industries Subcategory</option>
            {getIndustriesSubCategories(industriesparentCategoryId).map(renderIndustriesSubCategoryOptions)}
          </select>
        </div>
      )}

      {getIndustriesSubSubCategories(industriesparentCategoryId, industriessubCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="industriesSubSubCategory" className="block font-semibold mb-2">
            Industries Sub-Subcategory
          </label>
          <select
            id="industriesSubSubCategory"
            value={industriessubSubCategoryId}
            onChange={handleIndustriesSubSubCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
          >
            <option value="">Select Industries Sub-Subcategory</option>
            {getIndustriesSubSubCategories(industriesparentCategoryId, industriessubCategoryId).map(renderIndustriesSubSubCategoryOptions)}
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
                  value={initialphotoAlts[index]}
                  onChange={(e) => handleInitialAltTextChange(e, index)}
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </label>
              <label htmlFor={`imgtitle-${index}`} className="block mt-2">
                Image Title Text:
                <input
                  type="text"
                  id={`imgtitle-${index}`}
                  value={initialimgtitle[index]}
                  onChange={(e) => handleInitialImgtitleChange(e, index)}
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </label>
              <button
                onClick={(e) => handleDeleteInitialPhoto(e, photo, index)}
                className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex justify-center items-center"
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
          {photo.map((file, index) => (
            <div key={index} className="relative w-56">
              <img
                src={URL.createObjectURL(file)}
                alt={`New Photo ${index + 1}`}
                className="w-56 h-32 object-cover"
              />

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
                Image Title Text:
                <input
                  type="text"
                  id={`alt-new-${index}`}
                  value={imgtitle[index] || ""}
                  onChange={(e) => handleNewImgtitleChange(e, index)}
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </label>
              <button
                onClick={(e) => handleDeleteNewPhoto(e, index)}
                className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex
                justify-center items-center"
              >
                <span className="text-xs">X</span>
              </button>
            </div>
          ))}
        </div>
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
      <div className="mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
        >
          Save Changes
        </button>
      </div>
    </form>
  );

}
export default EditPortfolio;
