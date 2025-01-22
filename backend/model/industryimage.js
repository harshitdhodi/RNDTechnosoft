const mongoose = require('mongoose');

// Assuming you have an IndustryCategory model defined elsewhere
const industryImageSchema = new mongoose.Schema({
    images: {
        type: String,
        // Make sure to require the images field if necessary
    },
    alt: {
        type: String,
        default: '',
    },
    imgtitle: { type: String, default: '' }, // Optional: Alternate text for images

    categoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'IndustriesCategory' }], // Reference to IndustryCategory model
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    photoType: {
        type: String,
        enum: ['industry', 'company'], // Define the allowed values for photoType
    },
    slug: {
        type: String,
        trim: true,
    },

    subcategory: {
        type: mongoose.Schema.Types.ObjectId, // Reference to IndustryCategory
        ref: 'IndustriesCategory',
    },
    subsubcategory: {
        type: mongoose.Schema.Types.ObjectId, // Reference to IndustryCategory
        ref: 'IndustriesCategory',
    },
    isVisible: {
        type: Boolean,
        default: true,
    },
    headingType: {
        type: String,
        enum: [
            'main', 'sub', 'subsub'
        ],
    },
});

// Middleware to update `updatedAt` field
industryImageSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const IndustryImage = mongoose.model('IndustryImage', industryImageSchema);

module.exports = IndustryImage;
