import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NewCategoryForm = () => {
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [altText, setAltText] = useState("");
  const [imgtitle, setImgtitle] = useState("");

  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [priority, setPriority] = useState("");
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

  const navigate = useNavigate();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleDeleteImage = () => {
    setPhoto(null);
  };

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
    clipboard: {
      matchVisual: false,
    },
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/services/getall", {
        withCredentials: true,
      });
      setCategories(response.data);
    } catch (error) {
      console.error(error);
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
    setSlug(
      category
        .replace(/\s+/g, "-")
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")
    );
  }, [category]);

  useEffect(() => {
    setSlug(
      slug
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/--+/g, "-")
    );
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let urls = "/api/services/insertCategory";
      const formData = new FormData();
      formData.append("category", category);
      formData.append("tag", tag);
      formData.append("description", description);
      if (photo) {
        formData.append("photo", photo);
      }
      formData.append("alt", altText);
      formData.append("imgtitle", imgtitle);
      formData.append("slug", slug);
      formData.append("metatitle", metatitle);
      formData.append("metakeywords", metakeywords);
      formData.append("metadescription", metadescription);
      formData.append("metalanguage", metalanguage);
      formData.append("metacanonical", metacanonical);
      formData.append("metaschema", metaschema);
      formData.append("otherMeta", otherMeta);
      formData.append("url", url);
      formData.append("priority", priority);
      formData.append("changeFreq", changeFreq);
      formData.append("status", status);

      if (parentCategoryId && !subCategoryId) {
        urls = `/api/services/insertSubCategory?categoryId=${parentCategoryId}`;
      } else if (parentCategoryId && subCategoryId) {
        urls = `/api/services/insertSubSubCategory?categoryId=${parentCategoryId}&subCategoryId=${subCategoryId}`;
      }

      const response = await axios.post(urls, formData, {
        withCredentials: true,
      });

      setCategory("");
      setTag("")
      setDescription("");
      setPhoto("");
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
      setPriority("");
      setChangeFreq("");
      navigate("/ServiceCategory");
    } catch (error) {
      console.error(error);
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
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">
        Add Category
      </h1>
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
          Category
        </label>
        <input
          type="text"
          id="title"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">
          Description
        </label>
        <ReactQuill
          value={description}
          onChange={setDescription} // Directly update heading
          modules={modules}
          className="quill"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="tag" className="block font-semibold mb-2">
          Tag
        </label>
        <input
          id="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
        ></input>
      </div>
      <div className="mb-8">
        <label htmlFor="photo" className="block font-semibold mb-2">
          Photo
        </label>
        <input
          type="file"
          name="photo"
          id="photo"
          onChange={handlePhotoChange}
          className="border rounded focus:outline-none"
          accept="image/*"
        />

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
              <label htmlFor="alt" className="block font-semibold mb-2">
                Alternative Text
              </label>
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
              <label htmlFor="imgtitle" className="block font-semibold mb-2">
                Image Title Text
              </label>
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
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Add Category
      </button>
    </form>
  );
};

export default NewCategoryForm;
