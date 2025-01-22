

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const infrastructureSchema = new Schema({
  photo: [{
    type: String, 
    required: true
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
  },
});

const Infrastructure = mongoose.model('Infrastructure', infrastructureSchema);

module.exports = Infrastructure;
