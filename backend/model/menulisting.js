
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define MenuListing Schema
const MenuListingSchema = new Schema({
    pagename: {
        type: String,
    },
    photo: {
        type: String,
    },
    alt: {
        type: String,
    },
    imgtitle: {
        type: String,
    },
    priority: {
        type: Number,

    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create model based on schema
const MenuListing = mongoose.model('MenuListing', MenuListingSchema);

module.exports = MenuListing;
