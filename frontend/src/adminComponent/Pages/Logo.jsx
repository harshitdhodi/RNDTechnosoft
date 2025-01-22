import React, { useState, useEffect } from 'react';
import axios from 'axios';

const logoTypes = [
  { type: 'headerColor', label: 'Header Color' },
  { type: 'headerWhite', label: 'Header White' },
  { type: 'footerColor', label: 'Footer Color' },
  { type: 'footerWhite', label: 'Footer White' },
  { type: 'favicon', label: 'Favicon' },
];

const LogoCRUD = () => {
  const [logos, setLogos] = useState({});
  const [altTexts, setAltTexts] = useState({});
  const [imgtitle, setImgtitle] = useState({});
  const [logoFiles, setLogoFiles] = useState({});


  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      const response = await axios.get('/api/logo', { withCredentials: true });
      const logosData = {};
      response.data.forEach(logo => {
        logosData[logo.type] = logo;
      });
      setLogos(logosData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    setLogoFiles(prevState => ({ ...prevState, [type]: files }));
    const filePreviews = files.map(file => URL.createObjectURL(file));
  };

  const handleAltChange = (e, type) => {
    setAltTexts(prevState => ({ ...prevState, [type]: e.target.value }));
  };
  const handleImgtitleChange = (e, type) => {
    setImgtitle(prevState => ({ ...prevState, [type]: e.target.value }));
  };
  const handleUpload = async (type) => {
    try {
      if (!logoFiles[type] || logoFiles[type].length === 0) {
        console.error('No logo files selected');
        return;
      }

      const formData = new FormData();
      logoFiles[type].forEach(file => {
        formData.append('photo', file);
      });
      formData.append('alt', altTexts[type]);
      formData.append('imgtitle', imgtitle[type]);
      formData.append('type', type);

      await axios.post('/api/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      fetchLogos();
      setAltTexts(prevState => ({ ...prevState, [type]: '' }));
      setImgtitle(prevState => ({ ...prevState, [type]: '' }));

      setLogoFiles(prevState => ({ ...prevState, [type]: '' }));

    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (imageName, type) => {
    try {
      await axios.delete(`/api/logo/${imageName}`, { withCredentials: true });
      fetchLogos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-xl font-bold  text-gray-700 font-serif uppercase mb-8 text-center">MANAGE LOGOS</h1>
      {logoTypes.map((logoType) => (
        <div key={logoType.type} className="mb-6 flex flex-col md:flex-row gap-2 bg-gray-200 justify-around rounded-md">
          <div>
            <h2 className="text-xl font-medium mb-2 mt-4 font-serif">{logoType.label}</h2>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, logoType.type)}
              className="mb-4 mt-8"
            />
            <div className="mb-4">
              <label htmlFor={`alt-${logoType.type}`} className="block font-semibold mb-2">
                Alternative Text
              </label>
              <input
                type="text"
                id={`alt-${logoType.type}`}
                value={altTexts[logoType.type] || ''}
                onChange={(e) => handleAltChange(e, logoType.type)}
                className="p-2 border rounded focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor={`imgtitle-${logoType.type}`} className="block font-semibold mb-2">
                Image title Text
              </label>
              <input
                type="text"
                id={`imgtitle-${logoType.type}`}
                value={imgtitle[logoType.type] || ''}
                onChange={(e) => handleImgtitleChange(e, logoType.type)}
                className="p-2 border rounded focus:outline-none"
                required
              />
            </div>
            <button
              onClick={() => handleUpload(logoType.type)}
              className="bg-blue-500 text-white py-2 px-4 rounded mr-4 mb-2"
            >
              Upload
            </button>
          </div>
          <div className="max-w-96">
            {logos[logoType.type] && (
              <div key={logos[logoType.type]._id} className=" p-4 mt-6">
                <img
                  src={`/api/logo/download/${logos[logoType.type].photo}`}
                  alt="Logo"
                  className=" "
                />
               
                <div className="mt-4">
                  <label htmlFor={`alt-${logos[logoType.type]._id}`} className="block font-semibold mb-2">
                    Alternative Text
                  </label>
                  <input
                    type="text"
                    id={`alt-${logos[logoType.type]._id}`}
                    value={logos[logoType.type].alt}
                    readOnly
                    className="p-2 border rounded focus:outline-none"
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor={`imgtitle-${logos[logoType.type]._id}`} className="block font-semibold mb-2">
                    Image Title Text
                  </label>
                  <input
                    type="text"
                    id={`imgtitle-${logos[logoType.type]._id}`}
                    value={logos[logoType.type].imgtitle}
                    readOnly
                    className="p-2 border rounded focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => handleDelete(logos[logoType.type].photo, logoType.type)}
                  className="bg-red-500 text-white py-2 px-4 rounded mr-4 mt-4"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LogoCRUD;
