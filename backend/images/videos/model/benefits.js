const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const benefitsSchema = new Schema({
  photo: [{
    type: String, 
  }],
  title: {
    type: String,
    required: true
  },
  alt: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    required: true
  }
});

const Benefits = mongoose.model('Benefits', benefitsSchema);

module.exports = Benefits;
