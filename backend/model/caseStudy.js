const mongoose = require('mongoose');
const industriescategory = require('./industriescategory');

const IndustrySecDataSchema = new mongoose.Schema({
  type: { type: String,  },
  heading: { type: String,  },
   category: { type: mongoose.Schema.Types.ObjectId, ref: industriescategory, required: true },
  subHeading: { type: String,  },
  card: [{
     photo: { type: String,  },
     title: { type: String,  },
  details: { type: String,  },
  altName: { type: String,  },
  imgTitle: { type: String,  }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  __v: { type: Number, default: 0 } 
});

const IndustrySecData = mongoose.model('IndustrySecData', IndustrySecDataSchema);

module.exports = IndustrySecData; 