const mongoose = require('mongoose');

const headerSchema = new mongoose.Schema({
  phoneNo: {
    type: String,
  
  },
  email: {
    type: String,
   
  },
  photo: {
    type: String,
   
  },
  alt: {
    type: String,
   
  }
});

module.exports = mongoose.model('Header', headerSchema);
