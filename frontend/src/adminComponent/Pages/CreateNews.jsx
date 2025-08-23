import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  validateTitle,
  validateDetails,
  validatePhotos,
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
  validateChangeFreq,
  validatePriority,
  validatePostedBy,
  validateDate,
  validateCategoryId,
} from "../../utiles/validations";

const NewNewsForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const [imgTitles, setImgTitles] = useState([]);
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("active");
  const [slug, setSlug] = useState("");
  const [metatitle, setMetatitle] = useState("");
  const [metadescription, setMetadescription] = useState("");
  const [metakeywords, setMetakeywords] = useState("");
  const [metalanguage, setMetalanguage] = useState("");
  const [metacanonical, setMetacanonical] = useState("");
  const [metaschema, setMetaschema] = useState("");
  const [otherMeta, setOtherMeta] = useState("");
  const [url, setUrl] = useState("");
  const [priority, setPriority] = useState("");
  const [changeFreq, setChangeFreq] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subSubCategoryId, setSubSubCategoryId] = useState("");
  const [errors, setErrors] = useState({});

  const modules = {
    toolbar: [
      [{ font: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image", "video"],
      [{ direction: "rtl" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["clean"],
    ],
    clipboard: { matchVisual: false },
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/news/getall", { withCredentials: true });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      const statusCode = error.response?.status ? `(${error.response.status})` : '';
      const message = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to fetch categories: ${message} ${statusCode}`);
    }
  };

  useEffect(() => { 
    const generatedSlug = title
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
    setSlug(generatedSlug);
    setErrors(prev => ({ ...prev, slug: validateSlug(generatedSlug) }));
  }, [title]);

  useEffect(() => {
    setUrl(slug ? `https://rndtechnosoft.com/${slug}` : "");
    setErrors(prev => ({ ...prev, url: validateUrl(slug ? `https://rndtechnosoft.com/${slug}` : "") }));
  }, [slug]);

  const handlePhotoChange = (e) => {
    const newPhotos = Array.from(e.target.files);
    const validImageTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const invalidFiles = newPhotos.filter(file => 
      !validImageTypes.includes(file.type) || file.size > maxSize
    );

    if (invalidFiles.length > 0) {
      toast.error("Invalid images: Only JPEG/PNG up to 5MB allowed");
      return;
    }

    if (photos.length + newPhotos.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const updatedPhotos = [...photos, ...newPhotos];
    const updatedAlts = [...photoAlts, ...Array(newPhotos.length).fill("")];
    const updatedTitles = [...imgTitles, ...Array(newPhotos.length).fill("")];
    setPhotos(updatedPhotos);
    setPhotoAlts(updatedAlts);
    setImgTitles(updatedTitles);
    setErrors(prev => ({
      ...prev,
      photos: validatePhotos(updatedPhotos),
      photoAlts: updatedPhotos.map((_, i) => validatePhotoAlt(updatedAlts[i] || "")),
      imgTitles: updatedPhotos.map((_, i) => validatePhotoTitle(updatedTitles[i] || "")),
    }));
  };

  const handleDeleteImage = (index) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    const updatedAlts = photoAlts.filter((_, i) => i !== index);
    const updatedTitles = imgTitles.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    setPhotoAlts(updatedAlts);
    setImgTitles(updatedTitles);
    setErrors(prev => ({
      ...prev,
      photos: validatePhotos(updatedPhotos),
      photoAlts: updatedPhotos.map((_, i) => validatePhotoAlt(updatedAlts[i] || "")),
      imgTitles: updatedPhotos.map((_, i) => validatePhotoTitle(updatedTitles[i] || "")),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      title: validateTitle(title.trim()),
      details: validateDetails(details.trim()),
      photos: validatePhotos(photos),
      photoAlts: photos.map((_, i) => validatePhotoAlt((photoAlts[i] || "").trim())),
      imgTitles: photos.map((_, i) => validatePhotoTitle((imgTitles[i] || "").trim())),
      postedBy: validatePostedBy(postedBy.trim()),
      date: validateDate(date),
      parentCategoryId: validateCategoryId(parentCategoryId),
      subCategoryId: validateCategoryId(subCategoryId),
      subSubCategoryId: validateCategoryId(subSubCategoryId),
      slug: validateSlug(slug.trim()),
      metatitle: validateMetaTitle(metatitle.trim()),
      metadescription: validateMetaDescription(metadescription.trim()),
      metakeywords: validateMetaKeywords(metakeywords.trim()),
      metalanguage: validateMetaLanguage(metalanguage.trim()),
      metacanonical: validateMetaCanonical(metacanonical.trim()),
      metaschema: validateMetaSchema(metaschema.trim()),
      otherMeta: validateOtherMeta(otherMeta.trim()),
      url: validateUrl(url),
      changeFreq: validateChangeFreq(changeFreq),
      priority: validatePriority(priority),
    };

    setErrors(newErrors);

    if (
      newErrors.title ||
      newErrors.details ||
      newErrors.postedBy ||
      newErrors.date ||
      newErrors.parentCategoryId ||
      newErrors.photoAlts.some(e => e) ||
      newErrors.imgTitles.some(e => e)
    ) {
      toast.error("Please correct the errors in the form");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("details", details.trim());
    photos.forEach((photo, index) => {
      formData.append("photo", photo);
      formData.append("alt", (photoAlts[index] || "").trim());
      formData.append("imgtitle", (imgTitles[index] || "").trim());
    });
    formData.append("postedBy", postedBy.trim());
    formData.append("date", date);
    formData.append("status", status);
    formData.append("categories", parentCategoryId);
    formData.append("subcategories", subCategoryId || "");
    formData.append("subSubcategories", subSubCategoryId || "");
    formData.append("slug", slug.trim());
    formData.append("metatitle", metatitle.trim());
    formData.append("metadescription", metadescription.trim());
    formData.append("metakeywords", metakeywords.trim());
    formData.append("metalanguage", metalanguage.trim());
    formData.append("metacanonical", metacanonical.trim());
    formData.append("metaschema", metaschema.trim());
    formData.append("otherMeta", otherMeta.trim());
    formData.append("url", url);
    formData.append("priority", priority);
    formData.append("changeFreq", changeFreq);

    try {
      await axios.post("/api/news/insertNews", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("News added successfully!");
      setTitle("");
      setDetails("");
      setPhotos([]);
      setPhotoAlts([]);
      setImgTitles([]);
      setDate("");
      setStatus("active");
      setSlug("");
      setMetatitle("");
      setMetadescription("");
      setMetakeywords("");
      setMetalanguage("");
      setMetacanonical("");
      setMetaschema("");
      setOtherMeta("");
      setUrl("");
      setPriority("");
      setChangeFreq("");
      setPostedBy("");
      setParentCategoryId("");
      setSubCategoryId("");
      setSubSubCategoryId("");
      setErrors({});
      navigate("/News");
    } catch (error) {
      console.error("Error adding news:", error);
      const statusCode = error.response?.status ? `(${error.response.status})` : '';
      const message = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to add news: ${message} ${statusCode}`);
    }
  };

  const getSubCategories = (categoryId) => {
    const category = categories.find((cat) => cat.slug === categoryId);
    return category?.subCategories || [];
  };

  const getSubSubCategories = (categoryId, subCategoryId) => {
    const category = categories.find((cat) => cat.slug === categoryId);
    const subCategory = category?.subCategories.find((sub) => sub.slug === subCategoryId);
    return subCategory?.subSubCategories || [];
  };

  return (
    <><form onSubmit={handleSubmit} className="p-4">
      <ToastContainer />
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center mb-6">Add News</h1>

      <div className="mb-4">
        <label htmlFor="parentCategory" className="block font-semibold mb-2">
          Parent Category <span className="text-red-500">*</span>
        </label>
        <select
          id="parentCategory"
          value={parentCategoryId}
          onChange={(e) => {
            const value = e.target.value;
            setParentCategoryId(value);
            setSubCategoryId("");
            setSubSubCategoryId("");
            setErrors(prev => ({ ...prev, parentCategoryId: validateCategoryId(value), subCategoryId: "", subSubCategoryId: "" }));
          } }
          className={`w-full p-2 border rounded focus:outline-none ${errors.parentCategoryId ? "border-red-500" : ""}`}
          required
        >
          <option value="">Select Parent Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug}>
              {cat.category}
            </option>
          ))}
        </select>
        {errors.parentCategoryId && <p className="text-red-500 text-sm mt-1">{errors.parentCategoryId}</p>}
      </div>

      {getSubCategories(parentCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="subCategory" className="block font-semibold mb-2">Subcategory (optional)</label>
          <select
            id="subCategory"
            value={subCategoryId}
            onChange={(e) => {
              const value = e.target.value;
              setSubCategoryId(value);
              setSubSubCategoryId("");
              setErrors(prev => ({ ...prev, subCategoryId: validateCategoryId(value), subSubCategoryId: "" }));
            } }
            className={`w-full p-2 border rounded focus:outline-none ${errors.subCategoryId ? "border-red-500" : ""}`}
          >
            <option value="">Select Subcategory</option>
            {getSubCategories(parentCategoryId).map((sub) => (
              <option key={sub._id} value={sub.slug}>
                {sub.category}
              </option>
            ))}
          </select>
          {errors.subCategoryId && <p className="text-red-500 text-sm mt-1">{errors.subCategoryId}</p>}
        </div>
      )}

      {getSubSubCategories(parentCategoryId, subCategoryId).length > 0 && (
        <div className="mb-4">
          <label htmlFor="subSubCategory" className="block font-semibold mb-2">Sub-Subcategory (optional)</label>
          <select
            id="subSubCategory"
            value={subSubCategoryId}
            onChange={(e) => {
              const value = e.target.value;
              setSubSubCategoryId(value);
              setErrors(prev => ({ ...prev, subSubCategoryId: validateCategoryId(value) }));
            } }
            className={`w-full p-2 border rounded focus:outline-none ${errors.subSubCategoryId ? "border-red-500" : ""}`}
          >
            <option value="">Select Sub-Subcategory</option>
            {getSubSubCategories(parentCategoryId, subCategoryId).map((subSub) => (
              <option key={subSub._id} value={subSub.slug}>
                {subSub.category}
              </option>
            ))}
          </select>
          {errors.subSubCategoryId && <p className="text-red-500 text-sm mt-1">{errors.subSubCategoryId}</p>}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block font-semibold mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            const value = e.target.value;
            setTitle(value);
            setErrors(prev => ({ ...prev, title: validateTitle(value.trim()) }));
          } }
          className={`w-full p-2 border rounded focus:outline-none ${errors.title ? "border-red-500" : ""}`}
          placeholder="Enter news title (10-100 characters)"
          required
          maxLength={100} />
        <p className="text-sm text-gray-500 mt-1">{title.length}/100 characters</p>
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div className="mb-8">
        <label htmlFor="details" className="block font-semibold mb-2">Description <span className="text-red-500">*</span></label>
        <ReactQuill
          value={details}
          onChange={(value) => {
            setDetails(value);
            setErrors(prev => ({ ...prev, details: validateDetails(value.trim()) }));
          } }
          modules={modules}
          className="quill"
          style={{ height: '400px', marginBottom: '50px' }}
          placeholder="Enter news description (50-1000 characters)" />
        <p className="text-sm text-gray-500 mt-1">{details.replace(/<[^>]+>/g, '').length}/1000 characters</p>
        {errors.details && <p className="text-red-500 text-sm mt-1">{errors.details}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="photos" className="block font-semibold mb-2">Photos (Max 5, JPEG/PNG, 5MB each)</label>
        <input
          type="file"
          id="photos"
          multiple
          onChange={handlePhotoChange}
          accept="image/jpeg,image/png"
          className={`p-2 border rounded focus:outline-none ${errors.photos ? "border-red-500" : ""}`} />
        {errors.photos && <p className="text-red-500 text-sm mt-1">{errors.photos}</p>}
        {photos.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative w-56">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={photoAlts[index] || ""}
                  className="h-32 w-56 object-cover rounded" />
                <label htmlFor={`alt-${index}`} className="block mt-2">
                  Alternative Text:
                  <input
                    type="text"
                    id={`alt-${index}`}
                    value={photoAlts[index] || ""}
                    onChange={(e) => {
                      const newPhotoAlts = [...photoAlts];
                      newPhotoAlts[index] = e.target.value;
                      setPhotoAlts(newPhotoAlts);
                      setErrors(prev => ({
                        ...prev,
                        photoAlts: photos.map((_, i) => validatePhotoAlt((newPhotoAlts[i] || "").trim())),
                      }));
                    } }
                    className={`w-full p-2 border rounded focus:outline-none ${errors.photoAlts?.[index] ? "border-red-500" : ""}`}
                    placeholder="Describe the image"
                    maxLength={100} />
                  {errors.photoAlts?.[index] && <p className="text-red-500 text-sm mt-1">{errors.photoAlts[index]}</p>}
                </label>
                <label htmlFor={`imgtitle-${index}`} className="block mt-2">
                  Image Title Text:
                  <input
                    type="text"
                    id={`imgtitle-${index}`}
                    value={imgTitles[index] || ""}
                    onChange={(e) => {
                      const newImgTitles = [...imgTitles];
                      newImgTitles[index] = e.target.value;
                      setImgTitles(newImgTitles);
                      setErrors(prev => ({
                        ...prev,
                        imgTitles: photos.map((_, i) => validatePhotoTitle((newImgTitles[i] || "").trim())),
                      }));
                    } }
                    className={`w-full p-2 border rounded focus:outline-none ${errors.imgTitles?.[index] ? "border-red-500" : ""}`}
                    placeholder="Enter image title"
                    maxLength={100} />
                  {errors.imgTitles?.[index] && <p className="text-red-500 text-sm mt-1">{errors.imgTitles[index]}</p>}
                </label>
                <button
                  type="button"
                  className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex items-center justify-center hover:bg-red-600"
                  onClick={() => handleDeleteImage(index)}
                >
                  <span className="text-xs">X</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="postedBy" className="block font-semibold mb-2">
          Posted By <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="postedBy"
          value={postedBy}
          onChange={(e) => {
            const value = e.target.value;
            setPostedBy(value);
            setErrors(prev => ({ ...prev, postedBy: validatePostedBy(value.trim()) }));
          } }
          className={`w-full p-2 border rounded focus:outline-none ${errors.postedBy ? "border-red-500" : ""}`}
          placeholder="Enter author's name"
          required
          maxLength={50} />
        {errors.postedBy && <p className="text-red-500 text-sm mt-1">{errors.postedBy}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="date" className="block font-semibold mb-2">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => {
            const value = e.target.value;
            setDate(value);
            setErrors(prev => ({ ...prev, date: validateDate(value) }));
          } }
          className={`w-full p-2 border rounded focus:outline-none ${errors.date ? "border-red-500" : ""}`}
          max={new Date().toISOString().split('T')[0]}
          required />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="slug" className="block font-semibold mb-2">Slug <span className="text-red-500">*</span></label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => {
            const value = e.target.value;
            setSlug(value);
            setErrors(prev => ({ ...prev, slug: validateSlug(value.trim()) }));
          } }
          className={`w-full p-2 border rounded focus:outline-none ${errors.slug ? "border-red-500" : ""}`}
          placeholder="Enter URL-friendly slug"
          maxLength={100}
          required />
        {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="url" className="block font-semibold mb-2">URL</label>
        <input
          type="text"
          id="url"
          value={url}
          disabled
          className={`w-full p-2 border rounded focus:outline-none bg-gray-100 ${errors.url ? "border-red-500" : ""}`}
          placeholder="Generated URL" />
        {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="metatitle" className="block font-semibold mb-2">Meta Title</label>
        <textarea
          id="metatitle"
          value={metatitle}
          onChange={(e) => {
            const value = e.target.value;
            setMetatitle(value);
            setErrors(prev => ({ ...prev, metatitle: validateMetaTitle(value.trim()) }));
          } }
          className={`w-full p-2 border rounded focus:outline-none ${errors.metatitle ? "border-red-500" : ""}`}
          rows="3"
          placeholder="Enter meta title for SEO (max 70 characters)"
          maxLength={70}
        ></textarea>
        {errors.metatitle && <p className="text-red-500 text-sm mt-1">{errors.metatitle}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="metadescription" className="block font-semibold mb-2">Meta Description</label>
        <textarea
          id="metadescription"
          value={metadescription}
          onChange={(e) => {
            const value = e.target.value;
            setMetadescription(value);
            setErrors(prev => ({ ...prev, metadescription: validateMetaDescription(value.trim()) }));
          } }
          className={`w-full p-2 border rounded focus:outline-none ${errors.metadescription ? "border-red-500" : ""}`}
          rows="3"
          placeholder="Enter meta description for SEO (max 160 characters)"
          maxLength={160}
        ></textarea>
        {errors.metadescription && <p className="text-red-500 text-sm mt-1">{errors.metadescription}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="metakeywords" className="block font-semibold mb-2">Meta Keywords</label>
        <textarea
          id="metakeywords"
          value={metakeywords}
          onChange={(e) => {
            const value = e.target.value;
            setMetakeywords(value);
            setErrors(prev => ({ ...prev, metakeywords: validateMetaKeywords(value.trim()) }));
          } }
          className={`w-full p-2 border rounded focus:outline-none ${errors.metakeywords ? "border-red-500" : ""}`}
          rows="3"
          placeholder="Enter comma-separated keywords (max 200 characters)"
          maxLength={200}
        ></textarea>
        {errors.metakeywords && <p className="text-red-500 text-sm mt-1">{errors.metakeywords}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="metalanguage" className="block font-semibold mb-2">Meta Language</label>
        <textarea
          id="metalanguage"
          value={metalanguage}
          onChange={(e) => {
            const value = e.target.value;
            setMetalanguage(value);
            setErrors(prev => ({ ...prev, metalanguage: validateMetaLanguage(value.trim()) }));
          } }
          className={`w-full p-2 border rounded focus:outline-none ${errors.metalanguage ? "border-red-500" : ""}`}
          rows="3"
          placeholder="Enter language code (e.g., en-US, max 5 characters)"
          maxLength={5}
        ></textarea>
        {errors.metalanguage && <p className="text-red-500 text-sm mt-1">{errors.metalanguage}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="metacanonical" className="block font-semibold mb-2">Meta Canonical</label>
        <textarea
          id="metacanonical"
          value={metacanonical}
          onChange={(e) => {
            const value = e.target.value;
            setMetacanonical(value);
            setErrors(prev => ({ ...prev, metacanonical: validateMetaCanonical(value.trim()) }));
          } }
          className={`w-full p-2 border rounded focus:outline-none ${errors.metacanonical ? "border-red-500" : ""}`}
          rows="3"
          placeholder="Enter canonical URL"
        ></textarea>
      {errors.metacanonical && <p className="text-red-500 text-sm mt-1">{errors.metacanonical}</p>}
    </div>
    <div className="mb-4">
        <label htmlFor="metaschema" className="block font-semibold mb-2">Schema</label>
        <textarea
          id="metaschema"
          value={metaschema}
          onChange={(e) => {
            const value = e.target.value;
            setMetaschema(value);
            setErrors(prev => ({ ...prev, metaschema: validateMetaSchema(value.trim()) }));
          } }
          className={`w-full p-2 border rounded focus:outline-none ${errors.metaschema ? "border-red-500" : ""}`}
          rows="3"
          placeholder="Enter schema markup (JSON-LD, max 2000 characters)"
          maxLength={2000}
        ></textarea>
        {errors.metaschema && <p className="text-red-500 text-sm mt-1">{errors.metaschema}</p>}
      </div><div className="mb-4">
        <label htmlFor="otherMeta" className="block font-semibold mb-2">Other Meta</label>
        <textarea
          id="otherMeta"
          value={otherMeta}
          onChange={(e) => {
            const value = e.target.value;
            setOtherMeta(value);
            setErrors(prev => ({ ...prev, otherMeta: validateOtherMeta(value.trim()) }));
          } }
          className={`w-full p-2 border rounded focus:outline-none ${errors.otherMeta ? "border-red-500" : ""}`}
          rows="3"
          placeholder="Enter additional meta tags (max 2000 characters)"
          maxLength={2000}
        ></textarea>
        {errors.otherMeta && <p className="text-red-500 text-sm mt-1">{errors.otherMeta}</p>}
      </div><div className="mb-4">
        <label htmlFor="priority" className="block font-semibold mb-2">Priority</label>
        <input
          type="number"
          id="priority"
          min={0}
          max={1}
          step={0.01}
          value={priority}
          onChange={(e) => {
            const value = e.target.value;
            setPriority(value);
            setErrors(prev => ({ ...prev, priority: validatePriority(value) }));
          } }
          className={`w-full p-2 border rounded focus:outline-none ${errors.priority ? "border-red-500" : ""}`}
          placeholder="Enter priority (0.0 to 1.0)" />
        {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
      </div><div className="mb-4">
        <label htmlFor="changeFreq" className="block font-semibold mb-2">Change Frequency</label>
        <select
          id="changeFreq"
          value={changeFreq}
          onChange={(e) => {
            const value = e.target.value;
            setChangeFreq(value);
            setErrors(prev => ({ ...prev, changeFreq: validateChangeFreq(value) }));
          } }
          className={`w-full p-2 border rounded focus:outline-none ${errors.changeFreq ? "border-red-500" : ""}`}
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
      </div><div className="mb-4">
        <label htmlFor="status" className="block font-semibold mb-2">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`w-full p-2 border rounded focus:outline-none ${errors.status ? "border-red-500" : ""}`}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div><div className="mt-4">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none">
          Add News
        </button>
      </div>
    </form></>
  );
};

export default NewNewsForm;