const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the ourstaff
const OurStaffSchema = new Schema({
  S_id: { type: String,  },
  name: { type: String,  },
  photo: [{ type: String,  }],
  alt: [{ type: String, default: '' }],
  imgtitle: [{ type: String, default: "" }],
  details: { type: String,  },
  jobTitle: { type: String,  },
  status: { type: String, default: false, },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
OurStaffSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
// Create the model
const OurStaff = mongoose.model('OurStaff', OurStaffSchema);

module.exports = OurStaff;
