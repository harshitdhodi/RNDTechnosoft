const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const Backup = mongoose.model('Backup', backupSchema);

module.exports = Backup;

