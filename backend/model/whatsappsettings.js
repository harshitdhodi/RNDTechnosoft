// whatsappSettings.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define WhatsApp Settings Schema
const WhatsAppSettingsSchema = new Schema({
    status: {
        type: String, 
    },
    otp: {
        type: String,
    },
    apiKey: {
        type: String,
    },
    instanceId: {
        type: String,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create model based on schema
const WhatsAppSettings = mongoose.model('WhatsAppSettings', WhatsAppSettingsSchema);

module.exports = WhatsAppSettings;
