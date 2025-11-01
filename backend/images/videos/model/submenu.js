const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// SubMenuListing Schema
const SubMenuListingSchema = new Schema({
  pagename: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  imgtitle: {
    type: String,
    required: true
},
  priority: {
    type: Number,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'MenuListing',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const SubMenuListing = mongoose.model('SubMenuListing', SubMenuListingSchema);

module.exports = SubMenuListing;
