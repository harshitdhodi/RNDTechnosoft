const mongoose = require('mongoose');

const ManageColorSchema = new mongoose.Schema({
  colors: {
    primary: { type: String, default: '#000000' },
    secondary: { type: String, default: '#ffffff' },
    accent1: { type: String, default: '#0000ff' },
    accent2: { type: String, default: '#ffff00' },
  },
});

module.exports = mongoose.model('ManageColor', ManageColorSchema);
