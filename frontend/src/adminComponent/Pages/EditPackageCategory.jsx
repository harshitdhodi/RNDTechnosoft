import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditCategory = () => {
  const { categoryId, subCategoryId, subSubCategoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState("");
  const [altText, setAltText] = useState("");
  const [imgtitle, setImgtitle] = useState("");
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [slug, setSlug] = useState("");
  const [metatitle, setMetatitle] = useState("");
  const [metadescription, setMetadescription] = useState("");
  const [metakeywords, setMetakeywords] = useState("");
  const [metalanguage,setMetalanguage]=useState("")
  const [metacanonical,setMetacanonical]=useState("")
  const [metaschema,setMetaschema]=useState("")
  const [otherMeta,setOthermeta]=useState("")
  const [url, setUrl] = useState()
  const [changeFreq, setChangeFreq] = useState()
  const [priority, setPriority] = useState(0)
  const [status, setStatus] = useState("active");

  useEffect(() => {
    const fetchData = async () => {
      let urls = "";

      if (categoryId && subCategoryId && subSubCategoryId) {
        urls = `/api/packages/getSpecificSubSubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}&subSubCategoryId=${subSubCategoryId}`;
      } else if (categoryId && subCategoryId) {
        urls = `/api/packages/getSpecificSubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}`;
      } else if (categoryId) {
        urls = `/api/packages/getSpecificCategory?categoryId=${categoryId}`;
      }

      try {
        const response = await axios.get(urls, { withCredentials: true });
        const { category, photo,alt,imgtitle,slug,metatitle,metadescription,metakeywords,metalanguage,metacanonical,metaschema,otherMeta,changeFreq,priority} = response.data;

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
      }
    };

    fetchData();
  }, [categoryId, subCategoryId, subSubCategoryId]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleDeleteImage = () => {
    setPhoto(null);
    setAltText("");
    setImgtitle("");
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

useEffect(() => {
  setSlug(category.replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
  );
}, [category])

useEffect(() => {
  setSlug(slug.toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
  );
}, [slug])

  const handleSubmit = async (e) => {
    e.preventDefault();
    let urls = "";
    const formData = new FormData();
    formData.append("category", category);
    formData.append("alt", altText);
    formData.append("imgtitle",imgtitle);
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
    formData.append('priority', priority);
    formData.append('status', status);

    if (photo) {
      formData.append("photo", photo);
    } else {
      formData.append("photo", currentPhoto);
    }

    if (categoryId && subCategoryId && subSubCategoryId) {
      urls = `/api/packages/updatesubsubcategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}&subSubCategoryId=${subSubCategoryId}`;
    } else if (categoryId && subCategoryId) {
      urls = `/api/packages/updateSubCategory?categoryId=${categoryId}&subCategoryId=${subCategoryId}`;
    } else if (categoryId) {
      urls = `/api/packages/updateCategory?categoryId=${categoryId}`;
    }

    try {
      await axios.put(urls, formData, { withCredentials: true });
      navigate("/PackageCategory");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
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
