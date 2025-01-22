// controllers/career.controller.js
const Career = require('../model/careeroption');
const path = require('path')
const fs = require('fs')

// Create a new career
exports.createCareer = async (req, res) => {
    try {
        const { jobtitle, department, jobType, employmentType, requirement, description, alt, imgTitle } = req.body
        const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
        const newCareer = new Career({
            jobtitle,
            department,
            jobType,
            employmentType,
            requirement,
            description,
            alt,
            imgTitle,
            photo
        });
        await newCareer.save();
        res.status(201).json(newCareer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all careers
exports.getAllCareers = async (req, res) => {
    try {
        const careers = await Career.find();
        res.status(200).json(careers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getAllActiveCareers = async (req, res) => {
    try {
        const careers = await Career.find({ status: 'active' });
        res.status(200).json(careers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a single career by ID
exports.getCareerById = async (req, res) => {
    try {
        const { id } = req.query
        const career = await Career.findById(id);
        if (!career) {
            return res.status(404).json({ message: 'Career not found' });
        }
        res.status(200).json(career);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a career by ID
exports.updateCareer = async (req, res) => {
    const { id } = req.query;
    const updateFields = req.body;

    try {
        const existingCareerOption = await Career.findById(id);

        if (!existingCareerOption) {
            return res.status(404).json({ message: 'Career option not found' });
        }

        if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
            const newPhotoPaths = req.files['photo'].map(file => file.filename); // Using filename to get the stored file names
            updateFields.photo = [...existingCareerOption.photo, ...newPhotoPaths];
        } else {
            updateFields.photo = existingCareerOption.photo;
        }

        const updatedCareerOption = await Career.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedCareerOption);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deletePhotoAndAltText = async (req, res) => {
    const { id, imageFilename, index } = req.params;

    try {
        const careerOption = await Career.findById(id);

        if (!careerOption) {
            return res.status(404).json({ message: 'Career option not found' });
        }

        careerOption.photo = careerOption.photo.filter(photo => photo !== imageFilename);
        careerOption.alt.splice(index, 1);
        careerOption.imgTitle.splice(index, 1);

        await careerOption.save();

        const filePath = path.join(__dirname, '..', 'images', imageFilename);

        // Check if the file exists and delete it
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({ message: 'Photo and alt text deleted successfully' });
    } catch (error) {
        console.error('Error deleting photo and alt text:', error);
        res.status(500).json({ message: error.message });
    }
};
// Delete a career by ID
exports.deleteCareer = async (req, res) => {
    try {
        const { id } = req.query;
        const deletedCareer = await Career.findByIdAndDelete(id);

        if (!deletedCareer) {
            return res.status(404).json({ message: 'Career not found' });
        }

        // Assuming `deletedCareer.photo` contains the path to the image
        if (deletedCareer.photo) {
            // Construct the full path to the image file
            const imagePath = path.join(__dirname, '..', 'images', deletedCareer.photo);

            // Delete the image file
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting the image:', err);
                    return res.status(500).json({ message: 'Career deleted, but error deleting the image', error: err });
                }
            });
        }

        res.status(200).json({ message: 'Career deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


