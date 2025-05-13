import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AddNavbarData = () => {
    const [pagename, setPagename] = useState("");

    const [priorityOptions, setPriorityOptions] = useState([]);
    const [selectedPriority, setSelectedPriority] = useState(0); 
    const navigate = useNavigate();

    useEffect(() => {
        fetchPriorityOptions();
    }, []);

    const fetchPriorityOptions = async () => {
        try {
            const response = await axios.get('/api/navbar/getMenulisting', { withCredentials: true });
            const count = response.data.count;
            if (count > 0) {
                const options = Array.from({ length: count + 1 }, (_, i) => i + 1);
                setPriorityOptions(options);
            } else {
                setPriorityOptions([1]);
            }
        } catch (error) {
            console.error(error);
            setPriorityOptions([1]);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('pagename', pagename);
            formData.append('priority', selectedPriority);

            const response = await axios.post('/api/navbar/createMenulisting', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            setPagename("");
            navigate('/navbar-data');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Add Menulisting</h1>
            <div className="mb-4">
                <label htmlFor="pagename" className="block font-semibold mb-2">
                    Page Name
                </label>
                <input
                    type="text"
                    id="pagename"
                    value={pagename}
                    onChange={(e) => setPagename(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="priority" className="block font-semibold mb-2">
                    Priority
                </label>
                <select
                    id="priority"
                    className="w-full p-2 border rounded focus:outline-none"
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(parseInt(e.target.value))}
                    required
                >
                    {priorityOptions.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                Add Menu Listing
            </button>
        </form>
    );
};

export default AddNavbarData;
