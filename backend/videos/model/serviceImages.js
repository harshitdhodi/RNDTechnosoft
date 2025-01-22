const mongoose = require('mongoose');

// Assuming you have a ServiceCategory model defined elsewhere
const serviceImageSchema = new mongoose.Schema({
    images: {
        type: String,
        required: true, // Make sure to require the images field if necessary
    },
    alt: {
        type: String,
        default: '',
    },
    imgtitle: { type: String, default: '' }, // Optional: Alternate text for images

    categoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory' }], // Reference to ServiceCategory model
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    photoType: {
        type: String,
        enum: ['project', 'company'], // Define the allowed values for photoType
        required: true // Make it required if necessary
    }
    ,
    slug: {
        type: String,
        required: true,
        trim: true,
      },
   
      subcategory: {
        type: mongoose.Schema.Types.ObjectId, // Reference to ServiceCategory
        ref: 'ServiceCategory',
      },
      subsubcategory: {
        type: mongoose.Schema.Types.ObjectId, // Reference to ServiceCategory
        ref: 'ServiceCategory',
      },
      isVisible: {
        type: Boolean,
        default: true,
      },
      headingType: {
        type: String,
        enum: [
          'main','sub','subsub'],
        
      },
});

// Middleware to update `updatedAt` field
serviceImageSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const ServiceImage = mongoose.model('ServiceImage', serviceImageSchema);

module.exports = ServiceImage;
