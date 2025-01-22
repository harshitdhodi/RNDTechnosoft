// mission.model.js
const mongoose = require('mongoose');

const aboutcompanySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photo: [{ 
        type: String,
    }],
    alt:[{type:String}],
    imgtitle:[{type:String}],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Aboutcompany = mongoose.model('Aboutcompany', aboutcompanySchema);

module.exports = Aboutcompany;
