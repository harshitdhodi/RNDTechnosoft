const mongoose = require('mongoose');

// Define the Question schema
const questionSchema = new mongoose.Schema({
    question: {
        type: String,

    },
    answer: {
        type: String,

    }
}, { _id: false }); // Disable automatic ID generation for subdocuments

// Define the Subsection schema
const subsectionSchema = new mongoose.Schema({
    photo: {
        type: String, // Assuming you store the image URL or path

    },
    photoAlt: { // New field for alternative text for the subsection photo
        type: String,

    },
    imgtitle: { // New field for alternative text for the subsection photo
        type: String,

    },
    title: {
        type: String,

    },
    description: {
        type: String,

    },
    serviceparentCategoryId: { type: String, ref: 'ServiceCategory' },
    servicesubCategoryId: { type: String, ref: 'ServiceCategory' },
    servicesubSubCategoryId: { type: String, ref: 'ServiceCategory' },

}, { _id: false }); // Disable automatic ID generation for subdocuments

// Define the main model schema
const contentSchema = new mongoose.Schema({
    photo: [{ type: String, required: false }], // Optional: URLs or paths to the photo(s)
    video: { type: String, required: false }, // Optional: URL or path to a video
    photoAlt: [{ // New field for alternative text for the main photo
        type: String,
        // Set to true if required
    }],

    videoAlt: { // New field for alternative text for the video
        type: String,
        required: false, // Set to true if required
    },
    imgtitle: [{ type: String, default: '' }], // Optional: Alternate text for images
    videotitle: { type: String, default: '' },
    heading: {
        type: String,

    },
    subheading: {
        type: String,
        required: false,
    },
    description: {
        type: String,

    },
    questions: {
        type: [questionSchema], // Array of questions, optional
        default: [] // Default to an empty array if not provided
    },
    subsections: {
        type: [subsectionSchema], // Array of subsections, optional
        default: [] // Default to an empty array if not provided
    },
    status: { type: Boolean, default: false },

    // New field added for content type
    contentType: {
        type: String,
        enum: [
            'webSolution',
            'homecard2',
            'bookcall',
            'whyPartnerus',
            'globalsolution',
            'challengesface',
            'howecanhelp',
            'ourservices',
            'homecard1',
            'premiumtemplates',
            'weareexpertsin',
            'everyplan'
        ],
        required: true // Ensure this field is required
    },
}, { timestamps: true }); // Include timestamps for createdAt and updatedAt

// Create the model
const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
