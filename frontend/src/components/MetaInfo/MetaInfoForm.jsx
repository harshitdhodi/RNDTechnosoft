import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const StaticMetaForm = () => {
    const [formData, setFormData] = useState({
        pageName: "",
        pageSlug: "",
        metaTitle: "",
        metaDescription: "",
        metaKeyword: "",
        altName: "", // Added altName field
        photo: null // Added photo field
    });
    const [photoPreview, setPhotoPreview] = useState(null); // Added photo preview state
    const [menuList, setMenuList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await axios.get("/api/navbar/getMenulisting");
                setMenuList(response.data.menuListings || []);
                console.log(response.data.menuListings);
            } catch (error) {
                console.error("Error fetching menu list:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenus();
    }, []);

    useEffect(() => {
        if (id) {
            axios.get(`/api/staticMeta/get-meta/${id}`).then((response) => {
                if (response.data.success) {
                    const metaData = response.data.data;
                    setFormData(metaData);
                    
                    // If there's a photo URL in the response, set it as preview
                    if (metaData.photoUrl) {
                        setPhotoPreview(metaData.photoUrl);
                    }
                }
            });
        }
    }, [id]);

    const generateSlug = (pageName) => {
        return pageName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === "pageName") {
            setFormData((prev) => ({ ...prev, pageSlug: generateSlug(value) }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, photo: file });
            
            // Create URL for preview
            const previewUrl = URL.createObjectURL(file);
            setPhotoPreview(previewUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Create FormData to handle file upload
            const formDataToSend = new FormData();
            
            // Append all text fields
            Object.keys(formData).forEach(key => {
                if (key !== 'photo' || formData[key] === null) {
                    formDataToSend.append(key, formData[key]);
                }
            });
            
            // Append photo if it exists
            if (formData.photo) {
                formDataToSend.append('photo', formData.photo);
            }
            
            if (id) {
                await axios.put(`/api/staticMeta/update-meta/${id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert("Meta data updated successfully!");
            } else {
                await axios.post("/api/staticMeta/add-meta", formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert("Meta data added successfully!");
                setFormData({
                    pageName: "",
                    pageSlug: "",
                    metaTitle: "",
                    metaDescription: "",
                    metaKeyword: "",
                    altName: "",
                    photo: null
                });
                setPhotoPreview(null);
            }
            navigate("/meta-table");
        } catch (error) {
            alert("Failed to save meta data.");
            console.error("Error:", error);
        }
    };

    return (
        <div className="mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
            <form onSubmit={handleSubmit} className="space-y-4 w-full sm:w-1/2">
                <div>
                    <label className="block text-gray-700 font-medium">Page Name</label>
                    <select
                        name="pageName"
                        value={formData.pageName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="">Select a page</option>
                        <option value="Home Page">Home Page</option>
                        <option value="Static Page">Default Page</option>
                        {menuList.map((menu) => (
                            <option key={menu._id} value={menu.pagename}>
                                {menu.pagename}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Page Slug</label>
                    <input
                        type="text"
                        name="pageSlug"
                        value={formData.pageSlug}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Meta Title</label>
                    <input
                        type="text"
                        name="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Meta Description</label>
                    <textarea
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Meta Keywords</label>
                    <input
                        type="text"
                        name="metaKeyword"
                        value={formData.metaKeyword}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                {/* New Photo Upload Field */}
                <div>
                    <label className="block text-gray-700 font-medium">Photo</label>
                    <input
                        type="file"
                        name="photo"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full p-2 border rounded-md"
                    />
                    {photoPreview && (
                        <div className="mt-2">
                            <img 
                                src={photoPreview} 
                                alt="Preview" 
                                className="h-32 object-contain border rounded-md"
                            />
                        </div>
                    )}
                </div>

                {/* New Alt Text Field */}
                <div>
                    <label className="block text-gray-700 font-medium">Alt Text</label>
                    <input
                        type="text"
                        name="altName"
                        value={formData.altName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="Descriptive text for the image"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                >
                    {id ? "Update Meta" : "Add Meta"}
                </button>
            </form>
        </div>
    );
};

export default StaticMetaForm;