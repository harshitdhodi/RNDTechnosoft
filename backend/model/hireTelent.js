const mongoose = require('mongoose');

const HireTalentSchema = new mongoose.Schema({
  heading: { type: String, required: true, trim: true },
  subHeading: { type: String, trim: true },
  card: [{
    cardInfo: { type: String, trim: true },
    photo: { type: String, required: true },
    altImg: { type: String, trim: true },
    imgTitle: { type: String, trim: true },
  }],
  pageSection: {
    type: String,
    trim: true,
    enum: ['TeamService', 'Applications', 'WhyChoose'],
  },
}, { timestamps: true });

module.exports = mongoose.model('HireTalent', HireTalentSchema);