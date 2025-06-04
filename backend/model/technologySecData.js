const mongoose = require('mongoose');

const TechnologySecDataSchema = new mongoose.Schema({
  type: { type: String,  },
  heading: { type: String,  },
 technologyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Technology', required: true },
  card: [{
     photo: { type: String,  },
  heading: { type: String,  },
  subHeading: { type: String,  },
  altName: { type: String,  },
  imgTitle: { type: String,  }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  __v: { type: Number, default: 0 }
});

const TechnologySecData = mongoose.model('TechnologySecData', TechnologySecDataSchema);

module.exports = TechnologySecData;