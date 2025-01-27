const mongoose = require('mongoose');

// Define the HeroSection schema
const heroSectionSchema = new mongoose.Schema({
  heading: {
    type: String,
  
    trim: true,
  },
  subheading: {
    type: String,
  
    trim: true,
  },
  tagline: {
    type: String,
  
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // Reference to IndustriesCategory
    ref: 'IndustriesCategory',
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId, // Reference to IndustriesCategory
    ref: 'IndustriesCategory',
  },
  subsubcategory: {
    type: mongoose.Schema.Types.ObjectId, // Reference to IndustriesCategory
    ref: 'IndustriesCategory',
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
const IndustriesHeroSection = mongoose.model('IndustriesHeroSection', heroSectionSchema);

module.exports = IndustriesHeroSection;
