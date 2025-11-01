const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AboutUsPointsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, { timestamps: true });

module.exports = mongoose.model('AboutUsPoints', AboutUsPointsSchema);
