// controllers/HomeAnimationController.js
const HomeAnimation = require('../model/homeanimation');

// controllers/HomeAnimationController.js
const createHomeAnimation = async (req, res) => {
    try {
        // Extract text fields
        const {
            title, subtitle, description, paragraph, iconTitle, author,
            photoTitleName, photoAltName, iconPhotoTitleName, iconPhotoAltName, authPhotoTitleName, authPhotoAltName
        } = req.body;

        // Extract files from the request
        const videoFile = req.files.find(file => file.fieldname === 'video')?.filename;
        const photoFile = req.files.find(file => file.fieldname === 'photo')?.filename;
        const authPhotoFile = req.files.find(file => file.fieldname === 'authPhoto')?.filename;

        // Extract all iconPhotos from files
        const iconPhotos = req.files
            .filter(file => file.fieldname.startsWith('iconPhoto'))
            .map(file => file.filename);

        // Create a new HomeAnimation document
        const newHomeAnimation = new HomeAnimation({
            video: videoFile,
            photo: photoFile,
            photoTitleName: photoTitleName || '',  // Title for the main photo
            photoAltName: photoAltName || '',        // Alt text for the main photo
            iconPhotoTitleName: iconPhotoTitleName || '',  // Title for secondary image (e.g., icon photo)
            iconPhotoAltName: iconPhotoAltName || '',        // Alt text for secondary image
            authPhotoTitleName: authPhotoTitleName || '',  // Title for another image (e.g., additional icon photo)
            authPhotoAltName: authPhotoAltName || '',        // Alt text for another image
            title,
            subtitle,
            description,
            iconPhoto: iconPhotos, // List of filenames
            iconTitle: iconTitle || [], // List of titles
            paragraph,
            author,
            authPhoto: authPhotoFile,
        });

        // Save the new document to the database
        await newHomeAnimation.save();

        // Respond with success message
        res.status(201).json({
            message: 'HomeAnimation created successfully',
            data: newHomeAnimation,
        });
    } catch (error) {
        console.error('Error creating HomeAnimation:', error);
        res.status(500).json({
            message: 'Error creating HomeAnimation',
            error: error.message,
        });
    }
};
 
// Get HomeAnimations
const getHomeAnimations = async (req, res) => {
    try {
        const homeAnimations = await HomeAnimation.find(); // Fetch all records
        res.status(200).json({ message: 'HomeAnimations fetched successfully', data: homeAnimations });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching HomeAnimations', error: error.message });
    }
};


const getHomeAnimationById = async (req, res) => {
    try {
        const { id } = req.query;
        const homeAnimation = await HomeAnimation.findById(id);

        if (!homeAnimation) {
            return res.status(404).json({ message: 'HomeAnimation not found' });
        }

        res.status(200).json({ message: 'HomeAnimation fetched successfully', data: homeAnimation });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching HomeAnimation', error: error.message });
    }
};


const updateHomeAnimation = async (req, res) => {
    try {
        const { id } = req.query;
        const files = req.files || [];
        const {
            title, subtitle, description, iconTitle, paragraph, author,
            photoTitleName, photoAltName, iconPhotoTitleName, iconPhotoAltName, authPhotoTitleName, authPhotoAltName
        } = req.body;

        // Initialize an empty object to hold the update data
        const updateData = {};

        // Fetch the existing document from the database
        const existingHomeAnimation = await HomeAnimation.findById(id);

        if (!existingHomeAnimation) {
            return res.status(404).json({ message: 'HomeAnimation not found' });
        }

        // Process files and add to updateData if they exist
        files.forEach(file => {
            const field = file.fieldname.split('[')[0]; // Extract field name from iconPhoto[0], iconPhoto[1], etc.
            switch (field) {
                case 'video':
                    updateData.video = file.filename;
                    break;
                case 'photo':
                    updateData.photo = file.filename;
                    break;
                case 'authPhoto':
                    updateData.authPhoto = file.filename;
                    break;
                case 'iconPhoto':
                    // Determine the index from iconPhoto[0], iconPhoto[1], etc.
                    const indexMatch = file.fieldname.match(/\[(\d+)\]/);
                    if (indexMatch) {
                        const index = parseInt(indexMatch[1], 10);
                        const updatedIconPhotos = [...existingHomeAnimation.iconPhoto];
                        updatedIconPhotos[index] = file.filename;
                        updateData.iconPhoto = updatedIconPhotos;
                    } else {
                        updateData.iconPhoto = [...(updateData.iconPhoto || existingHomeAnimation.iconPhoto), file.filename];
                    }
                    break;
                default:
                    break;
            } 
        });

        // Add non-file fields to updateData if they exist in the request
        if (title) updateData.title = title;
        if (subtitle) updateData.subtitle = subtitle;
        if (description) updateData.description = description;
        if (paragraph) updateData.paragraph = paragraph;
        if (author) updateData.author = author;
        if (photoTitleName) updateData.photoTitleName = photoTitleName;
        if (photoAltName) updateData.photoAltName = photoAltName;
        if (iconPhotoTitleName) updateData.iconPhotoTitleName = iconPhotoTitleName;
        if (iconPhotoAltName) updateData.iconPhotoAltName = iconPhotoAltName;
        if (authPhotoTitleName) updateData.authPhotoTitleName = authPhotoTitleName;
        if (authPhotoAltName) updateData.authPhotoAltName = authPhotoAltName;

        // Handle icon titles update
        if (iconTitle && Array.isArray(iconTitle)) {
            const updatedIconTitles = [...existingHomeAnimation.iconTitle];
            iconTitle.forEach((title, index) => {
                if (title) {
                    updatedIconTitles[index] = title;
                }
            });
            updateData.iconTitle = updatedIconTitles;
        } else {
            updateData.iconTitle = existingHomeAnimation.iconTitle;
        }

        // Update the document
        const updatedHomeAnimation = await HomeAnimation.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedHomeAnimation) {
            return res.status(404).json({ message: 'HomeAnimation not found' });
        }

        res.status(200).json({ message: 'HomeAnimation updated successfully', data: updatedHomeAnimation });
    } catch (error) {
        res.status(500).json({ message: 'Error updating HomeAnimation', error: error.message });
    }
};


