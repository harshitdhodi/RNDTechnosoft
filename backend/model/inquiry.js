
const mongoose = require('mongoose');



const inquirySchema = new mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,

  },
  mobileNo: {
    type: String,
  },
  companysize: {
    type: String,
  },
  activeuser: {
    type: String,

  },
  topic: {
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
}, {
  timestamps: true
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;