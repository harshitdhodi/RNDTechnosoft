// whatsappSettings.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define WhatsApp Settings Schema
const WhatsAppSettingsSchema = new Schema({
    status: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    apiKey: {
        type: String,
        required: true
    },
    instanceId: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create model based on schema
const WhatsAppSettings = mongoose.model('WhatsAppSettings', WhatsAppSettingsSchema);

module.exports = WhatsAppSettings;
