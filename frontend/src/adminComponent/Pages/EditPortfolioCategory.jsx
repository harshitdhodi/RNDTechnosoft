import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
<<<<<<< HEAD
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  validateCategory, validatePhoto, validatePhotoAlt, validatePhotoTitle,
  validateSlug, validateMetaTitle, validateMetaDescription, validateMetaKeywords,
  validateMetaLanguage, validateMetaCanonical, validateMetaSchema, validateOtherMeta,
  validateUrl, validateChangeFreq, validatePriority
} from '../../utiles/validations'; // Assuming validation file is in the same directory
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

const EditCategory = () => {
  const { categoryId, subCategoryId, subSubCategoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState(null);
  const [altText, setAltText] = useState("");
  const [imgtitle, setImgtitle] = useState("");
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [slug, setSlug] = useState("");
  const [metatitle, setMetatitle] = useState("");
  const [metadescription, setMetadescription] = useState("");
  const [metakeywords, setMetakeywords] = useState("");
<<<<<<< HEAD
  const [metalanguage, setMetalanguage] = useState("");
  const [metacanonical, setMetacanonical] = useState("");
  const [metaschema, setMetaschema] = useState("");
  const [otherMeta, setOthermeta] = useState("");
  const [url, setUrl] = useState("");
  const [changeFreq, setChangeFreq] = useState("");
  const [priority, setPriority] = useState("0");
  const [status, setStatus] = useState("active");
  const [errors, setErrors] = useState({});
=======
  const [metalanguage, setMetalanguage] = useState("")
  const [metacanonical, setMetacanonical] = useState("")
  const [metaschema, setMetaschema] = useState("")
  const [otherMeta, setOthermeta] = useState("")
  const [url, setUrl] = useState()
  const [changeFreq, setChangeFreq] = useState()
  const [priority, setPriority] = useState(0)
  const [status, setStatus] = useState("active");
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

  useEffect(() => {
    const fetchData = async () => {
      let urls = "";

      if (categoryId && subCategoryId && subSubCategoryId) {
        urls = `/api/portfolio/getSpecificSubSubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}&subSubCategoryId=${subSubCategoryId}`;
      } else if (categoryId && subCategoryId) {
        urls = `/api/portfolio/getSpecificSubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}`;
      } else if (categoryId) {
        urls = `/api/portfolio/getSpecificCategory?categoryId=${categoryId}`;
      }

      try {
        const response = await axios.get(urls, { withCredentials: true });
<<<<<<< HEAD
        const { category, photo, alt, imgtitle, slug, metatitle, metadescription, metakeywords, metalanguage, metacanonical, metaschema, otherMeta, changeFreq, priority, status } = response.data;

        setCategory(category || "");
        setCurrentPhoto(photo || null);
        setAltText(alt || "");
        setImgtitle(imgtitle || "");
        setSlug(slug || "");
        setMetatitle(metatitle || "");
        setMetadescription(metadescription || "");
        setMetakeywords(metakeywords || "");
        setMetalanguage(metalanguage || "");
        setMetacanonical(metacanonical || "");
        setMetaschema(metaschema || "");
        setOthermeta(otherMeta || "");
        setChangeFreq(changeFreq || "");
        setPriority(priority !== undefined ? String(priority) : "0");
        setStatus(status || "active");

        // Initial validation
        setErrors({
          category: validateCategory(category || ""),
          photo: validatePhoto(null, photo || null),
          altText: validatePhotoAlt(alt || ""),
          imgtitle: validatePhotoTitle(imgtitle || ""),
          slug: validateSlug(slug || ""),
          url: validateUrl(url || ""),
          metatitle: validateMetaTitle(metatitle || ""),
          metadescription: validateMetaDescription(metadescription || ""),
          metakeywords: validateMetaKeywords(metakeywords || ""),
          metalanguage: validateMetaLanguage(metalanguage || ""),
          metacanonical: validateMetaCanonical(metacanonical || ""),
          metaschema: validateMetaSchema(metaschema || ""),
          otherMeta: validateOtherMeta(otherMeta || ""),
          changeFreq: validateChangeFreq(changeFreq || ""),
          priority: validatePriority(priority !== undefined ? String(priority) : "0"),
        });
      } catch (error) {
        toast.error("Failed to fetch category data");
=======
        const { category, photo, alt, imgtitle, slug, metatitle, metadescription, metakeywords, metalanguage, metacanonical, metaschema, otherMeta, changeFreq, priority } = response.data;

        setCategory(category);
        setCurrentPhoto(photo);
        setAltText(alt);
        setImgtitle(imgtitle)
        setSlug(slug);
        setStatus(status);

        setMetatitle(metatitle);
        setMetadescription(metadescription)
        setMetakeywords(metakeywords);
        setMetalanguage(metalanguage);
        setMetacanonical(metacanonical);
        setMetaschema(metaschema);
        setOthermeta(otherMeta);
        setChangeFreq(changeFreq)
        setPriority(priority)
      } catch (error) {
        console.error("Error fetching data:", error);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      }
    };

    fetchData();
  }, [categoryId, subCategoryId, subSubCategoryId]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
<<<<<<< HEAD
    setErrors((prev) => ({ ...prev, photo: validatePhoto(file, currentPhoto) }));
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  };

  const handleDeleteImage = () => {
    setPhoto(null);
<<<<<<< HEAD
    setCurrentPhoto(null);
    setAltText("");
    setImgtitle("");
    setErrors((prev) => ({
      ...prev,
      photo: validatePhoto(null, null),
      altText: validatePhotoAlt(""),
      imgtitle: validatePhotoTitle(""),
    }));
=======
    setCurrentPhoto(null)
    setAltText("");
    setImgtitle("");
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  };

  const generateUrl = () => {
    let baseUrl = "https://rndtechnosoft.com";
    if (categoryId && !subCategoryId) {
      return `${baseUrl}/${slug}`;
    } else if (categoryId && subCategoryId) {
      return `${baseUrl}/${slug}`;
    }
    return `${baseUrl}/${slug}`;
  };

  useEffect(() => {
    setUrl(generateUrl());
  }, [slug, categoryId, subCategoryId]);

<<<<<<< HEAD
  useEffect(() => {
    setSlug(category
      .replace(/\s+/g, '-')
=======
  // useEffect(() => {
  //   setSlug(category)
  // }, [category]);

  useEffect(() => {
    setSlug(category.replace(/\s+/g, '-')
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
    );
<<<<<<< HEAD
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
      photo: validatePhoto(photo, currentPhoto),
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
=======
  }, [category])

  useEffect(() => {
    setSlug(slug.toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
    );
  }, [slug])


  const handleSubmit = async (e) => {
    e.preventDefault();
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    let urls = "";
    const formData = new FormData();
    formData.append("category", category);
    formData.append("alt", altText);
    formData.append("imgtitle", imgtitle);
    formData.append('slug', slug);
    formData.append('metatitle', metatitle);
    formData.append('metakeywords', metakeywords);
    formData.append('metadescription', metadescription);
    formData.append('metalanguage', metalanguage);
    formData.append('metacanonical', metacanonical);
    formData.append('metaschema', metaschema);
    formData.append('otherMeta', otherMeta);
    formData.append('url', url);
    formData.append('changeFreq', changeFreq);
<<<<<<< HEAD
    formData.append('priority', priority || "0");
=======
    formData.append('priority', priority);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    formData.append('status', status);

    if (photo) {
      formData.append("photo", photo);
<<<<<<< HEAD
    } else if (currentPhoto) {
=======
    } else {
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      formData.append("photo", currentPhoto);
    }

    if (categoryId && subCategoryId && subSubCategoryId) {
      urls = `/api/portfolio/updatesubsubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}&subSubCategoryId=${subSubCategoryId}`;
    } else if (categoryId && subCategoryId) {
      urls = `/api/portfolio/updateSubCategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}`;
    } else if (categoryId) {
      urls = `/api/portfolio/updateCategory?categoryId=${categoryId}`;
    }

    try {
      await axios.put(urls, formData, { withCredentials: true });
<<<<<<< HEAD
      toast.success("Category updated successfully!");
      navigate("/PortfolioCategory");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update category";
      toast.error(errorMessage);
=======
      navigate("/PortfolioCategory");
    } catch (error) {
      console.error("Error updating data:", error);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    }
  };

  return (
<<<<<<< HEAD
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit Category</h1>
        <div className="mb-4">
          <label htmlFor="category" className="block font-semibold mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="category"
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
          {(photo || currentPhoto) && (
            <div className="mt-2 w-56 relative group">
              <img
                src={photo ? URL.createObjectURL(photo) : `/api/logo/download/${currentPhoto}`}
                alt={altText}
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
          Update Category
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditCategory;
=======
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit Category</h1>
      <div className="mb-4">
        <label htmlFor="category" className="block font-semibold mb-2">
          Category
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
      <div className="mb-8">
        <label htmlFor="photo" className="block font-semibold mb-2">Photo</label>
        <input
          type="file"
          name="photo"
          id="photo"
          onChange={handlePhotoChange}
          className="border rounded focus:outline-none"
          accept="image/*"
        />
        {(photo || currentPhoto) && (
          <div className="mt-2 w-56 relative group">
            <img
              src={photo ? URL.createObjectURL(photo) : `/api/logo/download/${currentPhoto}`}
              alt={altText}
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
                onChange={(e) => setAltText(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="imgtitle" className="block font-semibold mb-2">Image Title Text</label>
              <input
                type="text"
                id="imgtitle"
                value={imgtitle}
                onChange={(e) => setImgtitle(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none"
                required
              />
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
          onChange={(e) => setSlug(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        />
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
          className="w-full p-2 border rounded focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="meta" className="block font-semibold mb-2">
          Meta Title
        </label>
        <textarea
          id="meta"
          value={metatitle}
          onChange={(e) => setMetatitle(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          rows="3"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="meta" className="block font-semibold mb-2">
          Meta Description
        </label>
        <textarea
          id="meta"
          value={metadescription}
          onChange={(e) => setMetadescription(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          rows="3"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="meta" className="block font-semibold mb-2">
          Meta Keywords
        </label>
        <textarea
          id="meta"
          value={metakeywords}
          onChange={(e) => setMetakeywords(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          rows="3"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="meta" className="block font-semibold mb-2">
          Meta Canonical
        </label>
        <textarea
          id="meta"
          value={metacanonical}
          onChange={(e) => setMetacanonical(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          rows="3"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="meta" className="block font-semibold mb-2">
          Meta Language
        </label>
        <textarea
          id="meta"
          value={metalanguage}
          onChange={(e) => setMetalanguage(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          rows="3"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="meta" className="block font-semibold mb-2">
          Other Meta
        </label>
        <textarea
          id="meta"
          value={otherMeta}
          onChange={(e) => setOthermeta(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          rows="3"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="meta" className="block font-semibold mb-2">
          Schema
        </label>
        <textarea
          id="meta"
          value={metaschema}
          onChange={(e) => setMetaschema(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          rows="3"
        ></textarea>
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
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="changeFreq" className="block font-semibold mb-2">
          Change Frequency
        </label>
        <select
          id="changeFreq"
          value={changeFreq}
          onChange={(e) => setChangeFreq(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        >
          <option value="">Select Change Frequency</option>
          <option value="always">Always</option>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
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
        Update Category
      </button>
    </form>
  );
};

export default EditCategory;
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
