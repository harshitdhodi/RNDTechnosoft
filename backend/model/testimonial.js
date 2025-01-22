const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the testimonial
const TestimonialSchema = new Schema({
  name: { type: String,}, // Name of the person giving the testimonial
  designation: { type: String,}, // Designation of the person
  testimony: { type: String, }, // Testimonial text
  photo: [{ type: String, required: false }], // Optional: URLs or paths to the photo(s)
  video: { type: String, required: false }, // Optional: URL or path to a video
  rating: {
    type: Number,
    required: false,
    min: 1, // Minimum rating
    max: 5 // Maximum rating
  }, // Optional: Rating given by the person
  description: { type: String, required: false }, // Optional: Additional description
  priority: {
    type: String,
    required: false,
    enum: ['high', 'medium', 'low'], // Enforcing specific values
    default: 'medium' // Default value for priority
  }, // Optional: Priority of the testimonial
  alt: [{ type: String, default: '' }], // Optional: Alternate text for images
  altVideo: { type: String, default: '' },
  imgtitle: [{ type: String, default: '' }], // Optional: Alternate text for images
  videotitle: { type: String, default: '' },
  status: { type: Boolean, default: false }, // Status flag
  slug: {
    type: String,
    required: true,
    trim: true,
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
      'main', 'sub', 'subsub'],

  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  createdAt: { type: Date, default: Date.now }, // Timestamp for creation
  updatedAt: { type: Date, default: Date.now } // Timestamp for updates
});

// Update updatedAt field before saving
TestimonialSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model
const Testimonial = mongoose.model('Testimonial', TestimonialSchema);

module.exports = Testimonial;
