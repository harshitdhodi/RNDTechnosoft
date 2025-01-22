const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the package
const PackageSchema = new Schema({
  title: { type: String,  }, // Title of the package
  packagetype:{type:String},
  status: { type: String}, // Status of the package
  categories: [{ type: String, ref: 'PackageCategory' }],
  subcategories: [{ type: String, ref: 'PackageCategory' }],
  subSubcategories: [{ type: String, ref: 'PackageCategory' }],
  servicecategories: [{ type: String, ref: 'ServiceCategory' }],
  servicesubcategories: [{ type: String, ref: 'ServiceCategory' }],
  servicesubSubcategories: [{ type: String, ref: 'ServiceCategory' }],
  createdAt: { type: Date, default: Date.now }, // Timestamp of creation
  updatedAt: { type: Date, default: Date.now }, // Timestamp of last update
  description: { type: String}, // Description of the package
  price: { type: Number,  }, // Price of the package
  whatIsTheir: [{ type: String }], // Array of strings detailing what is theirs
  whatIsNotTheir: [{ type: String }] // Array of strings detailing what is not theirs
  , 
  slug: {
      type: String,
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
