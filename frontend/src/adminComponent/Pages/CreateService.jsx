import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
// import * as AllIcons from "react-icons/fa";
// import { IconContext } from "react-icons";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// const iconComponents = Object.entries(AllIcons).map(([key, value]) => ({
//     name: key,
//     icon: value,
// }));

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


const NewServiceForm = () => {
    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [photos, setPhotos] = useState([]);
    const [photoAlts, setPhotoAlts] = useState([]); // Alt text for each photo
    // const [selectedIcon, setSelectedIcon] = useState("");
    // const [showIconContainer, setShowIconContainer] = useState(false);
    const [status, setStatus] = useState("active");
    const [slug, setSlug] = useState("");
    const [metatitle, setMetatitle] = useState("");
    const [metadescription, setMetadescription] = useState("");
    const [metakeywords, setMetakeywords] = useState("");
    const [metalanguage, setMetalanguage] = useState("")
    const [metacanonical, setMetacanonical] = useState("")
    const [metaschema, setMetaschema] = useState("")
    const [otherMeta, setOthermeta] = useState("")
    const [url, setUrl] = useState("");
    const [priority, setPriority] = useState("");
    const [changeFreq, setChangeFreq] = useState("");
    const [categories, setCategories] = useState([]);
    const [parentCategoryId, setParentCategoryId] = useState("");
    const [subCategoryId, setSubCategoryId] = useState("");
    const [subSubCategoryId, setSubSubCategoryId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    // const filteredIcons = iconComponents.filter((icon) =>
    //     icon.name.toLowerCase().includes(selectedIcon.toLowerCase())
    // );


    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/services/getall', { withCredentials: true });
            setCategories(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('details', details);
            formData.append('status', status);
            formData.append('categories', parentCategoryId);
            formData.append('subcategories', subCategoryId);
            formData.append('subSubcategories', subSubCategoryId);
            // formData.append('icons', selectedIcon);
            formData.append('slug', slug);
            formData.append('metatitle', metatitle);
            formData.append('metakeywords', metakeywords);
            formData.append('metadescription', metadescription);
            formData.append('metalanguage', metalanguage);
            formData.append('metacanonical', metacanonical);
            formData.append('metaschema', metaschema);
            formData.append('otherMeta', otherMeta);
            formData.append('url', url);
            formData.append('priority', priority);
            formData.append('changeFreq', changeFreq);
            // Append each photo along with its alt text
            photos.forEach((photo, index) => {
                formData.append(`photo`, photo);
                formData.append(`alt`, photoAlts[index]);
            });

            const response = await axios.post('/api/services/insertService', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });



            setTitle("");
            setDetails("");
            setPhotos([]);
            setSlug("");
            setSlug("");
            setMetatitle("");
            setMetadescription("")
            setMetakeywords("");
            setMetalanguage("");
            setMetacanonical("");
            setMetaschema("");
            setOthermeta("");
            setUrl("");
            setPriority("");
            setChangeFreq("");
            // setSelectedIcon("");
            setStatus("active");
            setParentCategoryId("");
            setSubCategoryId("");
            setSubSubCategoryId("");
            setPhotoAlts([]);
            navigate('/services');
        } catch (error) {
            console.error(error);
        }
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to array
        // Limit the number of photos to 5
        if (photos.length + files.length > 5) {
            toast.error("You can only upload up to 5 photos");
            return;
        }
        setPhotos([...photos, ...files]);
        // Initialize alt text for each new photo
        const newPhotoAlts = Array.from({ length: files.length }, () => "");
        setPhotoAlts([...photoAlts, ...newPhotoAlts]);
    };

    const handleDeleteImage = (index) => {
        setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
        setPhotoAlts((prevPhotoAlts) => prevPhotoAlts.filter((_, i) => i !== index));
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

    useEffect(() => {
        if (slug) {
            setUrl(`https://rndtechnosoft.com/${slug}`);
        }
    }, [slug]);

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
            <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Add Service</h1>
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
                            <option key={subCategory._id} value={subCategory._id}>
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
                        <option value="">Select Sub-Subcategory</option>
                        {subSubCategories.map((subSubCategory) => (
                            <option key={subSubCategory._id} value={subSubCategory._id}>
                                {subSubCategory.category}
                            </option>
                        ))}
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
            {/* <div className="mb-4 relative">
                <label htmlFor="icon" className="block font-semibold mb-2">
                    Icon
                </label>
                <input
                    type="text"
                    value={selectedIcon}
                    onChange={(e) => setSelectedIcon(e.target.value)}
                    onClick={() => setShowIconContainer(true)}
                    className="w-full p-2 border rounded focus:outline-none"
                    placeholder="Search for an icon..."
                    required
                />
                {showIconContainer && (
                    <div className="absolute left-0 top-full max-h-48 overflow-y-auto w-52 bg-white rounded border border-gray-300 shadow-lg grid grid-cols-5">
                        {filteredIcons.map((icon, index) => (
                            <div
                                key={index}
                                className="p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    setSelectedIcon(icon.name);
                                    setShowIconContainer(false);
                                }}
                            >
                                <IconContext.Provider value={{ size: "1.5em" }}>
                                    {React.createElement(icon.icon)}
                                </IconContext.Provider>
                            </div>
                        ))}
                    </div>
                )}
            </div> */}
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
            <div className="mt-12">
                <label htmlFor="photo" className="block font-semibold mb-2">
                    Photos
                </label>
                <input
                    type="file"
                    name="photo"
                    id="photo"
                    multiple
                    onChange={handlePhotoChange}
                    className="border rounded focus:outline-none "
                    accept="image/*"
                />
                {photos.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-4">
                        {photos.map((photo, index) => (
                            <div key={index} className="relative w-56 group flex flex-col items-center">
                                <div className="relative">
                                    <img
                                        src={URL.createObjectURL(photo)}
                                        alt={`Service ${index + 1}`}
                                        className="h-32 w-56 object-cover"
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
                            </div>
                        ))}
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
            <div className="mb-4">
                <label htmlFor="url" className="block font-semibold mb-2">
                    URL
                </label>
                <input
                    disabled
                    type="url"
                    id="url"
                    value={`https://rndtechnosoft.com/${slug}`}
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
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Add Service
            </button>
        </form>
    );
};

export default NewServiceForm;

