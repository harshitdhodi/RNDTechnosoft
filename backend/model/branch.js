const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the branch
const BranchSchema = new Schema({
  branch: { type: String },
  address: { type: String},
  service: { type: String},
  phone: { type: String},
  status: { type: String},
});

// Create the model
const Branch = mongoose.model('Branch', BranchSchema);

module.exports = Branch;
