const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const benefitsSchema = new Schema({
  photo: [{
    type: String, 
  }],
  title: {
    type: String,
   
  },
  alt: [{
    type: String,
   
  }],
  description: {
    type: String,
   
  }
});

const Benefits = mongoose.model('Benefits', benefitsSchema);

module.exports = Benefits;
