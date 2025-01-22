// qualityControl.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const qualityControlSchema = new Schema({
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

const QualityControl = mongoose.model('QualityControl', qualityControlSchema);

module.exports = QualityControl;
