const mongoose = require('mongoose');

// Define the HeroSection schema
const heroSectionSchema = new mongoose.Schema({
  heading: {
    type: String,
    trim: true,
  },
  title:{
    type:String,
  },
  subheading: {
    type: String,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // Reference to ServiceCategory
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
  slug: {
    type: String,
    trim: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// Create a compound unique index to prevent duplicate HeroSections

// Create the HeroSection model
const HeroSection = mongoose.model('HeroSection', heroSectionSchema);

module.exports = HeroSection;
