
const mongoose = require('mongoose');



const inquirySchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true
  },
  companysize: {
    type: String,
    required: true
  },
  activeuser: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
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
  utm_content:{
   type:String,
   required: false
  },
  utm_term:{
    type:String,
    required:false
  },
  ipaddress:{type:String}
}, {
  timestamps: true
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;