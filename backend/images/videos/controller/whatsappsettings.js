// whatsappSettingsController.js

const WhatsAppSettings = require('../model/whatsappsettings');

// Fetch WhatsApp Settings
exports.getWhatsAppSettings = async (req, res) => {
    try {
        const settings = await WhatsAppSettings.findOne();
        if (!settings) {
            return res.status(404).json({ message: 'WhatsApp settings not found' });
        }
        res.json(settings);
    } catch (error) {
        console.error('Error fetching WhatsApp settings:', error);
        res.status(500).json({ message: 'Failed to fetch WhatsApp settings' });
    }
};

// Update WhatsApp Settings
exports.updateWhatsAppSettings = async (req, res) => {
    const { status, otp, apiKey, instanceId } = req.body;

    try {
        let settings = await WhatsAppSettings.findOne();
        if (!settings) {
            // Create new settings if not found
            settings = new WhatsAppSettings({
                status,
                otp,
                apiKey,
                instanceId
            });
        } else {
            // Update existing settings
            settings.status = status;
            settings.otp = otp;
            settings.apiKey = apiKey;
            settings.instanceId = instanceId;
        }

        await settings.save();

        res.json({ message: 'WhatsApp settings updated successfully', settings });
    } catch (error) {
        console.error('Error updating WhatsApp settings:', error);
        res.status(500).json({ message: 'Failed to update WhatsApp settings' });
    }
};
