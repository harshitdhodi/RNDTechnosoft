import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup,useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaMapMarkerAlt } from "react-icons/fa";
import ReactDOMServer from 'react-dom/server';

const App = () => {
    const createCustomIcon = (icon) => {
        return L.divIcon({
            html: ReactDOMServer.renderToString(icon),
            iconSize: [32, 32],
            className: '',
        });
    };

    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [logos, setLogos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [photo, setPhoto] = useState(null);
    const [description, setDescription] = useState('');
    const [altText, setAltText] = useState('');
    const [countryOptions, setCountryOptions] = useState([]);
    const [interactive, setInteractive] = useState(false);
    const position = [40.7128, -74.0060]; 

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('/api/globalpresence/countries');
                setCountries(response.data);
                const countryNames = response.data.map(country => country.name);
                setCountryOptions(countryNames);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchLogos = async () => {
            try {
                const response = await axios.get('/api/globalpresence/globalPresenceEntries');
                setLogos(response.data);
            } catch (error) {
                console.error('Error fetching logos:', error);
            }
        };
        fetchLogos();
    }, []);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setPhoto(file);
    };

    const handleAddLogo = async () => {
        const formData = new FormData();
        formData.append('country', selectedCountry.name);
        formData.append('description', description);
        formData.append('photo', photo);
        formData.append('alt', altText);

        try {
            await axios.post('/api/globalpresence/addGlobalPresence', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            setPhoto(null);
            setDescription('');
            setAltText('');

            const response = await axios.get('/api/globalpresence/globalPresenceEntries');
            setLogos(response.data);
        } catch (error) {
            console.error('Error adding logo:', error);
        }
    };

    const handleDeleteImage = () => {
        setPhoto(null);
    };

    const handleSelectCountry = (countryName) => {
        const country = countries.find(country => country.name === countryName);
        setSelectedCountry(country);
    };

    const handleDeleteLogo = async (id) => {
        try {
            await axios.delete(`/api/globalpresence/deleteGlobalPresence?id=${id}`, {
                withCredentials: true
            });

            setLogos(logos.filter(logo => logo._id !== id));
        } catch (error) {
            console.error('Error deleting logo:', error);
        }
    };

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const MapEvents = () => {
        useMapEvents({
            click: () => {
                setInteractive(true);
            },
            dblclick: () => {
                setInteractive(true);
            }
        });
        return null;
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold  text-gray-700 font-serif uppercase mb-4">Global Presence</h1>
            <div className="mb-4">
                <input
                    list="countries"
                    type="text"
                    placeholder="Search Country"
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); handleSelectCountry(e.target.value) }}
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <datalist id="countries">
                    {countryOptions.map((country, index) => (
                        <option key={index} value={country} />
                    ))}
                </datalist>
            </div>
            {searchTerm && (
                <div className="mb-4">
                    <div className="mb-8">
                        <label htmlFor="photo" className="block font-semibold mb-2">
                            Photo
                        </label>
                        <input
                            type="file"
                            name="photo"
                            id="photo"
                            onChange={handlePhotoChange}
                            className="border rounded focus:outline-none"
                            accept="image/*"
                        />
                        <div className="mb-4">
                            <label htmlFor="alt" className="block font-semibold mb-2">
                                Alternative Text
                            </label>
                            <input
                                type="text"
                                id="alt"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none"
                                required
                            />
                        </div>
                        {photo && (
                            <div className="mt-2 w-56 relative group">
                                <img
                                    src={URL.createObjectURL(photo)}
                                    alt="Gallery"
                                    className="h-32 w-56 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleDeleteImage}
                                    className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
                                >
                                    X
                                </button>
                            </div>
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <button
                        onClick={handleAddLogo}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Add Logo
                    </button>
                </div>
            )}
            <MapContainer
                style={{ height: '500px', width: '100%' }}
                center={position}
                scrollWheelZoom={false}
                zoom={3}
                className="mb-4"

            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    noWrap={true}
                />
                {logos.map(logo => {
                    const country = countries.find(c => c.name === logo.country);
                    return (
                        country && (
                            <Marker key={logo._id} position={country.latlng} icon={createCustomIcon(<FaMapMarkerAlt size={32} color="red" />)}>
                                <Popup minWidth={100}>
                                    <img src={`/api/logo/download/${logo.photo}`} alt={logo.alt} className="w-24 h-18" />
                                    <p className='font-semibold font-serif'>{logo.country}</p>
                                    <p>{logo.description}</p>
                                    <button
                                        onClick={() => handleDeleteLogo(logo._id)}
                                        className="mt-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                                    >
                                        Delete Marker
                                    </button>
                                </Popup>
                                <MapEvents />
                            </Marker>
                        )
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default App;
