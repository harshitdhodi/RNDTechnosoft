const mongoose = require('mongoose');

const ImpotedFileSchema = new mongoose.Schema({
  fileName: {
    type: String,
  
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const ImportedFile = mongoose.model('ImportedFile', ImpotedFileSchema);

module.exports = ImportedFile;

