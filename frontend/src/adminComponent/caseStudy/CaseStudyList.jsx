import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const IndustrySecDataTable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all IndustrySecData entries
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/caseStudy");
        setData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching industry section data:", err);
        setError("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await axios.delete(`/api/caseStudy/${id}`);
        setData(data.filter((item) => item._id !== id));
        alert("Entry deleted successfully");
      } catch (err) {
        console.error("Error deleting entry:", err);
        setError("Failed to delete entry.");
      }
    }
  };

  // Handle edit
  const handleEdit = (id) => {
    navigate(`/edit-industry-data/${id}`);
  };

  return (
    <div className=" mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-6">Industry Section Data</h1>
      {/* {error && <div className="text-red-500 mb-4">{error}</div>} */}
      {isLoading && <div className="text-center">Loading...</div>}
      {!isLoading && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Type</th>
                <th className="py-2 px-4 border-b text-left">Heading</th>
           
                <th className="py-2 px-4 border-b text-left">Category</th>
                <th className="py-2 px-4 border-b text-left">Cards</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4 px-4 text-center">
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item._id}>
                    <td className="py-2 px-4 border-b">{item.type}</td>
                    <td className="py-2 px-4 border-b">{item.heading}</td>
                    {/* <td className="py-2 px-4 border-b">{item.subHeading}</td> */}
                    <td className="py-2 px-4 border-b">
                      {item.category?.category || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {item.card?.length
                        ? `${item.card.length} card(s): ${item.card
                            .map((card) => card.title)
                            .join(", ")}`
                        : "No cards"}
                    </td>
                    <td className="py-2 px-4 border-b flex space-x-2">
                      <button
                        onClick={() => handleEdit(item._id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4">
        <button
          onClick={() => navigate("/industry-sec-data/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create New
        </button>
      </div>
    </div>
  );
};

export default IndustrySecDataTable;