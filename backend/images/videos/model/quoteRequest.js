const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the quote request
const QuoteRequestSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  company: { type: String },
  quotedType: { type: String, required: true }, // E.g., product, service, custom
  services: [{ type: String }], // Array of services
  notes: { type: String },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

QuoteRequestSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
// Create the model
const QuoteRequest = mongoose.model('QuoteRequest', QuoteRequestSchema);

module.exports = QuoteRequest;
