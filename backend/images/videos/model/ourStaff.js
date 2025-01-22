const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the ourstaff
const OurStaffSchema = new Schema({
  S_id: { type: String, required: true },
  name: { type: String, required: true },
  photo:[{ type: String ,required: true}],
  alt:[{type:String,default: ''}],
  imgtitle:[{type:String,default:""}],
  details: { type: String, required: true },
  jobTitle: { type: String, required: true },
  status: {type: String,default: false, },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
OurStaffSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
// Create the model
const OurStaff = mongoose.model('OurStaff', OurStaffSchema);

module.exports = OurStaff;
