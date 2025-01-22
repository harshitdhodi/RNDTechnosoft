import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewProductForm = () => {
    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [photos, setPhotos] = useState([]);
    const [photoAlts, setPhotoAlts] = useState([]);
    const [imgtitle, setImgtitle] = useState([]);

    const [status, setStatus] = useState("active");
    const [slug, setSlug] = useState("");
    const [metatitle, setMetatitle] = useState("");
    const [metadescription, setMetadescription] = useState("");
    const [metakeywords, setMetakeywords] = useState("");
    const [metalanguage,setMetalanguage]=useState("")
    const [metacanonical,setMetacanonical]=useState("")
    const [metaschema,setMetaschema]=useState("")
    const [otherMeta,setOthermeta]=useState("")
    const [categories, setCategories] = useState([]);
    const [parentCategoryId, setParentCategoryId] = useState("");
    const [subCategoryId, setSubCategoryId] = useState("");
    const [subSubCategoryId, setSubSubCategoryId] = useState("");
    const [benefits, setBenefits] = useState([]);
    const [selectedBenefits, setSelectedBenefits] = useState([]);
    const [catalogue,setCatalogue]=useState("")
    const [url, setUrl] = useState("");
    const [priority, setPriority] = useState("");    
    const [changeFreq, setChangeFreq] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
        fetchBenefits();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/product/getall', { withCredentials: true });
            setCategories(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchBenefits = async () => {
        try {
            const response = await axios.get('/api/benefits/getBenefits', { withCredentials: true });
            setBenefits(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('price', details);
            formData.append('status', status);
            formData.append('slug', slug);
            formData.append('metatitle', metatitle);
            formData.append('metakeywords', metakeywords);
            formData.append('metadescription', metadescription);
            formData.append('metalanguage', metalanguage);
            formData.append('metacanonical', metacanonical);
            formData.append('metaschema', metaschema);
            formData.append('otherMeta', otherMeta);
            formData.append('categories', parentCategoryId);
            formData.append('subcategories', subCategoryId);
            formData.append('subSubcategories', subSubCategoryId);

            selectedBenefits.forEach(benefitId => {
                formData.append('benefits[]', benefitId); // Append each benefitId in an array format
            });
            photos.forEach((photo, index) => {
                formData.append(`photo`, photo);
                formData.append(`alt`, photoAlts[index]);
                formData.append(`imgtitle`, imgtitle[index]);

            });
            formData.append('catalogue',catalogue)
            formData.append('url', url);
            formData.append('priority', priority);
            formData.append('changeFreq', changeFreq);

            const response = await axios.post('/api/product/insertProduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            console.log(response.data); // Log response data if needed

            setTitle("");
            setDetails("");
            setPhotos([]);
            setSlug("");
            setMetatitle("");
            setMetadescription("")
            setMetakeywords("");
            setMetalanguage("");
            setMetacanonical("");
            setMetaschema("");
            setOthermeta("");
            setStatus("active");
            setParentCategoryId("");
            setSubCategoryId("");
            setSubSubCategoryId("");
            setPhotoAlts([]);
            setImgtitle([]);

            setSelectedBenefits([]);
            setUrl("");
            setPriority("");
            setChangeFreq("");
            navigate('/product');
        } catch (error) {
            console.error(error);
        }
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to array
        if (photos.length + files.length > 5) {
            toast.error("You can only upload up to 5 photos");
            return;
        }
        setPhotos([...photos, ...files]);
        const newPhotoAlts = Array.from({ length: files.length }, () => "");
        setPhotoAlts([...photoAlts, ...newPhotoAlts]);
        const newImgtitles = Array.from({ length: files.length }, () => "");
        setImgtitle([...imgtitle, ...newImgtitles]);
    };

    const handleDeleteImage = (index) => {
        setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
        setPhotoAlts((prevPhotoAlts) => prevPhotoAlts.filter((_, i) => i !== index));
        setImgtitle((prevImgtitle) => prevImgtitle.filter((_, i) => i !== index));

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

    const handleBenefitChange = (benefitId) => {
        if (selectedBenefits.includes(benefitId)) {
            setSelectedBenefits(selectedBenefits.filter(id => id !== benefitId));
        } else {
            setSelectedBenefits([...selectedBenefits, benefitId]);
        }
    };

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
              <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Add Product</h1>
            <ToastContainer/>
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
            {subCategories.length>0 && (
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
            {subSubCategories.length>0 && (
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
            <div className="mb-4">
                <label htmlFor="details" className="block font-semibold mb-2">
                    Price
                </label>

                  <input
                    type="number"
                    id="details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none"
                    required
                />
            </div>
            <div className="mt-8">
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
                                <div className="relative w-56">
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
                                <label className="block mt-2">
                                    Image Title Text:
                                    <input
                                        type="text"
                                        value={imgtitle[index]}
                                        onChange={(e) => {
                                            const newImgtitles = [...imgtitle];
                                            newImgtitles[index] = e.target.value;
                                            setImgtitle(newImgtitles);
                                        }}
                                        className="w-full p-2 border rounded focus:outline-none"
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="mb-8 mt-4">
                <label className="block font-semibold mb-2">Benefits</label>
                <div className="flex flex-wrap gap-4">
                    {benefits.map(benefit => (
                        <label key={benefit._id} className="flex items-center">
                            <input
                                type="checkbox"
                                onChange={() => handleBenefitChange(benefit._id)}
                                checked={selectedBenefits.includes(benefit._id)}
                                className="mr-2 w-4 h-4"
                            />
                            {benefit.title}
                        </label>
                    ))}
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="catalogue" className="block font-semibold mb-2">Upload Catalogue</label>
                <input
                    type="file"
                    id="catalogue"
                    name="catalogue"
                    onChange={(e) => setCatalogue(e.target.files[0])}
                    className="border rounded focus:outline-none"
                    accept=".pdf,.doc,.docx"
                />
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
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none"
                >
                    Save Product
                </button>
            </div>
        </form>
    );
};

export default NewProductForm;
