import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    [{ 'direction': 'rtl' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  }
};

const MainContentEditor = ({
  heading,
  setHeading,
  description,
  setDescription,
  status,
  setStatus,
  photos,
  setPhotos,
  photoAlts,
  setPhotoAlts,
  video,
  setVideo,
  videoAlt,
  setVideoAlt,
  initialPhotos = [],
  initialPhotoAlts = [],
  initialVideoAlt,
  handleInitialAltTextChange,
  handleDeleteInitialPhoto,
  handleNewAltTextChange,
  handleDeleteNewPhoto,
  handleDeleteVideo,
}) => {
  
  const handleFileChange = (e) => {
    const newPhotos = Array.from(e.target.files);
    setPhotos([...photos, ...newPhotos]);
    setPhotoAlts([...photoAlts, ...Array(newPhotos.length).fill('')]);
    e.target.value = null; // Clear file input after upload
  };
  
  const handleVideoChange = (e) => {
    const selectedVideo = e.target.files[0];
    setVideo(selectedVideo);
    setVideoAlt(''); // Reset alt text when new video is uploaded
    e.target.value = null; // Clear file input after upload
  };

  return (
    <>
      <div className="mb-6">
        <label htmlFor="heading" className="block mb-2 font-bold">Heading</label>
        <ReactQuill
          value={heading}
          onChange={setHeading}
          modules={modules}
          className="border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block mb-2 font-bold">Description</label>
        <ReactQuill
          value={description}
          onChange={setDescription}
          modules={modules}
          className="border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="status" className="block mb-2 font-bold">Status</label>
        <input
          type="checkbox"
          id="status"
          checked={status}
          onChange={(e) => setStatus(e.target.checked)}
          className="mr-2"
        />
        <span>{status ? 'Active' : 'Inactive'}</span>
      </div>

      {initialPhotos.length > 0 && (
        <div className="mb-4">
          <label className="block font-semibold mb-2">Current Photos</label>
          {initialPhotos.map((photo, index) => (
            <div key={index} className="mb-2 flex items-center">
              <img                   src={`/api/image/download/${photo}`} alt={initialPhotoAlts[index]} className="w-24 h-24 object-cover mr-2" />
              <button type="button" onClick={() => handleDeleteInitialPhoto(index)} className="text-red-500">Delete</button>
              <input
                type="text"
                value={initialPhotoAlts[index]}
                onChange={(e) => handleInitialAltTextChange(index, e.target.value)}
                className="ml-2 border border-gray-300 rounded-md p-1"
                placeholder="Alt text"
              />
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <div className="mb-4">
          <label className="block font-semibold mb-2">New Photos</label>
          {photos.map((photo, index) => (
            <div key={index} className="mb-2 flex items-center">
              <img src={URL.createObjectURL(photo)} alt={photoAlts[index]} className="w-24 h-24 object-cover mr-2" />
              <button type="button" onClick={() => handleDeleteNewPhoto(index)} className="text-red-500">Delete</button>
              <input
                type="text"
                value={photoAlts[index] || ''}
                onChange={(e) => handleNewAltTextChange(index, e.target.value)}
                className="ml-2 border border-gray-300 rounded-md p-1"
                placeholder="Alt text"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="photo-upload" className="block mb-2 font-bold">Upload Photos</label>
        <input
          type="file"
          id="photo-upload"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="block"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="video-upload" className="block mb-2 font-bold">Upload Video</label>
        <input
          type="file"
          id="video-upload"
          accept="video/*"
          onChange={handleVideoChange}
          className="block"
        />
        {video && (
          <div className="mt-2">
            <video controls className="w-full">
              <source s type={video.type} />
              Your browser does not support the video tag.
            </video>
            <input
              type="text"
              value={videoAlt}
              onChange={(e) => setVideoAlt(e.target.value)}
              className="mt-2 border border-gray-300 rounded-md p-1"
              placeholder="Video Alt text"
            />
            <button type="button" onClick={handleDeleteVideo} className="text-red-500 mt-2 block">Delete Video</button>
          </div>
        )}
      </div>
    </>
  );
};

export default MainContentEditor;
