const HomeHero = require('../model/homeHero');
const OurStaff = require('../model/ourStaff')
// Create a new HomeHero entry
exports.createHomeHero = async (req, res) => {
    try {
        // Create a new HomeHero object using the fields from the request body
        const homeHero = new HomeHero({
            labels: req.body.labels || [], // Array of labels
            smallCircles: req.body.smallCircles || [], // Array of small circle colors
            heading: {
                highlightedWords: req.body.heading.highlightedWords || [], // Array of highlighted words
                beforeHighlight: req.body.heading.beforeHighlight, // Text before highlighting
                afterHighlight: req.body.heading.afterHighlight // Text after highlighting
            },
            paragraph: {
                text: req.body.paragraph.text // Paragraph text
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Save the new HomeHero entry to the database
        const savedHomeHero = await homeHero.save();
        
        // Respond with the created HomeHero entry
        res.status(201).json(savedHomeHero);
    } catch (error) {
        // Respond with an error message if there's an issue
        console.error('Error creating HomeHero:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get all HomeHeroes
exports.getAllHomeHeros = async (req, res) => {
    try {
        const homeHeros = await HomeHero.find();
        res.status(200).json(homeHeros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





// Update an existing HomeHero entry
exports.updateHomeHero = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the HomeHero by ID and update with new data from the request body
        const updatedHomeHero = await HomeHero.findByIdAndUpdate(
            id,
            {
                labels: req.body.labels || [], // Update labels
                smallCircles: req.body.smallCircles || [], // Update small circles
                heading: {
                    highlightedWords: req.body.heading.highlightedWords || [], // Update highlighted words
                    beforeHighlight: req.body.heading.beforeHighlight, // Update beforeHighlight
                    afterHighlight: req.body.heading.afterHighlight // Update afterHighlight
                },
                paragraph: {
                    text: req.body.paragraph.text // Update paragraph text
                },
                updatedAt: new Date(), // Update the timestamp
            },
            { new: true } // Return the updated document
        );

        if (!updatedHomeHero) {
            return res.status(404).json({ message: 'HomeHero not found' });
        }

        // Respond with the updated HomeHero entry
        res.status(200).json(updatedHomeHero);
    } catch (error) {
        console.error('Error updating HomeHero:', error);
        res.status(400).json({ message: error.message });
    }
};
exports.deleteLabel = async (req, res) => {
    const { id } = req.params; // HomeHero ID
    const { _id } = req.body.label; // Get the _id of the label to be deleted

    try {
        const updatedHomeHero = await HomeHero.findByIdAndUpdate(
            id,
            { $pull: { labels: { _id } } }, // Remove the label matching the provided _id
            { new: true } // Return the updated document
        );

        if (!updatedHomeHero) {
            return res.status(404).json({ message: 'HomeHero not found' });
        }

        // Respond with the updated HomeHero entry
        res.status(200).json(updatedHomeHero);
    } catch (error) {
        console.error('Error deleting label:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a highlighted text from a HomeHero entry
exports.deleteHighlightedText = async (req, res) => {
    const { id } = req.params; // HomeHero ID
    const { text } = req.body; // Highlighted text to be deleted

    try {
        const updatedHomeHero = await HomeHero.findByIdAndUpdate(
            id,
            { $pull: { 'heading.highlightedWords': text } }, // Remove the highlighted text matching the provided text
            { new: true } // Return the updated document
        );

        if (!updatedHomeHero) {
            return res.status(404).json({ message: 'HomeHero not found' });
        }

        // Respond with the updated HomeHero entry
        res.status(200).json(updatedHomeHero);
    } catch (error) {
        console.error('Error deleting highlighted text:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a small circle color from a HomeHero entry
exports.deleteSmallCircle = async (req, res) => {
    const { id } = req.params; // HomeHero ID
    const { color } = req.body; // Color of the small circle to be deleted

    try {
        const updatedHomeHero = await HomeHero.findByIdAndUpdate(
            id,
            { $pull: { smallCircles: { color } } }, // Remove the small circle matching the provided color
            { new: true } // Return the updated document
        );

        if (!updatedHomeHero) {
            return res.status(404).json({ message: 'HomeHero not found' });
        }

        // Respond with the updated HomeHero entry
        res.status(200).json(updatedHomeHero);
    } catch (error) {
        console.error('Error deleting small circle:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.getStaff = async (req, res) => {
    try {
        // Set the limit to 10 for the first 10 staff photos
        const limit = 8;

        const count = await OurStaff.countDocuments();
        const ourstaff = await OurStaff.find()
            .select('photo') // Select only the 'photo' field
            .limit(limit); // Limit the results to 10

        res.status(200).json({
            data: ourstaff,
            total: count,
            currentPage: 1, // Set current page to 1 since we're only fetching the first 10
            hasNextPage: count > limit // Check if there are more than 10 staff members
        });

    } catch (error) {
        console.error(error);
        let errorMessage = 'Error fetching staff photos';
        if (error.name === 'CastError') {
            errorMessage = 'Invalid query parameter format';
        }
        res.status(500).json({ message: errorMessage });
    }
}