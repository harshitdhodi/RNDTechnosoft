import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  validateCategory, validatePhoto, validatePhotoAlt, validatePhotoTitle,
  validateSlug, validateMetaTitle, validateMetaDescription, validateMetaKeywords,
  validateMetaLanguage, validateMetaCanonical, validateMetaSchema, validateOtherMeta,
  validateUrl, validateChangeFreq, validatePriority
} from '../../utiles/validations'; // Assuming validation file is in the same directory

const NewCategoryForm = () => {
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState(null);
  const [altText, setAltText] = useState("");
  const [imgtitle, setImgtitle] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [priority, setPriority] = useState("0");
  const [changeFreq, setChangeFreq] = useState("");
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [metatitle, setMetatitle] = useState("");
  const [metadescription, setMetadescription] = useState("");
  const [metakeywords, setMetakeywords] = useState("");
  const [metalanguage, setMetalanguage] = useState("");
  const [metacanonical, setMetacanonical] = useState("");
  const [metaschema, setMetaschema] = useState("");
  const [otherMeta, setOthermeta] = useState("");
  const [status, setStatus] = useState("active");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setErrors((prev) => ({ ...prev, photo: validatePhoto(file) }));
  };

  const handleDeleteImage = () => {
    setPhoto(null);
    setErrors((prev) => ({ ...prev, photo: validatePhoto(null) }));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/portfolio/getall', { withCredentials: true });
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const generateUrl = () => {
    let baseUrl = "https://rndtechnosoft.com";
    if (parentCategoryId && !subCategoryId) {
      return `${baseUrl}/${slug}`;
    } else if (parentCategoryId && subCategoryId) {
      return `${baseUrl}/${slug}`;
    }
    return `${baseUrl}/${slug}`;
  };

  useEffect(() => {
    setUrl(generateUrl());
  }, [slug, parentCategoryId, subCategoryId]);

  useEffect(() => {
    setSlug(category
      .replace(/\s+/g, '-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
    );
  }, [category]);

  useEffect(() => {
    setSlug(slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
    );
  }, [slug]);

  const validateForm = () => {
    const newErrors = {
      category: validateCategory(category),
      photo: validatePhoto(photo),
      altText: validatePhotoAlt(altText),
      imgtitle: validatePhotoTitle(imgtitle),
      slug: validateSlug(slug),
      url: validateUrl(url),
      metatitle: validateMetaTitle(metatitle),
      metadescription: validateMetaDescription(metadescription),
      metakeywords: validateMetaKeywords(metakeywords),
      metalanguage: validateMetaLanguage(metalanguage),
      metacanonical: validateMetaCanonical(metacanonical),
      metaschema: validateMetaSchema(metaschema),
      otherMeta: validateOtherMeta(otherMeta),
      changeFreq: validateChangeFreq(changeFreq),
      priority: validatePriority(priority || "0"),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    try {
      let urls = '/api/portfolio/insertCategory';
      const formData = new FormData();
      formData.append('category', category);
      if (photo) {
        formData.append('photo', photo);
      }
      formData.append('alt', altText);
      formData.append('imgtitle', imgtitle);
      formData.append('slug', slug);
      formData.append('metatitle', metatitle);
      formData.append('metakeywords', metakeywords);
      formData.append('metadescription', metadescription);
      formData.append('metalanguage', metalanguage);
      formData.append('metacanonical', metacanonical);
      formData.append('metaschema', metaschema);
      formData.append('otherMeta', otherMeta);
      formData.append('url', url);
      formData.append('priority', priority || "0");
      formData.append('changeFreq', changeFreq);
      formData.append('status', status);

      if (parentCategoryId && !subCategoryId) {
        urls = `/api/portfolio/insertSubCategory?categoryId=${parentCategoryId}`;
      } else if (parentCategoryId && subCategoryId) {
        urls = `/api/portfolio/insertSubSubCategory?categoryId=${parentCategoryId}&subCategoryId=${subCategoryId}`;
      }

      const response = await axios.post(urls, formData, { withCredentials: true });
      toast.success("Category added successfully!");
      setCategory("");
      setPhoto(null);
      setAltText("");
      setImgtitle("");
      setParentCategoryId("");
      setSubCategoryId("");
      setSlug("");
      setStatus("active");
      setMetatitle("");
      setMetadescription("");
      setMetakeywords("");
      setMetalanguage("");
      setMetacanonical("");
      setMetaschema("");
      setOthermeta("");
      setUrl("");
      setPriority("0");
      setChangeFreq("");
      navigate('/PortfolioCategory');
    } catch (error) {
      const errorMessage = error.response?.data?.message || "The category already exists or an error occurred";
      toast.error(errorMessage);
    }
  };

  const renderCategoryOptions = (category) => (
    <option key={category._id} value={category._id}>
      {category.category}
    </option>
  );

  const handleParentCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setParentCategoryId(selectedCategoryId);
    setSubCategoryId("");
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategoryId = e.target.value;
    setSubCategoryId(selectedSubCategoryId);
  };

  const findCategoryById = (categories, id) => {
    for (const category of categories) {
      if (category._id === id) return category;
      if (category.subCategories) {
        const subCategory = findCategoryById(category.subCategories, id);
        if (subCategory) return subCategory;
      }
    }
    return null;
  };

  const findSubCategories = (categories, parentCategoryId) => {
    const parentCategory = findCategoryById(categories, parentCategoryId);
    return parentCategory ? parentCategory.subCategories : [];
  };

  const subCategories = findSubCategories(categories, parentCategoryId);

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Add Category</h1>
        <div className="mb-4">
          <label htmlFor="parentCategory" className="block font-semibold mb-2">
            Parent Category
          </label>
          <select
            id="parentCategory"
            value={parentCategoryId}
            onChange={handleParentCategoryChange}
            className="w-full p-2 border rounded focus:outline-none"
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
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.category}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="title" className="block font-semibold mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setErrors((prev) => ({ ...prev, category: validateCategory(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:outline-none ${errors.category ? 'border-red-500' : ''}`}
            required
          />
          <div className="text-sm text-gray-500 mt-1">
            {category.length}/50 characters
          </div>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>
        <div className="mb-8">
          <label htmlFor="photo" className="block font-semibold mb-2">Photo</label>
          <input
            type="file"
            name="photo"
            id="photo"
            onChange={handlePhotoChange}
            className={`border rounded focus:outline-none ${errors.photo ? 'border-red-500' : ''}`}
            accept="image/*"
          />
          {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
          {photo && (
            <div className="mt-2 relative group w-56">
              <img
                src={URL.createObjectURL(photo)}
                alt="Gallery"
                className="h-32 w-56 object-cover"
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
              >
                X
              </button>
              <div className="mb-4">
                <label htmlFor="alt" className="block font-semibold mb-2">Alternative Text</label>
                <input
                  type="text"
                  id="alt"
                  value={altText}
                  onChange={(e) => {
                    setAltText(e.target.value);
                    setErrors((prev) => ({ ...prev, altText: validatePhotoAlt(e.target.value) }));
                  }}
                  className={`w-full p-2 border rounded focus:outline-none ${errors.altText ? 'border-red-500' : ''}`}
                />
                <div className="text-sm text-gray-500 mt-1">
                  {altText.length}/100 characters
                </div>
                {errors.altText && <p className="text-red-500 text-sm mt-1">{errors.altText}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="imgtitle" className="block font-semibold mb-2">Image Title Text</label>
                <input
                  type="text"
                  id="imgtitle"
                  value={imgtitle}
                  onChange={(e) => {
                    setImgtitle(e.target.value);
                    setErrors((prev) => ({ ...prev, imgtitle: validatePhotoTitle(e.target.value) }));
                  }}
                  className={`w-full p-2 border rounded focus:outline-none ${errors.imgtitle ? 'border-red-500' : ''}`}
                />
                <div className="text-sm text-gray-500 mt-1">
                  {imgtitle.length}/100 characters
                </div>
                {errors.imgtitle && <p className="text-red-500 text-sm mt-1">{errors.imgtitle}</p>}
              </div>
            </div>
          )}
        </div>
        <div className="mb-4 mt-4">
          <label htmlFor="slug" className="block font-semibold mb-2">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setErrors((prev) => ({ ...prev, slug: validateSlug(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:outline-none ${errors.slug ? 'border-red-500' : ''}`}
          />
          <div className="text-sm text-gray-500 mt-1">
            {slug.length}/100 characters
          </div>
          {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
        </div>
        <div className="mb-4 mt-4">
          <label htmlFor="url" className="block font-semibold mb-2">
            URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            disabled
            className={`w-full p-2 border rounded focus:outline-none ${errors.url ? 'border-red-500' : ''}`}
          />
          {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="meta" className="block font-semibold mb-2">
            Meta Title
          </label>
          <textarea
            id="meta"
            value={metatitle}
            onChange={(e) => {
              setMetatitle(e.target.value);
              setErrors((prev) => ({ ...prev, metatitle: validateMetaTitle(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:outline-none ${errors.metatitle ? 'border-red-500' : ''}`}
            rows="3"
          ></textarea>
          <div className="text-sm text-gray-500 mt-1">
            {metatitle.length}/100 characters
          </div>
          {errors.metatitle && <p className="text-red-500 text-sm mt-1">{errors.metatitle}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="meta" className="block font-semibold mb-2">
            Meta Description
          </label>
          <textarea
            id="meta"
            value={metadescription}
            onChange={(e) => {
              setMetadescription(e.target.value);
              setErrors((prev) => ({ ...prev, metadescription: validateMetaDescription(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:outline-none ${errors.metadescription ? 'border-red-500' : ''}`}
            rows="3"
          ></textarea>
          <div className="text-sm text-gray-500 mt-1">
            {metadescription.length}/300 characters
          </div>
          {errors.metadescription && <p className="text-red-500 text-sm mt-1">{errors.metadescription}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="meta" className="block font-semibold mb-2">
            Meta Keywords
          </label>
          <textarea
            id="meta"
            value={metakeywords}
            onChange={(e) => {
              setMetakeywords(e.target.value);
              setErrors((prev) => ({ ...prev, metakeywords: validateMetaKeywords(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:outline-none ${errors.metakeywords ? 'border-red-500' : ''}`}
            rows="3"
          ></textarea>
          <div className="text-sm text-gray-500 mt-1">
            {metakeywords.length}/200 characters
          </div>
          {errors.metakeywords && <p className="text-red-500 text-sm mt-1">{errors.metakeywords}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="meta" className="block font-semibold mb-2">
            Meta Canonical
          </label>
          <textarea
            id="meta"
            value={metacanonical}
            onChange={(e) => {
              setMetacanonical(e.target.value);
              setErrors((prev) => ({ ...prev, metacanonical: validateMetaCanonical(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:outline-none ${errors.metacanonical ? 'border-red-500' : ''}`}
            rows="3"
          ></textarea>
          {errors.metacanonical && <p className="text-red-500 text-sm mt-1">{errors.metacanonical}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="meta" className="block font-semibold mb-2">
            Meta Language
          </label>
          <textarea
            id="meta"
            value={metalanguage}
            onChange={(e) => {
              setMetalanguage(e.target.value);
              setErrors((prev) => ({ ...prev, metalanguage: validateMetaLanguage(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:outline-none ${errors.metalanguage ? 'border-red-500' : ''}`}
            rows="3"
          ></textarea>
          {errors.metalanguage && <p className="text-red-500 text-sm mt-1">{errors.metalanguage}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="meta" className="block font-semibold mb-2">
            Other Meta
          </label>
          <textarea
            id="meta"
            value={otherMeta}
            onChange={(e) => {
              setOthermeta(e.target.value);
              setErrors((prev) => ({ ...prev, otherMeta: validateOtherMeta(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:outline-none ${errors.otherMeta ? 'border-red-500' : ''}`}
            rows="3"
          ></textarea>
          <div className="text-sm text-gray-500 mt-1">
            {otherMeta.length}/2000 characters
          </div>
          {errors.otherMeta && <p className="text-red-500 text-sm mt-1">{errors.otherMeta}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="meta" className="block font-semibold mb-2">
            Schema
          </label>
          <textarea
            id="meta"
            value={metaschema}
            onChange={(e) => {
              setMetaschema(e.target.value);
              setErrors((prev) => ({ ...prev, metaschema: validateMetaSchema(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:outline-none ${errors.metaschema ? 'border-red-500' : ''}`}
            rows="3"
          ></textarea>
          <div className="text-sm text-gray-500 mt-1">
            {metaschema.length}/2000 characters
          </div>
          {errors.metaschema && <p className="text-red-500 text-sm mt-1">{errors.metaschema}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="priority" className="block font-semibold mb-2">
            Priority
          </label>
          <input
            type="number"
            id="priority"
            min={0}
            max={1}
            step={0.01}
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setErrors((prev) => ({ ...prev, priority: validatePriority(e.target.value || "0") }));
            }}
            className={`w-full p-2 border rounded focus:outline-none ${errors.priority ? 'border-red-500' : ''}`}
          />
          {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="changeFreq" className="block font-semibold mb-2">
            Change Frequency
          </label>
          <select
            id="changeFreq"
            value={changeFreq}
            onChange={(e) => {
              setChangeFreq(e.target.value);
              setErrors((prev) => ({ ...prev, changeFreq: validateChangeFreq(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:outline-none ${errors.changeFreq ? 'border-red-500' : ''}`}
          >
            <option value="">Select Change Frequency</option>
            <option value="always">Always</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          {errors.changeFreq && <p className="text-red-500 text-sm mt-1">{errors.changeFreq}</p>}
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
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Add Category
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default NewCategoryForm;