const deleteHomeAnimation = async (req, res) => {
    try {
        const { id } = req.query;
        const deletedHomeAnimation = await HomeAnimation.findByIdAndDelete(id);

        if (!deletedHomeAnimation) {
            return res.status(404).json({ message: 'HomeAnimation not found' });
        }

        res.status(200).json({ message: 'HomeAnimation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting HomeAnimation', error: error.message });
    }
};


const getLatestHomeAnimations = async (req, res) => {
    try {
        // Fetch the latest 4 records, sorted by creation date in descending order
        const homeAnimations = await HomeAnimation.find()
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .limit(4); // Limit the results to the latest 4 records

        res.status(200).json({ 
            message: 'Latest 4 HomeAnimations fetched successfully', 
            data: homeAnimations 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching HomeAnimations', 
            error: error.message 
        });
    }
};

const deleteImgvideo = async (req, res) => {
    const { id } = req.query;
    const { video, photo, iconPhotos, authPhoto } = req.body;

    try {
        // Find the document by ID
        const homeAnimation = await HomeAnimation.findById(id);

        if (!homeAnimation) {
            return res.status(404).json({ message: 'HomeAnimation not found' });
        }

        // 1. Handle video deletion: Video only
        if (video && homeAnimation.video === video) {
            homeAnimation.video = '';
            // No need to delete any title or alt text
        }

        // 2. Handle photo deletion: Photo and its associated title and alt text
        if (photo && homeAnimation.photo === photo) {
            homeAnimation.photo = '';
            homeAnimation.photoTitleName = ''; // Assuming photoTitleName is associated with the photo
            homeAnimation.photoAltName = '';    // Assuming photoAltName is associated with the photo
        }

        // 3. Handle iconPhoto deletion: Specific iconPhotos and their associated title and alt text
        if (Array.isArray(iconPhotos)) {
            const updatedIconPhotos = [...homeAnimation.iconPhoto];
            const updatedImageTitles = [...homeAnimation.iconPhotoTitleName];
            const updatedAltTexts = [...homeAnimation.iconPhotoAltName];

            // Remove specified iconPhotos and their associated titles/alt texts
            iconPhotos.forEach(iconPhotoToDelete => {
                const index = updatedIconPhotos.indexOf(iconPhotoToDelete);
                if (index !== -1) {
                    updatedIconPhotos.splice(index, 1);
                    updatedImageTitles.splice(index, 1);
                    updatedAltTexts.splice(index, 1);
                }
            });

            homeAnimation.iconPhoto = updatedIconPhotos;
            homeAnimation.iconPhotoTitleName = updatedImageTitles;
            homeAnimation.iconPhotoAltName = updatedAltTexts;
        }

        // 4. Handle authPhoto deletion: authPhoto and its associated title and alt text
        if (authPhoto && homeAnimation.authPhoto === authPhoto) {
            homeAnimation.authPhoto = '';
            homeAnimation.authPhotoTitleName = ''; // Assuming authPhotoTitleName is associated with authPhoto
            homeAnimation.authPhotoAltName = '';    // Assuming authPhotoAltName is associated with authPhoto
        }

        // Save the updated document
        await homeAnimation.save();

        res.status(200).json({ message: 'Media deleted successfully', homeAnimation });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting media', error });
    }
};


  module.exports = {createHomeAnimation,getLatestHomeAnimations , deleteImgvideo , getHomeAnimations ,updateHomeAnimation, getHomeAnimationById , deleteHomeAnimation}
// Add other controller functions as needed (e.g., update, delete, get)
  