const mongoose = require('mongoose');

const careerInquirySchema = new mongoose.Schema({
  name: {
    type: String,
   
  },
  mobileNo: {
    type: String,
   
  },
  email: {
    type: String,
   
  },
  resume: {
    type: String,
  
  },
  message: {
    type: String,
  
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
