const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  photo: {
    type: String,
    default: '',
  },
  heading: {
    type: String,
    required: true,
  },
  subHeading: {
    type: String,
    // required: true,
  },
  altName: {
    type: String,
    default: '',
  },
  imgTitle: {
    type: String,
    default: '',
  },
});

const technologySecDataSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  technologyId: {
    type: String,
    required: true,
  },
  card: [cardSchema],
}, { timestamps: true });

module.exports = mongoose.model('TechnologySecData', technologySecDataSchema);