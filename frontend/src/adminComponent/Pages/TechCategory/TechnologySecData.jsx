import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TechnologyDataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
const navigate = useNavigate(); 
  // Mock data for demonstration
  const mockData = [
    {
      _id: '1',
      type: 'hire developer',
      heading: '<h2>Expert React Developers</h2>',
      card: [
        {
          photo: 'https://via.placeholder.com/300x200',
          heading: 'Frontend Specialists',
          subHeading: '<p>Build modern user interfaces</p>',
          altName: 'Frontend Developer',
          imgTitle: 'React Expert'
        },
        {
          photo: 'https://via.placeholder.com/300x200',
          heading: 'Full Stack Engineers',
          subHeading: '<p>End-to-end development solutions</p>',
          altName: 'Full Stack Developer',
          imgTitle: 'MERN Stack Expert'
        }
      ],
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      type: 'Why Choose',
      heading: '<h2>Why Choose Our Technology</h2>',
      card: [
        {
          photo: 'https://via.placeholder.com/300x200',
          heading: 'Scalable Solutions',
          subHeading: '<p>Built for growth and performance</p>',
          altName: 'Scalability',
          imgTitle: 'Scalable Tech'
        }
      ],
      createdAt: '2024-01-10T14:20:00Z'
    },
    {
      _id: '3',
      type: 'Technology Application',
      heading: '<h2>Modern Tech Applications</h2>',
      card: [
        {
          photo: 'https://via.placeholder.com/300x200',
          heading: 'AI Integration',
          subHeading: '<p>Cutting-edge artificial intelligence</p>',
          altName: 'AI Technology',
          imgTitle: 'AI Solutions'
        },
        {
          photo: 'https://via.placeholder.com/300x200',
          heading: 'Cloud Computing',
          subHeading: '<p>Reliable cloud infrastructure</p>',
          altName: 'Cloud Services',
          imgTitle: 'Cloud Technology'
        },
        {
          photo: 'https://via.placeholder.com/300x200',
          heading: 'Mobile Development',
          subHeading: '<p>Cross-platform mobile apps</p>',
          altName: 'Mobile Apps',
          imgTitle: 'Mobile Solutions'
        }
      ],
      createdAt: '2024-01-05T09:15:00Z'
    }
  ];

  // Simulate API calls
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Actual API call to fetch data
      const response = await fetch('/api/technologySecData', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result.data || result || []);
      
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
      // Fallback to mock data for demonstration
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      
      // Actual API call to delete data
      const response = await fetch(`/api/technologySecData/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Remove the deleted item from the state
      setData(data.filter(item => item._id !== id));
      
      // Show success message
      alert('Item deleted successfully!');
      
    } catch (err) {
      setError('Failed to delete item');
      console.error('Error deleting item:', err);
      alert('Failed to delete item. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (id) => {
    // In real implementation, this would be:
    navigate(`/technology-form/${id}`);
   
  };

  const handleAdd = () => {
    // In real implementation, this would be:
    navigate('/manage-tech-sec');
 
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    const strippedText = text.replace(/<[^>]*>/g, ''); // Remove HTML tags
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Technology Section Data</h2>
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

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">No data found</p>
          <button
            onClick={handleAdd}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Add First Entry
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Heading
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Cards Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={item._id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.type || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {truncateText(item.heading)}
                    </div>
                  </td>
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
                        onClick={() => handleEdit(item._id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
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
      )}
    
    </div>
  );
};

export default TechnologyDataTable;