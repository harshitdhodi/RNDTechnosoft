import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditAdminProfile() {
  const [admin, setAdmin] = useState({ firstname: '', lastname: '', email: '', photo: '' });
  const [newPhoto, setNewPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/admin/adminprofile', { withCredentials: true });
        setAdmin(response.data.admin);
        setPhotoPreview(`/api/logo/download/${response.data.admin.photo}`); // Set the existing photo URL
      } catch (error) {
        console.error('Error fetching admin profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append('email', admin.email);
      formData.append('firstname', admin.firstname);
      formData.append('lastname', admin.lastname);
      if (newPhoto) {
        formData.append('photo', newPhoto);
      }

      await axios.put('/api/admin/updateAdminprofile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      setIsLoading(false);
      toast.success('Profile updated successfully');
      window.location.href="https://rndtechnosoft.com/manageProfile"
    } catch (error) {
      setIsLoading(false);
      console.error('Error updating profile:', error);
      setErrors(error.response.data.errors || {});
      alert('Failed to update profile. Please check your inputs.');
    }
  };

  return (
    <div className="w-1/3 p-5">
      <ToastContainer/>
      <h2 className="text-2xl font-semibold font-serif text-center mb-5">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="firstname"
            value={admin.firstname}
            onChange={handleChange}
          />
          {errors.firstname && <p className="text-red-500 text-xs italic">{errors.firstname}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="lastname"
            value={admin.lastname}
            onChange={handleChange}
          />
          {errors.lastname && <p className="text-red-500 text-xs italic">{errors.lastname}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            name="email"
            value={admin.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Photo</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="file"
            name="photo"
            onChange={handleFileChange}
          />
          {errors.photo && <p className="text-red-500 text-xs italic">{errors.photo}</p>}
        </div>
        {photoPreview && (
          <div className="mb-4">
            <img src={photoPreview} alt="Photo Preview" className="w-32 h-32 object-cover rounded" />
          </div>
        )}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditAdminProfile;
