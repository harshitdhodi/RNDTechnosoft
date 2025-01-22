const mongoose = require('mongoose');

const headerSchema = new mongoose.Schema({
  phoneNo: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Header', headerSchema);
