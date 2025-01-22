const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  headOfficeAddress: {
    type: String,
    required: true,
  },
  salesOfficeAddress: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

const Address = mongoose.model('Address', AddressSchema);

module.exports = Address;
