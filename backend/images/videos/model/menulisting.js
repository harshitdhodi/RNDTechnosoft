
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define MenuListing Schema
const MenuListingSchema = new Schema({
    pagename: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        required: true
    },
    imgtitle: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create model based on schema
const MenuListing = mongoose.model('MenuListing', MenuListingSchema);

module.exports = MenuListing;
