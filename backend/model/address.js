const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  headOfficeAddress: {
    type: String,
   
  },
  salesOfficeAddress: {
    type: String,
  
  },
  location: {
    type: String,
  
  },
});

const Address = mongoose.model('Address', AddressSchema);

module.exports = Address;
