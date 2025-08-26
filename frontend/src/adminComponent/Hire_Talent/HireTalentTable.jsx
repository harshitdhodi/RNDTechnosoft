import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HireTalentTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState({
    heading: '',
    subHeading: '',
    cardInfo: '',
    pageSection: 'Team Service',
    photo: '',
    altImg: '',
    imgTitle: ''
  });

  const pageSectionOptions = ['Team Service', 'Applications', 'Why Choose'];

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hire-talent');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('API Response:', result); // Debug log
      
      // Handle different response formats
      let dataArray;
      if (Array.isArray(result)) {
        dataArray = result;
      } else if (result.data && Array.isArray(result.data)) {
        dataArray = result.data;
      } else if (result.hireTalents && Array.isArray(result.hireTalents)) {
        dataArray = result.hireTalents;
      } else {
        console.warn('Unexpected API response format:', result);
        dataArray = [];
      }
      
      setData(dataArray);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
      console.error('Error fetching data:', err);
      setData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/hire-talent/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setData(data.filter(item => item._id !== id));
      } catch (err) {
        setError('Failed to delete item: ' + err.message);
        console.error('Error deleting item:', err);
      }
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/hire-talent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newForm),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newItem = await response.json();
      setData([...data, newItem]);
      setNewForm({
        heading: '',
        subHeading: '',
        cardInfo: '',
        pageSection: 'Team Service',
        photo: '',
        altImg: '',
        imgTitle: ''
      });
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add item: ' + err.message);
      console.error('Error adding item:', err);
    }
  };

  const getSectionBadgeColor = (section) => {
    switch (section) {
      case 'Team Service': return 'bg-blue-100 text-blue-800';
      case 'Applications': return 'bg-green-100 text-green-800';
      case 'Why Choose': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Hire Talent Management</h1>
        <button
          onClick={() => navigate('/add-hire-talent')}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          <Plus size={20} />
          Add New Item
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Data Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
<<<<<<< HEAD
=======
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
                    Heading
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sub Heading
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Section
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(data) && data.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
<<<<<<< HEAD
=======
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={`/api/logo/download/${item.photo}`}
                        alt={item.altImg}
                        title={item.imgTitle}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.heading}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{item.subHeading}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSectionBadgeColor(item.pageSection)}`}>
                        {item.pageSection}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/edit-hire-table/${item._id}`)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No hire talent items found</div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Item
          </button>
        </div>
      )}
    </div>
  );
};

export default HireTalentTable;