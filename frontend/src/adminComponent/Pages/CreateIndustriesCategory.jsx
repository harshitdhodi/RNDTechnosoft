import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  validateCategory,
  validateFile,
  validatePhotoAlt,
  validatePhotoTitle,
  validateSlug,
  validateMetaTitle,
  validateMetaDescription,
  validateMetaKeywords,
  validateMetaLanguage,
  validateMetaCanonical,
  validateMetaSchema,
  validateOtherMeta,
  validateUrl,
  validatePriority,
  validateChangeFreq
} from '../../utiles/validations';

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

  // Character limit configuration
  const CHAR_LIMITS = {
    category: 50,
    altText: 100,
    imgtitle: 100,
    slug: 100,
    metatitle: 100,
    metadescription: 300,
    metakeywords: 200,
    metalanguage: 5,
    metacanonical: 200,
    metaschema: 2000,
    otherMeta: 2000
  };

  // Get plain text length for textareas
  const getPlainTextLength = (value) => {
    if (!value) return 0;
    const div = document.createElement('div');
    div.innerHTML = value;
    return div.textContent.trim().length;
  };

  // Render character count
  const renderCharCount = (value, field) => {
    const length = field.includes('meta') ? getPlainTextLength(value) : value.length;
    const max = CHAR_LIMITS[field];
    return (
      <div className="text-sm text-gray-500 mt-1">
        {length}/{max} characters
        {length > 0 && length < (CHAR_LIMITS[field] / 10) && ` (minimum ${CHAR_LIMITS[field] / 10})`}
      </div>
    );
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const error = validateFile(file, false); // Photo is optional
    setErrors((prev) => ({ ...prev, photo: error }));
    if (!error) {
      setPhoto(file);
    } else {
      setPhoto(null);
      toast.error(error);
    }
  };

  const handleDeleteImage = () => {
    setPhoto(null);
    setErrors((prev) => ({ ...prev, photo: "" }));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/industries/getall', { withCredentials: true });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories: " + (error.response?.data?.message || error.message));
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
    const generatedSlug = category
      .replace(/\s+/g, '-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    setSlug(generatedSlug);
  }, [category]);

  useEffect(() => {
    const cleanedSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    setSlug(cleanedSlug);
    const error = validateSlug(cleanedSlug);
    setErrors((prev) => ({ ...prev, slug: error }));
  }, [slug]);

  const validateForm = () => {
    const newErrors = {
      category: validateCategory(category),
      photo: validateFile(photo, false), // Photo is optional
      altText: validatePhotoAlt(altText),
      imgtitle: validatePhotoTitle(imgtitle),
      slug: validateSlug(slug),
      metatitle: validateMetaTitle(metatitle),
      metadescription: validateMetaDescription(metadescription),
      metakeywords: validateMetaKeywords(metakeywords),
      metalanguage: validateMetaLanguage(metalanguage),
      metacanonical: validateMetaCanonical(metacanonical),
      metaschema: validateMetaSchema(metaschema),
      otherMeta: validateOtherMeta(otherMeta),
      url: validateUrl(url),
      priority: validatePriority(priority),
      changeFreq: validateChangeFreq(changeFreq)
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    try {
      let url = '/api/industries/insertCategory';
      const formData = new FormData();
      formData.append('category', category.trim());
      if (photo) {
        formData.append('photo', photo);
      }
      formData.append('alt', altText.trim());
      formData.append('imgtitle', imgtitle.trim());
      formData.append('slug', slug.trim());
      formData.append('metatitle', metatitle.trim());
      formData.append('metakeywords', metakeywords.trim());
      formData.append('metadescription', metadescription.trim());
      formData.append('metalanguage', metalanguage.trim());
      formData.append('metacanonical', metacanonical.trim());
      formData.append('metaschema', metaschema.trim());
      formData.append('otherMeta', otherMeta.trim());
      formData.append('url', url.trim());
      formData.append('priority', priority);
      formData.append('changeFreq', changeFreq);
      formData.append('status', status);

      if (parentCategoryId && !subCategoryId) {
        url = `/api/industries/insertSubCategory?categoryId=${parentCategoryId}`;
      } else if (parentCategoryId && subCategoryId) {
        url = `/api/industries/insertSubSubCategory?categoryId=${parentCategoryId}&subCategoryId=${subCategoryId}`;
      }

      const response = await axios.post(url, formData, { 
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(
        parentCategoryId && subCategoryId 
          ? "Sub-subcategory added successfully!" 
          : parentCategoryId 
            ? "Subcategory added successfully!" 
            : "Category added successfully!"
      );

      setCategory("");
      setPhoto(null);
      setAltText("");
      setImgtitle("");
      setParentCategoryId("");
      setSubCategoryId("");
      setSlug("");
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
      setStatus("active");
      setErrors({});

      navigate('/IndustriesCategory');
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(
        parentCategoryId && subCategoryId 
          ? `Failed to add sub-subcategory: ${errorMessage}`
          : parentCategoryId 
            ? `Failed to add subcategory: ${errorMessage}`
            : `Failed to add category: ${errorMessage}`
      );
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center mb-6">
        Add Category
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="parentCategory" className="block font-semibold mb-2 font-serif">
            Parent Category
          </label>
          <select
            id="parentCategory"
            value={parentCategoryId}
            onChange={handleParentCategoryChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          >
            <option value="">Select Parent Category</option>
            {categories.map(renderCategoryOptions)}
          </select>
        </div>
        {subCategories.length > 0 && (
          <div>
            <label htmlFor="subCategory" className="block font-semibold mb-2 font-serif">
              Subcategory (optional)
            </label>
            <select
              id="subCategory"
              value={subCategoryId}
              onChange={handleSubCategoryChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
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
        <div>
          <label htmlFor="title" className="block font-semibold mb-2 font-serif">
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
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            required />
          {renderCharCount(category, 'category')}
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>
        <div>
          <label htmlFor="photo" className="block font-semibold mb-2 font-serif">
            Photo
          </label>
          <input
            type="file"
            name="photo"
            id="photo"
            onChange={handlePhotoChange}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.photo ? 'border-red-500' : 'border-gray-300'}`}
            accept="image/jpeg,image/png" />
          {photo && (
            <div className="mt-2 relative group w-56">
              <img
                src={URL.createObjectURL(photo)}
                alt={altText || "Preview"}
                className="h-32 w-56 object-cover rounded-md" />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex items-center justify-center hover:bg-red-600 focus:ring-2 focus:ring-red-500"
              >
                X
              </button>
            </div>
          )}
          {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
        </div>
        <div>
          <label htmlFor="alt" className="block font-semibold mb-2 font-serif">
            Alternative Text
          </label>
          <input
            type="text"
            id="alt"
            value={altText}
            onChange={(e) => {
              setAltText(e.target.value);
              setErrors((prev) => ({ ...prev, altText: validatePhotoAlt(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.altText ? 'border-red-500' : 'border-gray-300'}`} />
          {renderCharCount(altText, 'altText')}
          {errors.altText && <p className="text-red-500 text-sm mt-1">{errors.altText}</p>}
        </div>
        <div>
          <label htmlFor="imgtitle" className="block font-semibold mb-2 font-serif">
            Image Title
          </label>
          <input
            type="text"
            id="imgtitle"
            value={imgtitle}
            onChange={(e) => {
              setImgtitle(e.target.value);
              setErrors((prev) => ({ ...prev, imgtitle: validatePhotoTitle(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.imgtitle ? 'border-red-500' : 'border-gray-300'}`} />
          {renderCharCount(imgtitle, 'imgtitle')}
          {errors.imgtitle && <p className="text-red-500 text-sm mt-1">{errors.imgtitle}</p>}
        </div>
        <div>
          <label htmlFor="slug" className="block font-semibold mb-2 font-serif">
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
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.slug ? 'border-red-500' : 'border-gray-300'}`} />
          {renderCharCount(slug, 'slug')}
          {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
        </div>
        <div>
          <label htmlFor="url" className="block font-semibold mb-2 font-serif">
            URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            disabled
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed" />
          {renderCharCount(url, 'url')}
          {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
        </div>
        <div>
          <label htmlFor="metatitle" className="block font-semibold mb-2 font-serif">
            Meta Title
          </label>
          <textarea
            id="metatitle"
            value={metatitle}
            onChange={(e) => {
              setMetatitle(e.target.value);
              setErrors((prev) => ({ ...prev, metatitle: validateMetaTitle(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.metatitle ? 'border-red-500' : 'border-gray-300'}`}
            rows="3"
          ></textarea>
          {renderCharCount(metatitle, 'metatitle')}
          {errors.metatitle && <p className="text-red-500 text-sm mt-1">{errors.metatitle}</p>}
        </div>
        <div>
          <label htmlFor="metadescription" className="block font-semibold mb-2 font-serif">
            Meta Description
          </label>
          <textarea
            id="metadescription"
            value={metadescription}
            onChange={(e) => {
              setMetadescription(e.target.value);
              setErrors((prev) => ({ ...prev, metadescription: validateMetaDescription(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.metadescription ? 'border-red-500' : 'border-gray-300'}`}
            rows="3"
          ></textarea>
          {renderCharCount(metadescription, 'metadescription')}
          {errors.metadescription && <p className="text-red-500 text-sm mt-1">{errors.metadescription}</p>}
        </div>
        <div>
          <label htmlFor="metakeywords" className="block font-semibold mb-2 font-serif">
            Meta Keywords
          </label>
          <textarea
            id="metakeywords"
            value={metakeywords}
            onChange={(e) => {
              setMetakeywords(e.target.value);
              setErrors((prev) => ({ ...prev, metakeywords: validateMetaKeywords(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.metakeywords ? 'border-red-500' : 'border-gray-300'}`}
            rows="3"
          ></textarea>
          {renderCharCount(metakeywords, 'metakeywords')}
          {errors.metakeywords && <p className="text-red-500 text-sm mt-1">{errors.metakeywords}</p>}
        </div>
        <div>
          <label htmlFor="metacanonical" className="block font-semibold mb-2 font-serif">
            Meta Canonical
          </label>
          <textarea
            id="metacanonical"
            value={metacanonical}
            onChange={(e) => {
              setMetacanonical(e.target.value);
              setErrors((prev) => ({ ...prev, metacanonical: validateMetaCanonical(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.metacanonical ? 'border-red-500' : 'border-gray-300'}`}
            rows="3"
          ></textarea>
          {renderCharCount(metacanonical, 'metacanonical')}
          {errors.metacanonical && <p className="text-red-500 text-sm mt-1">{errors.metacanonical}</p>}
        </div>
        <div>
          <label htmlFor="metalanguage" className="block font-semibold mb-2 font-serif">
            Meta Language
          </label>
          <textarea
            id="metalanguage"
            value={metalanguage}
            onChange={(e) => {
              setMetalanguage(e.target.value);
              setErrors((prev) => ({ ...prev, metalanguage: validateMetaLanguage(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.metalanguage ? 'border-red-500' : 'border-gray-300'}`}
            rows="3"
          ></textarea>
          {renderCharCount(metalanguage, 'metalanguage')}
          {errors.metalanguage && <p className="text-red-500 text-sm mt-1">{errors.metalanguage}</p>}
        </div>
        <div>
          <label htmlFor="metaschema" className="block font-semibold mb-2 font-serif">
            Meta Schema
          </label>
          <textarea
            id="metaschema"
            value={metaschema}
            onChange={(e) => {
              setMetaschema(e.target.value);
              setErrors((prev) => ({ ...prev, metaschema: validateMetaSchema(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.metaschema ? 'border-red-500' : 'border-gray-300'}`}
            rows="3"
          ></textarea>
          {renderCharCount(metaschema, 'metaschema')}
          {errors.metaschema && <p className="text-red-500 text-sm mt-1">{errors.metaschema}</p>}
        </div>
        <div>
          <label htmlFor="otherMeta" className="block font-semibold mb-2 font-serif">
            Other Meta
          </label>
          <textarea
            id="otherMeta"
            value={otherMeta}
            onChange={(e) => {
              setOthermeta(e.target.value);
              setErrors((prev) => ({ ...prev, otherMeta: validateOtherMeta(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.otherMeta ? 'border-red-500' : 'border-gray-300'}`}
            rows="3"
          ></textarea>
          {renderCharCount(otherMeta, 'otherMeta')}
          {errors.otherMeta && <p className="text-red-500 text-sm mt-1">{errors.otherMeta}</p>}
        </div>
        <div>
          <label htmlFor="priority" className="block font-semibold mb-2 font-serif">
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
              setErrors((prev) => ({ ...prev, priority: validatePriority(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.priority ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
        </div>
        <div>
          <label htmlFor="changeFreq" className="block font-semibold mb-2 font-serif">
            Change Frequency
          </label>
          <select
            id="changeFreq"
            value={changeFreq}
            onChange={(e) => {
              setChangeFreq(e.target.value);
              setErrors((prev) => ({ ...prev, changeFreq: validateChangeFreq(e.target.value) }));
            }}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.changeFreq ? 'border-red-500' : 'border-gray-300'}`}
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
        <div>
          <label htmlFor="status" className="block font-semibold mb-2 font-serif">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default NewCategoryForm;