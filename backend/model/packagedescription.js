const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the package
const PackageSchema = new Schema({
  title: { type: String }, // Title of the package
  description: { type: String }, // Description of the package
  status: { type: String }, // Status of the package
  categories: [{ type: String, ref: "PackageCategory" }],
  subcategories: [{ type: String, ref: "PackageCategory" }],
  subSubcategories: [{ type: String, ref: "PackageCategory" }],
  createdAt: { type: Date, default: Date.now }, // Timestamp of creation
  updatedAt: { type: Date, default: Date.now }, // Timestamp of last update
});

// Create the model
const Package = mongoose.model("PackageDescription", PackageSchema);

module.exports = Package;
