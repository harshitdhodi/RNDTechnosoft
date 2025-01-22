const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageContentSchema = new Schema({
  title: {
    type: String,
    enum: ['About Us', 'Privacy Policy', 'Why Choose Us', 'Terms Conditions'],
    unique: true,
   
  },
  heading: {
    type: String,
   
  },
  alt:[{
    type:String,
    default: ''
  }],
  detail: {
    type: String,
   
  },
  photo: {
    type: [{ type: String }],
   
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
   
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
