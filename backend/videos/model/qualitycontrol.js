// qualityControl.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const qualityControlSchema = new Schema({
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
  }
});

const QualityControl = mongoose.model('QualityControl', qualityControlSchema);

module.exports = QualityControl;
