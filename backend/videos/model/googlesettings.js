
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const GoogleSettingsSchema = new Schema({
    headerscript: {
        type: String,
        required: true
    },
    bodyscript: {
        type: String,
        required: true
    },
    footerscript: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create model based on schema
const GoogleSettings = mongoose.model('GoogleSettings', GoogleSettingsSchema);

module.exports = GoogleSettings;
