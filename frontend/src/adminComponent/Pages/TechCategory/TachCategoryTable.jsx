import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TechCategoryTable = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
const navigate = useNavigate();
    // Fetch categories
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/techCategory");
            setCategories(res.data.data || res.data); // adjust if your API returns {data: [...]}
        } catch (error) {
            setCategories([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Delete category
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await axios.delete(`/api/techCategory/${id}`);
            setCategories((prev) => prev.filter((cat) => cat._id !== id));
        } catch (error) {
            alert("Failed to delete category.");
        }
    };

    return (
        <div className="mt-10">
            <div className="flex justify-between items-center mb-6 px-4">
            <h2 className="text-xl font-bold mb-4">Tech Categories</h2>
                <button
                    onClick={() => navigate("/add-technology")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"  >
                    Add New Category
                </button>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : categories.length === 0 ? (
                <div>No categories found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 bg-white">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b">Heading</th>
                                <th className="py-2 px-4 border-b">Subheading</th>
                                <th className="py-2 px-4 border-b">Photo</th>
                                <th className="py-2 px-4 border-b">Alt</th>
                                <th className="py-2 px-4 border-b">Image Title</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => (
                                <tr key={cat._id}>
                                    <td className="py-2 px-4 border-b">{cat.heading}</td>
                                    <td className="py-2 px-4 border-b">{cat.subheading}</td>
                                    <td className="py-2 px-4 border-b">
                                        {cat.photo ? (
                                            <img
                                                src={`/api/logo/download/${cat.photo}`}
                                                alt={cat.alt}
                                                className="w-6 h-6 object-contain rounded"
                                            />
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b">{cat.alt}</td>
                                    <td className="py-2 px-4 border-b">{cat.imgTitle}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button
                                            onClick={() => navigate(`/edit-tech-category/${cat._id}`)}
                                            className="text-blue-500 hover:text-blue-700 mr-2"
                                            title="Edit"
                                        >
                                            <Edit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat._id)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Delete"
                                        >
                                            <Trash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TechCategoryTable;