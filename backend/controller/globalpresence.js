const axios = require('axios');
const GlobalPresence = require('../model/globalpresence');
const path=require('path')
const fs=require('fs')

// Fetch all countries
const getCountries = async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const countries = response.data.map(country => ({
      name: country.name.common,
      latlng: country.latlng,
    }));
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching countries' });
  }
};

// Add a new global presence entry
const addGlobalPresence = async (req, res) => {
  const { country, description,alt } = req.body;

  const photo=req.file.filename;
  try {
    const newEntry = new GlobalPresence({ country, description, photo,alt });
    await newEntry.save();
    res.status(201).json({ message: 'Global presence entry added successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error adding global presence entry' });
  }
};

// Fetch all global presence entries
const getGlobalPresenceEntries = async (req, res) => {
  try {
    const entries = await GlobalPresence.find();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching global presence entries' });
  }
};

const deleteGlobalPresence = async (req, res) => {
    const {id} = req.query;

    try {
        const globalPresence = await GlobalPresence.findById(id); 
    
          const filePath = path.join(__dirname, '../logos', globalPresence.photo);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); 
          } else {
            console.warn(`File not found: ${filename}`);
          }
        
    
        const deletedEntry = await GlobalPresence.findByIdAndDelete(id);

        if (!deletedEntry) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        res.status(200).json({ message: 'Entry deleted successfully', deletedEntry });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
  getCountries,
  addGlobalPresence,
  getGlobalPresenceEntries,
  deleteGlobalPresence
};
