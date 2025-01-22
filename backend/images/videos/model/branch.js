const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the branch
const BranchSchema = new Schema({
  branch: { type: String, required: true },
  address: { type: String, required: true },
  service: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, required: true },
});

// Create the model
const Branch = mongoose.model('Branch', BranchSchema);

module.exports = Branch;
