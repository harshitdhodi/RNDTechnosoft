import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

const TechCategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/techCategory", { withCredentials: true });
      setCategories(res.data.data || res.data);
    } catch (error) {
      setCategories([]);
      toast.error("Failed to fetch categories");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open delete confirmation modal
  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setIsModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setCategoryToDelete(null);
  };

  // Delete category
  const deleteCategory = async () => {
    if (!categoryToDelete?._id) {
      toast.error("No category selected for deletion");
      setIsModalOpen(false);
      return;
    }
    try {
      await axios.delete(`/api/techCategory/${categoryToDelete._id}`, { withCredentials: true });
      toast.success("Category deleted successfully!");
      setCategories((prev) => prev.filter((cat) => cat._id !== categoryToDelete._id));
    } catch (error) {
      const statusCode = error.response?.status ? `(${error.response.status})` : '';
      const message = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to delete category: ${message} ${statusCode}`);
    } finally {
      setIsModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="mt-10">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6 px-4">
        <h2 className="text-xl font-bold mb-4 font-serif">Tech Categories</h2>
        <button
          onClick={() => navigate("/add-technology")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Add New Category
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-gray-500 font-serif text-center">No categories found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b font-serif">Heading</th>
                <th className="py-2 px-4 border-b font-serif">Subheading</th>
                <th className="py-2 px-4 border-b font-serif">Photo</th>
                <th className="py-2 px-4 border-b font-serif">Alt</th>
                <th className="py-2 px-4 border-b font-serif">Image Title</th>
                <th className="py-2 px-4 border-b font-serif">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50 transition duration-150">
                  <td className="py-2 px-4 border-b">{cat.heading || "-"}</td>
                  <td className="py-2 px-4 border-b">{cat.subheading || "-"}</td>
                  <td className="py-2 px-4 border-b">
                    {cat.photo ? (
                      <img
                        src={`/api/logo/download/${cat.photo}`}
                        alt={cat.alt || "Category image"}
                        className="w-6 h-6 object-contain rounded"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">{cat.alt || "-"}</td>
                  <td className="py-2 px-4 border-b">{cat.imgTitle || "-"}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex gap-4">
                      <button
                        onClick={() => navigate(`/edit-tech-category/${cat._id}`)}
                        className="text-blue-500 hover:text-blue-700 transition"
                        title="Edit"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(cat)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteCategory}
        itemName={categoryToDelete?.heading || "this category"}
        itemType="Category"
      />
    </div>
  );
=======

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
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
};

export default TechCategoryTable;