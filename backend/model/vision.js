// mission.model.js
const mongoose = require('mongoose');

const visionSchema = new mongoose.Schema({
    title: {
        type: String,
       
    },
    description: {
        type: String,
        
    },
    photo: [{
        type: String,
       
    }],
    alt:[{type:String}],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Vision = mongoose.model('Vision', visionSchema);

module.exports = Vision;
