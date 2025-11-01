const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['headerColor', 'headerWhite', 'footerColor', 'footerWhite', 'favicon']
    },
    photo: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    imgtitle: {
      type: String,
      required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  })


const Logo = mongoose.model('Logo', logoSchema);

module.exports = Logo;