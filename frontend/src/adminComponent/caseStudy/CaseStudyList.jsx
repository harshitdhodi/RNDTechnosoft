import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {title}
          </h3>
        )}
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const IndustrySecDataTable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemName: ''
  });
  const navigate = useNavigate();

  // Fetch all IndustrySecData entries
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/caseStudy");
        console.log('API Response:', res.data); // Debug log
        setData(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Error fetching industry section data:", err.response || err.message);
        setError(`Failed to load data: ${err.response?.data?.message || err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle delete confirmation
  const confirmDelete = (id, name = 'this item') => {
    setDeleteModal({
      isOpen: true,
      itemId: id,
      itemName: name
    });
  };

  // Handle actual delete
  const handleDelete = async () => {
    const { itemId } = deleteModal;
    try {
      await axios.delete(`/api/caseStudy/${itemId}`);
      setData(data.filter((item) => item._id !== itemId));
      setError(null);
      setDeleteModal({ isOpen: false, itemId: null, itemName: '' });
    } catch (err) {
      console.error("Error deleting entry:", err.response || err.message);
      setError(`Failed to delete entry: ${err.response?.data?.message || err.message}`);
      setDeleteModal({ isOpen: false, itemId: null, itemName: '' });
    }
  };

  // Handle edit
  const handleEdit = (id) => {
    navigate(`/industry-data/edit-industry-data/${id}`);
  };

  // Format card titles for display
  const formatCardTitles = (cards) => {
    if (!cards?.length) return "No cards";
    const titles = cards.map((card) => card.title).filter(Boolean);
    return titles.length ? `${titles.length} card(s): ${titles.slice(0, 2).join(", ")}${titles.length > 2 ? "..." : ""}` : "No cards";
  };

  return (
    <div className="mt-10 p-6 bg-white rounded-lg shadow-md max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Industry Section Data</h1>
        <button
          onClick={() => navigate("/industry-data/add-case-study")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
          disabled={isLoading}
        >
          Create New
        </button>
      </div>
      {error && (
        <div className="text-red-500 mb-4 p-3 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      {isLoading && (
        <div className="text-center py-4">
          <svg
            className="animate-spin h-5 w-5 mx-auto text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="ml-2">Loading...</span>
        </div>
      )}
      {!isLoading && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heading
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cards
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{item.type || "N/A"}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.heading || "N/A"}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {item.category?.category || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {formatCardTitles(item.card)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(item._id)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Edit"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(item._id, item.heading || 'this item');
                          }}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${deleteModal.itemName}? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default IndustrySecDataTable;