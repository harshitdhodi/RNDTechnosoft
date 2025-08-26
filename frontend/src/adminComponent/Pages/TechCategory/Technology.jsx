import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TechnologyManager = () => {
  const [technologies, setTechnologies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    photo: null,
    alt: '',
    imgTitle: '',
    slug: '',
    category: ''
  }); 
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
<<<<<<< HEAD
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

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

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/techCategory');
<<<<<<< HEAD
=======
      console.log(res.data.data)
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      setCategories(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchTechnologies();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a JPEG, PNG, or GIF image');
        return;
      }
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
    if (!formData.category.trim()) {
      toast.error('Category is required');
      return false;
    }
    if (!editingId && !formData.photo) {
      toast.error('Photo is required for new technology');
      return false;
    }
    return true;
  };

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
    data.append('category', formData.category);

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
<<<<<<< HEAD
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save technology');
      setError(err.response?.data?.message || 'Failed to save technology');
=======
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save technology');
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/technology/${id}`);
      const tech = response.data.data;
      setFormData({
        photo: null,
        alt: tech.alt,
        imgTitle: tech.imgTitle,
        slug: tech.slug || '',
        category: tech.category?._id || ''
      });
      setEditingId(id);
<<<<<<< HEAD
      setPreviewUrl(tech.photo ? `/api/logo/download/${tech.photo}?t=${Date.now()}` : null);
      setIsEditModalOpen(true);
=======
      setPreviewUrl(tech.photo ? `/api/logo/download/${tech.photo}` : null);
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch technology details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
<<<<<<< HEAD
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/technology/${deleteId}`);
      toast.success('Technology deleted successfully');
      fetchTechnologies();
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete technology');
    } finally {
      setLoading(false);
=======
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
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    }
  };

  const resetForm = () => {
    setFormData({ photo: null, alt: '', imgTitle: '', slug: '', category: '' });
    setEditingId(null);
    setError('');
    setPreviewUrl(null);
<<<<<<< HEAD
    const photoInput = window.document.getElementById('photo');
    if (photoInput) {
      photoInput.value = null;
    }
    setIsEditModalOpen(false);
=======
    document.getElementById('photo').value = null;
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  };

  return (
    <div className="container mx-auto p-4">
<<<<<<< HEAD
      <h1 className="text-2xl font-bold mb-4 font-serif">Technology Manager</h1>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 font-serif">Add Technology</h2>
        {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-md">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium font-serif">Photo</label>
=======
      <h1 className="text-2xl font-bold mb-4">Technology Manager</h1>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Technology' : 'Add Technology'}</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Photo</label>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileChange}
<<<<<<< HEAD
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
=======
              className="w-full p-2 border rounded"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
              disabled={loading}
            />
            {editingId && <p className="text-sm text-gray-500 mt-1">Select a new file to update the photo</p>}
            {previewUrl && (
              <div className="mt-4">
<<<<<<< HEAD
                <p className="text-sm text-gray-700 font-serif">Image Preview:</p>
                <img src={previewUrl} alt="Preview" className="w-16 h-16 object-contain border rounded mt-2" />
=======
                <p className="text-sm text-gray-700">Image Preview:</p>
                <img src={previewUrl} alt="Preview" className="w-10 h-10 object-contain border rounded mt-2" />
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
              </div>
            )}
          </div>
          <div className="mb-4">
<<<<<<< HEAD
            <label className="block text-gray-700 font-medium font-serif">Alt Text</label>
=======
            <label className="block text-gray-700">Alt Text</label>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
            <input
              type="text"
              name="alt"
              value={formData.alt}
              onChange={handleInputChange}
<<<<<<< HEAD
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
=======
              className="w-full p-2 border rounded"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
              placeholder="Enter alt text"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
<<<<<<< HEAD
            <label className="block text-gray-700 font-medium font-serif">Image Title</label>
=======
            <label className="block text-gray-700">Image Title</label>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
            <input
              type="text"
              name="imgTitle"
              value={formData.imgTitle}
              onChange={handleInputChange}
<<<<<<< HEAD
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
=======
              className="w-full p-2 border rounded"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
              placeholder="Enter image title"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
<<<<<<< HEAD
            <label className="block text-gray-700 font-medium font-serif">Slug</label>
=======
            <label className="block text-gray-700">Slug</label>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
<<<<<<< HEAD
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
=======
              className="w-full p-2 border rounded"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
              placeholder="Enter slug (e.g., react-js)"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">Use lowercase letters, numbers, and hyphens only</p>
          </div>
          <div className="mb-4">
<<<<<<< HEAD
            <label className="block text-gray-700 font-medium font-serif">Category</label>
=======
            <label className="block text-gray-700">Category</label>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
<<<<<<< HEAD
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
=======
              className="w-full p-2 border rounded"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
              disabled={loading}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.heading}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
<<<<<<< HEAD
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Add Technology'}
            </button>
          </div>
        </form>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold font-serif">Edit Technology</h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-md">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium font-serif">Photo</label>
                <input
                  type="file"
                  id="edit-photo"
                  name="photo"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-1">Select a new file to update the photo</p>
                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 font-serif">Image Preview:</p>
                    <img src={previewUrl} alt="Preview" className="w-16 h-16 object-contain border rounded mt-2" />
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium font-serif">Alt Text</label>
                <input
                  type="text"
                  name="alt"
                  value={formData.alt}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter alt text"
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium font-serif">Image Title</label>
                <input
                  type="text"
                  name="imgTitle"
                  value={formData.imgTitle}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter image title"
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium font-serif">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter slug (e.g., react-js)"
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-1">Use lowercase letters, numbers, and hyphens only</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium font-serif">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.heading}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Update Technology'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold font-serif">Confirm Delete</h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-700 mb-4">Are you sure you want to delete this technology?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
=======
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
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
                disabled={loading}
              >
                Cancel
              </button>
<<<<<<< HEAD
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors duration-200"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 font-serif">Technologies List</h2>
        {loading && <div className="text-center text-gray-500">Loading...</div>}
=======
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Technologies List</h2>
        {loading && <div className="text-center">Loading...</div>}
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Photo</th>
              <th className="border p-2">Alt Text</th>
              <th className="border p-2">Image Title</th>
              <th className="border p-2">Slug</th>
              <th className="border p-2">Category</th>
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
<<<<<<< HEAD
                        src={`/api/logo/download/${tech.photo}?t=${Date.now()}`}
=======
                        src={`/api/logo/download/${tech.photo}`}
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
                        alt={tech.alt}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                  </td>
                  <td className="border p-2">{tech.alt}</td>
                  <td className="border p-2">{tech.imgTitle}</td>
                  <td className="border p-2">{tech.slug}</td>
                  <td className="border p-2">{tech.category?.name || 'N/A'}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(tech._id)}
<<<<<<< HEAD
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:bg-yellow-300 disabled:cursor-not-allowed transition-colors duration-200"
=======
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 disabled:bg-yellow-300"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tech._id)}
<<<<<<< HEAD
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors duration-200"
=======
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:bg-red-300"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border p-2 text-center">No technologies found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default TechnologyManager;
=======
export default TechnologyManager;
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
