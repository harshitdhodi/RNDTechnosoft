const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Design Process Schema
const DesignProcessSchema = new Schema({
    title: {
        type: String,
        
        trim: true,
    },
    subheading: {
        type: String,
        
        trim: true,
    },
    description: {
        type: String,
        required: false,
    },
    image: {
        type: String, // Change to Buffer to store binary data
       
    },
    alt: { // Add field for alternative text
        type: String,
        
    },
    imgtitle: { // Add field for alternative text
        type: String,
        
    },
    // hours: {
    //     type: String, // Change to String to accept ranges like "1-3 days"
       
    // },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCategory',
       
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId, // Reference to ServiceCategory
        ref: 'ServiceCategory',
    },
    subsubcategory: {
        type: mongoose.Schema.Types.ObjectId, // Reference to ServiceCategory
        ref: 'ServiceCategory',
    },
    headingType: {
        type: String,
        enum: [
            'main', 'sub', 'subsub'],
    },
    isVisible: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }, slug: {
        type: String,
       
        trim: true,
    },
});

// Update the updatedAt field before saving
DesignProcessSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create the model
const DesignProcess = mongoose.model('DesignProcess', DesignProcessSchema);

module.exports = DesignProcess;
