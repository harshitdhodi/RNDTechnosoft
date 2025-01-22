// mission.model.js
const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
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

const Mission = mongoose.model('Mission', missionSchema);

module.exports = Mission;
