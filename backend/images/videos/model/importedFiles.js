const mongoose = require('mongoose');

const ImpotedFileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const ImportedFile = mongoose.model('ImportedFile', ImpotedFileSchema);

module.exports = ImportedFile;

