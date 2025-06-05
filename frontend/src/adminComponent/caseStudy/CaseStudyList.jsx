import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Delete } from "lucide-react";

const CaseStudyList = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch case studies
  useEffect(() => {
    const fetchCaseStudies = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/caseStudy");
        console.log("Fetched case studies:", res.data.data); // Debugging log
        // Ensure res.data.data is an array; if not, set to empty array
        setCaseStudies(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Error fetching case studies:", err);
        setError("Failed to load case studies. Please try again later.");
        setCaseStudies([]); // Reset to empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchCaseStudies();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this case study?")) return;
    try {
      await axios.delete(`/api/caseStudy/${id}`);
      setCaseStudies(caseStudies.filter((study) => study._id !== id));
      alert("Case study deleted successfully");
    } catch (err) {
      console.error("Error deleting case study:", err);
      setError("Failed to delete case study.");
    }
  };

  // Handle edit
  const handleEdit = (id) => {
    navigate(`/edit-case-study/${id}`);
  };

  return (
    <>
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-6">Case Studies</h1>
      <div>
        <button className="">
Add Case Study
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : !Array.isArray(caseStudies) || caseStudies.length === 0 ? (
        <div className="text-center">No case studies found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Image</th>
                <th className="border px-4 py-2 text-left">Heading</th>
                <th className="border px-4 py-2 text-left">Subheading</th>
                <th className="border px-4 py-2 text-left">Industry</th>
                <th className="border px-4 py-2 text-left">Details</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {caseStudies.map((study) => (
                <tr key={study._id} clas sName="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    {study.photo ? (
                      <img
                        src={`/api/logo/download/${study.photo}`}
                        alt={study.altImg || "Case study image"}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="border px-4 py-2">{study.heading}</td>
                  <td className="border px-4 py-2">{study.subHeading || "N/A"}</td>
                  <td className="border px-4 py-2">
                    {study.industryCategory?.category || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    <div
                      className="line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: study.details }}
                    />
                  </td>
                  <td className="border px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(study._id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(study._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                    <Delete/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
};

export default CaseStudyList;