const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema(
  {
    type: {
      type: String,

      enum: ['headerColor', 'headerWhite', 'footerColor', 'footerWhite', 'favicon']
    },
    photo: {
      type: String,
    },
    alt: {
      type: String,
    },
    imgtitle: {
      type: String,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  })


const Logo = mongoose.model('Logo', logoSchema);

module.exports = Logo;