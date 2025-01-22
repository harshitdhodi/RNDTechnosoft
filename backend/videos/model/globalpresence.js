const mongoose = require('mongoose');

const globalPresenceSchema = new mongoose.Schema({
  country: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String },
  alt:{type:String},
 
});

const GlobalPresence = mongoose.model('GlobalPresence', globalPresenceSchema);

module.exports = GlobalPresence;