const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  cardInfo: {
    type: String,
    required: [true, 'Card info is required'],
    trim: true
  },
  photo: {
    type: String,
    required: [true, 'Photo is required']
  },
  altImg: {
    type: String,
    trim: true,
    default: ''
  },
  imgTitle: {
    type: String,
    trim: true,
    default: ''
  }
}, { _id: false }); // Prevent automatic _id for subdocuments

const HireTalentSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: [true, 'Heading is required'],
    trim: true
  },
  subHeading: {
    type: String,
    trim: true,
    default: ''
  },
  card: {
    type: [cardSchema],
    required: [true, 'At least one card is required'],
    validate: {
      validator: function(cards) {
        return cards && cards.length > 0;
      },
      message: 'At least one card is required'
    }
  },
  pageSection: {
    type: String,
    required: [true, 'Page section is required'],
    trim: true,
    enum: {
      values: ['TeamService', 'Applications', 'WhyChoose'],
      message: 'Page section must be one of: TeamService, Applications, WhyChoose'
    }
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('HireTalent', HireTalentSchema);