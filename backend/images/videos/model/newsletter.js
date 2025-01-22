const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }
}, {
    timestamps: true
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;
