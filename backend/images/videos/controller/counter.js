const Counter = require('../model/counter');
const path=require("path")
const fs=require("fs")

// Create a new Counter
exports.createCounter = async (req, res) => {
  try {
    const { title, no, sign,status,alt,imgtitle } = req.body;
    const photo = req.file.filename
    const newCounter = new Counter({ title, sign,no,photo,alt,imgtitle,status });
    await newCounter.save();
    res.status(201).json(newCounter);
  } catch (error) {
    res.status(500).json({ message: 'Error creating counter', error });
  }
};

// Get all Counters
exports.getCounters = async (req, res) => {
  try {
    const counters = await Counter.find();
    res.status(200).json(counters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching counters', error });
  }
};

// Get a single Counter by ID
exports.getCounterById = async (req, res) => {
  try {
    const { id } = req.query;
    const counter = await Counter.findById(id);
    if (!counter) {
      return res.status(404).json({ message: 'Counter not found' });
    }
    res.status(200).json(counter);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching counter', error });
  }
};

// Update a Counter by ID
exports.updateCounter = async (req, res) => {
  try {
    const { id } = req.query;
    const { title,alt,imgtitle, no,sign, status } = req.body;
    let photo = req.body.photo;

    if(req.file){
      photo=req.file.filename;
    }
    const updatedCounter = await Counter.findByIdAndUpdate(
      id,
      { title, no,alt,imgtitle, photo,sign, status },
      { new: true, runValidators: true }
    );
    if (!updatedCounter) {
      return res.status(404).json({ message: 'Counter not found' });
    }
    res.status(200).json(updatedCounter);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error updating counter', error });
  }
};

// Delete a Counter by ID
exports.deleteCounter = async (req, res) => {
  const { id } = req.query;
  try {
    const counter = await Counter.findById(id); 
    
    
      const filePath = path.join(__dirname, '../logos', counter.photo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); 
      } else {

        console.warn(`File not found: ${filename}`);
      }

    const deletedCounter = await Counter.findByIdAndDelete(id);
    if (!deletedCounter) {
      return res.status(404).json({ message: 'Counter not found' });
    }
    res.status(200).json({ message: 'Counter deleted successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error deleting counter', error });
  }
};
