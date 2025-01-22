const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  photo: [{
    type: String, // Assuming the photo will be stored as a URL
  }],
  alt:[{
    type:String,
  }],
  
});

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;
