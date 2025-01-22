

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const infrastructureSchema = new Schema({
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
    
  },
});

const Infrastructure = mongoose.model('Infrastructure', infrastructureSchema);

module.exports = Infrastructure;
