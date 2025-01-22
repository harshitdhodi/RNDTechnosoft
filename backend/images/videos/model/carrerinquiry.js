const mongoose = require('mongoose');

const careerInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  resume: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  utm_source: {
    type: String,
    required: false
  },
  utm_medium: {
    type: String,
    required: false
  },
  utm_campaign: {
    type: String,
    required: false
  },
  utm_id: {
    type: String,
    required: false
  },
  gclid: {
    type: String,
    required: false
  },
  gcid_source: {
    type: String,
    required: false
  },
  utm_content: {
    type: String,
    required: false
  },
  utm_term: {
    type: String,
    required: false
  },
  ipaddress: { type: String }
}, { timestamps: true });

const CareerInquiry = mongoose.model('CareerInquiry', careerInquirySchema);

module.exports = CareerInquiry;
