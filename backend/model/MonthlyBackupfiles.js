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


const MonthlyBackup = mongoose.model('MonthlyBackup', backupSchema);

module.exports = MonthlyBackup;

