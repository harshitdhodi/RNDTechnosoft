const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Design Process Schema
const DesignProcessSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subheading: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
    },
    image: {
        type: String, // Change to Buffer to store binary data
        required: true,
    },
    alt: { // Add field for alternative text
        type: String,
        required: true,
    },
    imgtitle: { // Add field for alternative text
        type: String,
        required: true,
    },
    hours: {
        type: String, // Change to String to accept ranges like "1-3 days"
        required: true,
    },
    priority: {
        type: Number, // Using Number to enforce unique priorities
        required: true,
        unique: true, // Ensure that no two priorities are the same
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCategory',
        required: true,
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
          'main','sub','subsub'],
        
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
        required: true,
        trim: true,
      },
});

// Update the updatedAt field before saving
DesignProcessSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create the model
const DesignProcess = mongoose.model('DesignProcess', DesignProcessSchema);

module.exports = DesignProcess;
