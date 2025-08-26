import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MetaList = () => {
  const [metaList, setMetaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const response = await axios.get("/api/staticMeta/get-meta");
       
        if (response.data && Array.isArray(response.data.data)) {
          setMetaList(response.data.data);
        } else {
          console.error("Unexpected API response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching meta data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeta();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meta data?")) return;
    try {
      await axios.delete(`/api/staticMeta/delete-meta/${id}`);
      alert("Meta data deleted successfully!");
      setMetaList(metaList.filter((item) => item._id !== id));
    } catch (error) {
      alert("Failed to delete meta data.");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* <nav className="mb-4 text-gray-600">
        <span className="text-gray-500">Home / </span>
        <span className="font-semibold">Meta Data</span>
      </nav> */}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Static Page Meta</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate("/meta-form")}
        >
          Add Meta
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 border">Page Name</th>
                <th className="py-2 px-4 border">Meta Title</th>
                <th className="py-2 px-4 border">Meta Description</th>
                <th className="py-2 px-4 border">Meta Keywords</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {metaList.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 border">{item.pageName}</td>
                  <td className="py-2 px-4 border">{item.metaTitle}</td>
                  <td className="py-2 px-4 border">{item.metaDescription}</td>
                  <td className="py-2 px-4 border">{item.metaKeyword}</td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => navigate(`/meta/edit-meta-form/${item._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
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

export default MetaList;
