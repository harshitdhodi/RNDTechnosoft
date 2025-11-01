const AboutUsPoints = require('../model/aboutuspoints');

// Create a new AboutUsPoint
exports.createAboutUsPoint = async (req, res) => {
    try {
        const newAboutUsPoint = new AboutUsPoints({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status || 'active'  // Default to 'active' if status is not provided
        });
        const savedAboutUsPoint = await newAboutUsPoint.save();
        res.status(201).json(savedAboutUsPoint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all AboutUsPoints
exports.getAllAboutUsPoints = async (req, res) => {
    try {
        const aboutUsPoints = await AboutUsPoints.find();
        res.status(200).json(aboutUsPoints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single AboutUsPoint by ID
exports.getAboutUsPointById = async (req, res) => {
    try {
        const { id } = req.query;
        const aboutUsPoint = await AboutUsPoints.findById(id);
        if (!aboutUsPoint) {
            return res.status(404).json({ message: 'AboutUsPoint not found' });
        }
        res.status(200).json(aboutUsPoint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an AboutUsPoint by ID
exports.updateAboutUsPoint = async (req, res) => {
    try {
        const { id } = req.query;
        const updatedAboutUsPoint = await AboutUsPoints.findByIdAndUpdate(
            id,
            {
                title: req.body.title,
                description: req.body.description,
                status: req.body.status || 'active'  // Default to 'active' if status is not provided
            },
            { new: true, runValidators: true }
        );
        if (!updatedAboutUsPoint) {
            return res.status(404).json({ message: 'AboutUsPoint not found' });
        }
        res.status(200).json(updatedAboutUsPoint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an AboutUsPoint by ID
exports.deleteAboutUsPoint = async (req, res) => {
    try {
        const {id}=req.query
        const deletedAboutUsPoint = await AboutUsPoints.findByIdAndDelete(id);
        if (!deletedAboutUsPoint) {
            return res.status(404).json({ message: 'AboutUsPoint not found' });
        }
        res.status(200).json({ message: 'AboutUsPoint deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
