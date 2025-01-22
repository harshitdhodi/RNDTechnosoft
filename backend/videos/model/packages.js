const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the package
const PackageSchema = new Schema({
  title: { type: String, required: true }, // Title of the package

  status: { type: String, required: true }, // Status of the package
  categories: [{ type: String, ref: 'PackageCategory' }],
  subcategories: [{ type: String, ref: 'PackageCategory' }],
  subSubcategories: [{ type: String, ref: 'PackageCategory' }],
  servicecategories: [{ type: String, ref: 'ServiceCategory' }],
  servicesubcategories: [{ type: String, ref: 'ServiceCategory' }],
  servicesubSubcategories: [{ type: String, ref: 'ServiceCategory' }],

  createdAt: { type: Date, default: Date.now }, // Timestamp of creation
  updatedAt: { type: Date, default: Date.now }, // Timestamp of last update

  // New fields for package info
  description: { type: String, required: true }, // Description of the package
  popular: { type: Boolean, default: false }, // Indicates if the package is popular
  price: { type: Number, required: true }, // Price of the package
  slots: { type: Number, required: true }, // Number of slots available
  whatYouGet: [{ type: String }], // Array of strings detailing what is included
  whatIsTheir: [{ type: String }], // Array of strings detailing what is theirs
  whatIsNotTheir: [{ type: String }] // Array of strings detailing what is not theirs
  , 
  slug: {
      type: String,
      required: true,
      trim: true,
    },
});

// Update the `updatedAt` field before saving
PackageSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model
const Package = mongoose.model('Package', PackageSchema);

module.exports = Package;
