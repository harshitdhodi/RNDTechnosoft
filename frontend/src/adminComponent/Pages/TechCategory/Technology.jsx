import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TechnologyManager = () => {
  const [technologies, setTechnologies] = useState([]);
  const [formData, setFormData] = useState({
    photo: null,
    alt: '',
    imgTitle: '',
    slug: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch all technologies
  const fetchTechnologies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/technology');
      setTechnologies(response.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch technologies');
    } finally {
      setLoading(false);
    }
  };

  // Load technologies on component mount
  useEffect(() => {
    fetchTechnologies();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Basic slug validation: lowercase, no spaces, only alphanumeric and hyphens
    if (name === 'slug') {
      const formattedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '')
        .replace(/\s+/g, '-');
      setFormData({ ...formData, [name]: formattedSlug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle file input change with validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a JPEG, PNG, or GIF image');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setFormData({ ...formData, photo: file });
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, photo: null });
      setPreviewUrl(null);
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.alt.trim()) {
      toast.error('Alt text is required');
      return false;
    }
    if (!formData.imgTitle.trim()) {
      toast.error('Image title is required');
      return false;
    }
    if (!formData.slug.trim()) {
      toast.error('Slug is required');
      return false;
    }
    if (!editingId && !formData.photo) {
      toast.error('Photo is required for new technology');
      return false;
    }
    return true;
  };

  // Handle form submission (Add/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    const data = new FormData();
    if (formData.photo) data.append('photo', formData.photo);
    data.append('alt', formData.alt);
    data.append('imgTitle', formData.imgTitle);
    data.append('slug', formData.slug);

    try {
      if (editingId) {
        await axios.put(`/api/technology/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Technology updated successfully');
      } else {
        await axios.post('/api/technology', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Technology added successfully');
      }
      resetForm();
      fetchTechnologies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save technology');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/technology/${id}`);
      const tech = response.data.data;
      setFormData({
        photo: null,
        alt: tech.alt,
        imgTitle: tech.imgTitle,
        slug: tech.slug || ''
      });
      setEditingId(id);
      setPreviewUrl(tech.photo ? `/api/logo/download/${tech.photo}` : null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch technology details');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this technology?')) {
      setLoading(true);
      try {
        await axios.delete(`/api/technology/${id}`);
        toast.success('Technology deleted successfully');
        fetchTechnologies();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete technology');
      } finally {
        setLoading(false);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ photo: null, alt: '', imgTitle: '', slug: '' });
    setEditingId(null);
    setError('');
    setPreviewUrl(null);
    document.getElementById('photo').value = null;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Technology Manager</h1>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Form */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Technology' : 'Add Technology'}</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Photo</label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
              disabled={loading}
            />
            {editingId && <p className="text-sm text-gray-500 mt-1">Select a new file to update the photo</p>}
            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">Image Preview:</p>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-10 h-10 object-contain border rounded mt-2"
                />
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Alt Text</label>
            <input
              type="text"
              name="alt"
              value={formData.alt}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter alt text"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image Title</label>
            <input
              type="text"
              name="imgTitle"
              value={formData.imgTitle}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter image title"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter slug (e.g., react-js)"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">Use lowercase letters, numbers, and hyphens only</p>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Processing...' : editingId ? 'Update' : 'Add'} Technology
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Technologies List</h2>
        {loading && <div className="text-center">Loading...</div>}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Photo</th>
              <th className="border p-2">Alt Text</th>
              <th className="border p-2">Image Title</th>
              <th className="border p-2">Slug</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {technologies.length > 0 ? (
              technologies.map((tech) => (
                <tr key={tech._id} className="hover:bg-gray-100">
                  <td className="border p-2">
                    {tech.photo && (
                      <img
                        src={`/api/logo/download/${tech.photo}`}
                        alt={tech.alt}
                        className="w-16 h-16 object-contain"
                      />
                    )}
                  </td>
                  <td className="border p-2">{tech.alt}</td>
                  <td className="border p-2">{tech.imgTitle}</td>
                  <td className="border p-2">{tech.slug}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(tech._id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 disabled:bg-yellow-300"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tech._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:bg-red-300"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border p-2 text-center">No technologies found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TechnologyManager;