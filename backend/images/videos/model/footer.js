const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
    newsletter: {
        type: String,
        required: true
    },
    instagramLink: {
        type: String,
        required: true
    },
    linkedinLink: {
        type: String,
        required: true
    },
    googleLink: {
        type: String,
        required: true
    },
    behanceLink: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    phoneNo_2: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    email_2: {
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Footer', footerSchema);
