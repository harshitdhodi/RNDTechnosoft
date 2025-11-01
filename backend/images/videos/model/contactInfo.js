const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactinfoSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  phone1: {
    type: String,
  },
  phone2: {
    type: String,
  },
  email1: {
    type: String,
  },
  email2: {
    type: String
  },
  photo: {
    type: String,
  },
  imgTitle: {
    type: String,
  },
  alt: {
    type: String,
  },
  title: {
    type: String,
  },
  address: {
    type: String,

  },
});

const Contactinfo = mongoose.model('ContactInfo', ContactinfoSchema);

module.exports = Contactinfo;
