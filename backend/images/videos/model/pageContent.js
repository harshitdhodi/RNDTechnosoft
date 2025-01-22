const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageContentSchema = new Schema({
  title: {
    type: String,
    enum: ['About Us', 'Privacy Policy', 'Why Choose Us', 'Terms Conditions'],
    unique: true,
    required: true
  },
  heading: {
    type: String,
    required: true
  },
  alt:[{
    type:String,
    default: ''
  }],
  detail: {
    type: String,
    required: true
  },
  photo: {
    type: [{ type: String }],
   
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const PageContent = mongoose.model('PageContent', pageContentSchema);

module.exports = PageContent;
