const mongoose = require('mongoose');
const industriescategory = require('./industriescategory');
const cardSchema = new mongoose.Schema({
  photo: {
    type: String,
    // required: [true, 'Photo is required'],
    trim: true
  },
  title: {
    type: String,
    // required: [true, 'Card title is required'],
    trim: true
  },
  details: {
    type: String,
    // required: [true, 'Card details are required'],
    trim: true
  },
  altName: {
    type: String,
    trim: true,
    default: ''
  },
  imgTitle: {
    type: String,
    trim: true,
    default: ''
  }
}, { _id: false });

const IndustrySecDataSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Type is required'],
    trim: true,
    enum: { 
      values: ['info', 'applications', 'software-service', 'case-studies'],
      message: 'Type must be one of: info, applications, software-service, case-studies'
    }
  },
  heading: {
    type: String,
    required: [true, 'Heading is required'],
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: industriescategory,
    required: [true, 'Category is required']
  },
  subHeading: {
    type: String,
    trim: true,
    default: ''
  },
  card: {
    type: [cardSchema],
    // required: [true, 'At least one card is required'],
    // validate: {
    //   validator: function(cards) {
    //     return cards && cards.length > 0;
    //   },
    //   message: 'At least one card is required'
    // }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('IndustrySecData', IndustrySecDataSchema);