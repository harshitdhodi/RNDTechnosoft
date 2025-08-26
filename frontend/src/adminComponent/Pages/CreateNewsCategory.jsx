import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    validateCategory,
    validateDescription,
    validatePhoto,
    validatePhotoAlt,
    validateSlug,
    validateMetaTitle,
    validateMetaDescription,
    validateMetaKeywords,
    validateMetaLanguage,
    validateMetaCanonical,
    validateMetaSchema,
    validateOtherMeta,
    validatePriority,
    validateChangeFreq
} from '../../utiles/validations.js';

const NewCategoryForm = () => {
    const [category, setCategory] = useState("");
    const [details, setDetails] = useState("");
    const [photo, setPhoto] = useState(null);
    const [altText, setAltText] = useState("");
    const [parentCategoryId, setParentCategoryId] = useState("");
    const [subCategoryId, setSubCategoryId] = useState("");
    const [categories, setCategories] = useState([]);
    const [priority, setPriority] = useState("0");
    const [changeFreq, setChangeFreq] = useState("");
    const [url, setUrl] = useState("")
    const [slug, setSlug] = useState("");
    const [metatitle, setMetatitle] = useState("");
    const [metadescription, setMetadescription] = useState("");
    const [metakeywords, setMetakeywords] = useState("");
    const [metalanguage, setMetalanguage] = useState("")
    const [metacanonical, setMetacanonical] = useState("")
    const [metaschema, setMetaschema] = useState("")
    const [otherMeta, setOthermeta] = useState("")
    
    // Validation error states
    const [errors, setErrors] = useState({
        category: "",
        details: "",
        photo: "",
        altText: "",
        slug: "",
        metatitle: "",
        metadescription: "",
        metakeywords: "",
        metalanguage: "",
        metacanonical: "",
        metaschema: "",
        otherMeta: "",
        priority: "",
        changeFreq: ""
    });
    
    const navigate = useNavigate();

    // Validation functions
    const validateField = (fieldName, value, currentPhoto = null) => {
        let error = "";
        switch (fieldName) {
            case 'category':
                error = validateCategory(value);
                break;
            case 'details':
                error = validateDescription(value);
                break;
            case 'photo':
                error = validatePhoto(value, currentPhoto);
                break;
            case 'altText':
                error = validatePhotoAlt(value);
                break;
            case 'slug':
                error = validateSlug(value);
                break;
            case 'metatitle':
                error = validateMetaTitle(value);
                break;
            case 'metadescription':
                error = validateMetaDescription(value);
                break;
            case 'metakeywords':
                error = validateMetaKeywords(value);
                break;
            case 'metalanguage':
                error = validateMetaLanguage(value);
                break;
            case 'metacanonical':
                error = validateMetaCanonical(value);
                break;
            case 'metaschema':
                error = validateMetaSchema(value);
                break;
            case 'otherMeta':
                error = validateOtherMeta(value);
                break;
            case 'priority':
                error = validatePriority(value);
                break;
            case 'changeFreq':
                error = validateChangeFreq(value);
                break;
            default:
                break;
        }
        return error;
    };

    const updateError = (fieldName, error) => {
        setErrors(prev => ({
            ...prev,
            [fieldName]: error
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setPhoto(file);
        const error = validateField('photo', file);
        updateError('photo', error);
    };

    const handleDeleteImage = () => {
        setPhoto(null);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/news/getall', { withCredentials: true });
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
        
        // Validate all fields
        const newErrors = {
            category: validateField('category', category),
            details: validateField('details', details),
            photo: validateField('photo', photo),
            altText: photo ? validateField('altText', altText) : "", // Only validate altText if photo exists
            slug: validateField('slug', slug),
            metatitle: validateField('metatitle', metatitle),
            metadescription: validateField('metadescription', metadescription),
            metakeywords: validateField('metakeywords', metakeywords),
            metalanguage: validateField('metalanguage', metalanguage),
            metacanonical: validateField('metacanonical', metacanonical),
            metaschema: validateField('metaschema', metaschema),
            otherMeta: validateField('otherMeta', otherMeta),
            priority: validateField('priority', priority),
            changeFreq: validateField('changeFreq', changeFreq)
        };
        
        setErrors(newErrors);
        
        // Check if there are any errors (only category is required)
        const hasRequiredErrors = newErrors.category !== "";
        if (hasRequiredErrors) {
            toast.error("Please fill in the required fields.");  
            return;
        }
        
        try {
            let urls = '/api/news/insertCategory';
            const formData = new FormData();
            formData.append('category', category);
            formData.append('details', details);

            if (photo) {
                formData.append('photo', photo);
            }
            formData.append('alt', altText);
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

            if (parentCategoryId && !subCategoryId) {
                urls = `/api/news/insertSubCategory?categoryId=${parentCategoryId}`;
            } else if (parentCategoryId && subCategoryId) {
                urls = `/api/news/insertSubSubCategory?categoryId=${parentCategoryId}&subCategoryId=${subCategoryId}`;
            }

            const response = await axios.post(urls, formData, { withCredentials: true });
            toast.success("Category created successfully!");

            setCategory("");
            setDetails("")
            setPhoto(null);
            setAltText("");
            setParentCategoryId("");
            setSubCategoryId("");
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
            navigate('/NewsCategory');
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while creating the category.");
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
            {subCategories.lenth > 0 && (
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
                <label htmlFor="category" className="block font-semibold mb-2">
                    Category <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        const error = validateField('category', e.target.value);
                        updateError('category', error);
                    }}
                    className={`w-full p-2 border rounded focus:outline-none ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                    required
                />
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="details" className="block font-semibold mb-2">
                    Details <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="details"
                    value={details}
                    onChange={(e) => {
                        setDetails(e.target.value);
                        const error = validateField('details', e.target.value);
                        updateError('details', error);
                    }}
                    className={`w-full p-2 border rounded focus:outline-none ${errors.details ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.details && <p className="text-red-500 text-sm mt-1">{errors.details}</p>}
            </div>
            <div className="mb-8">
                <label htmlFor="photo" className="block font-semibold mb-2">Photo</label>
                <input
                    type="file"
                    name="photo"
                    id="photo"
                    onChange={handlePhotoChange}
                    className={`border rounded focus:outline-none ${errors.photo ? 'border-red-500' : 'border-gray-300'}`}
                    accept="image/*"
                />
                {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}

                {photo && (
                    <div className="mt-2 w-56 relative group">
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
                                    const error = validateField('altText', e.target.value);
                                    updateError('altText', error);
                                }}
                                className={`w-full p-2 border rounded focus:outline-none ${errors.altText ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.altText && <p className="text-red-500 text-sm mt-1">{errors.altText}</p>}
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
                        const error = validateField('slug', e.target.value);
                        updateError('slug', error);
                    }}
                    className={`w-full p-2 border rounded focus:outline-none ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
                />
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
                    className="w-full p-2 border rounded focus:outline-none"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="metatitle" className="block font-semibold mb-2">
                    Meta Title
                </label>
                <textarea
                    id="metatitle"
                    value={metatitle}
                    onChange={(e) => {
                        setMetatitle(e.target.value);
                        const error = validateField('metatitle', e.target.value);
                        updateError('metatitle', error);
                    }}
                    className={`w-full p-2 border rounded focus:outline-none ${errors.metatitle ? 'border-red-500' : 'border-gray-300'}`}
                    rows="3"
                ></textarea>
                {errors.metatitle && <p className="text-red-500 text-sm mt-1">{errors.metatitle}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="metadescription" className="block font-semibold mb-2">
                    Meta Description
                </label>
                <textarea
                    id="metadescription"
                    value={metadescription}
                    onChange={(e) => {
                        setMetadescription(e.target.value);
                        const error = validateField('metadescription', e.target.value);
                        updateError('metadescription', error);
                    }}
                    className={`w-full p-2 border rounded focus:outline-none ${errors.metadescription ? 'border-red-500' : 'border-gray-300'}`}
                    rows="3"
                ></textarea>
                {errors.metadescription && <p className="text-red-500 text-sm mt-1">{errors.metadescription}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="metakeywords" className="block font-semibold mb-2">
                    Meta Keywords
                </label>
                <textarea
                    id="metakeywords"
                    value={metakeywords}
                    onChange={(e) => {
                        setMetakeywords(e.target.value);
                        const error = validateField('metakeywords', e.target.value);
                        updateError('metakeywords', error);
                    }}
                    className={`w-full p-2 border rounded focus:outline-none ${errors.metakeywords ? 'border-red-500' : 'border-gray-300'}`}
                    rows="3"
                ></textarea>
                {errors.metakeywords && <p className="text-red-500 text-sm mt-1">{errors.metakeywords}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="metacanonical" className="block font-semibold mb-2">
                    Meta Canonical
                </label>
                <textarea
                    id="metacanonical"
                    value={metacanonical}
                    onChange={(e) => {
                        setMetacanonical(e.target.value);
                        const error = validateField('metacanonical', e.target.value);
                        updateError('metacanonical', error);
                    }}
                    className={`w-full p-2 border rounded focus:outline-none ${errors.metacanonical ? 'border-red-500' : 'border-gray-300'}`}
                    rows="3"
                ></textarea>
                {errors.metacanonical && <p className="text-red-500 text-sm mt-1">{errors.metacanonical}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="metalanguage" className="block font-semibold mb-2">
                    Meta Language
                </label>
                <textarea
                    id="metalanguage"
                    value={metalanguage}
                    onChange={(e) => {
                        setMetalanguage(e.target.value);
                        const error = validateField('metalanguage', e.target.value);
                        updateError('metalanguage', error);
                    }}
                    className={`w-full p-2 border rounded focus:outline-none ${errors.metalanguage ? 'border-red-500' : 'border-gray-300'}`}
                    rows="3"
                ></textarea>
                {errors.metalanguage && <p className="text-red-500 text-sm mt-1">{errors.metalanguage}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="otherMeta" className="block font-semibold mb-2">
                    Other Meta
                </label>
                <textarea
                    id="otherMeta"
                    value={otherMeta}
                    onChange={(e) => {
                        setOthermeta(e.target.value);
                        const error = validateField('otherMeta', e.target.value);
                        updateError('otherMeta', error);
                    }}
                    className={`w-full p-2 border rounded focus:outline-none ${errors.otherMeta ? 'border-red-500' : 'border-gray-300'}`}
                    rows="3"
                ></textarea>
                {errors.otherMeta && <p className="text-red-500 text-sm mt-1">{errors.otherMeta}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="metaschema" className="block font-semibold mb-2">
                    Schema
                </label>
                <textarea
                    id="metaschema"
                    value={metaschema}
                    onChange={(e) => {
                        setMetaschema(e.target.value);
                        const error = validateField('metaschema', e.target.value);
                        updateError('metaschema', error);
                    }}
                    className={`w-full p-2 border rounded focus:outline-none ${errors.metaschema ? 'border-red-500' : 'border-gray-300'}`}
                    rows="3"
                ></textarea>
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
                        const error = validateField('priority', e.target.value);
                        updateError('priority', error);
                    }}
                    className={`w-full p-2 border rounded focus:outline-none ${errors.priority ? 'border-red-500' : 'border-gray-300'}`}
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
                        const error = validateField('changeFreq', e.target.value);
                        updateError('changeFreq', error);
                    }}
                    className={`w-full p-2 border rounded focus:outline-none ${errors.changeFreq ? 'border-red-500' : 'border-gray-300'}`}
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
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                Add Category
            </button>
        </form>
    );
};

export default NewCategoryForm;