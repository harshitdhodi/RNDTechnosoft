const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
  fileName: {
    type: String,
   
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const Backup = mongoose.model('Backup', backupSchema);

module.exports = Backup;

