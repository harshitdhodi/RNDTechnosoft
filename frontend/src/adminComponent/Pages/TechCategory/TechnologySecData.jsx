import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

const DetailModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {item.technology?.imgTitle || 'N/A'} - {item.type}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700">Heading:</h4>
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: item.heading || 'N/A' }}
              />
            </div>

            {item.subHeading && (
              <div>
                <h4 className="font-semibold text-gray-700">Sub Heading:</h4>
                <div 
                  className="prose max-w-none" 
                  dangerouslySetInnerHTML={{ __html: item.subHeading }}
                />
              </div>
            )}

            {item.card?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Cards:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.card.map((card, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      {card.photo && (
                        <div className="mb-2">
                          <img 
                            src={`/api/logo/download/${card.photo}`} 
                            alt={card.altName || 'Card image'} 
                            className="max-w-full h-auto rounded"
                          />
                        </div>
                      )}
                      {card.heading && (
                        <div 
                          className="prose max-w-none mb-2" 
                          dangerouslySetInnerHTML={{ __html: card.heading }}
                        />
                      )}
                      {card.subHeading && (
                        <div 
                          className="prose max-w-none text-sm text-gray-600"
                          dangerouslySetInnerHTML={{ __html: card.subHeading }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Created:</span> {new Date(item.createdAt).toLocaleDateString()}
                {item.updatedAt && (
                  <span className="ml-4">
                    <span className="font-medium">Last Updated:</span> {new Date(item.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TechnologyDataTable = () => {
  const [data, setData] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [selectedTechnology, setSelectedTechnology] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch data and technologies
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/technologySecData', { withCredentials: true });
      const fetchedData = response.data.data || response.data || [];
      setData(fetchedData);
      
      // Extract unique technology names as strings
      const techNames = [
        ...new Set(
          fetchedData
            .map(item => item.technology?.imgTitle)
            .filter(Boolean)
        )
      ];
      setTechnologies(techNames);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
      toast.error('Failed to fetch technology data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open delete confirmation modal
  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setIsModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  // Delete item
  const handleDelete = async () => {
    if (!itemToDelete?._id) {
      toast.error("No item selected for deletion");
      setIsModalOpen(false);
      return;
    }
    try {
      setDeleteLoading(itemToDelete._id);
      await axios.delete(`/api/technologySecData/${itemToDelete._id}`, { withCredentials: true });
      toast.success("Item deleted successfully!");
      setData(data.filter(item => item._id !== itemToDelete._id));
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      const statusCode = err.response?.status ? `(${err.response.status})` : '';
      const message = err.response?.data?.message || err.message || 'Unknown error';
      toast.error(`Failed to delete item: ${message} ${statusCode}`);
    } finally {
      setDeleteLoading(null);
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/technology-form/${id}`);
  };

  const handleAdd = () => {
    navigate('/manage-tech-sec');
  };

  const handleTechnologyChange = (e) => {
    setSelectedTechnology(e.target.value);
    setCurrentPage(1);
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    const strippedText = text.replace(/<[^>]*>/g, '');
    return strippedText.length > maxLength 
      ? strippedText.substring(0, maxLength) + '...' 
      : strippedText;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // Filter data based on selected technology
  const filteredData = selectedTechnology === 'All'
    ? data
    : data.filter(item => item.technology?.imgTitle === selectedTechnology);

  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 font-serif">Technology Section Data</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add New
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
          <button
            onClick={fetchData}
            className="ml-4 text-red-800 underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 font-serif">Filter by Technology:</label>
        <div className="relative w-48">
          <select
            value={selectedTechnology}
            onChange={handleTechnologyChange}
            className="block w-full appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            <option value="All">All Technologies</option>
            {technologies.map((techName, index) => (
              <option key={index} value={techName}>
                {techName}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 14.707a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L9 12.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4z" />
            </svg>
          </div>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg font-serif">No data found</p>
          <button
            onClick={handleAdd}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Add First Entry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b font-serif">
                    Technology
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b font-serif">
                    Section
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b font-serif">
                    Type
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b font-serif">
                    Title
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b font-serif">
                    Cards Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b font-serif">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b font-serif">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((item, index) => (
                  <tr key={item._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                        {item.technology?.imgTitle || 'N/A'}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.section || 'N/A'}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {item.type || 'N/A'}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {item.title || 'N/A'}
                      </div>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {item.card ? item.card.length : 0} cards
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(item._id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item)}
                          disabled={deleteLoading === item._id}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleteLoading === item._id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 font-serif">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
              </span>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border border-gray-300 rounded-md text-sm ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100'
                    } transition-colors`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        itemName={itemToDelete?.technology.imgTitle ? truncateText(itemToDelete.technology.imgTitle) : "this item"}
        itemType="Technology Section"
      />
      <DetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        item={selectedItem} 
      />
    </div>
  );
};

export default TechnologyDataTable;