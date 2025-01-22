const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// SubMenuListing Schema
const SubMenuListingSchema = new Schema({
  pagename: {
    type: String,
   
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
  priority: {
    type: Number,
    
  },
  details: {
    type: String,
  
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'MenuListing',
   
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
