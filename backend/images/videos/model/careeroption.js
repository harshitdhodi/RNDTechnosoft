// models/career.js
const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
    jobtitle: {
        type: String,
    },
    department: {
        type: String,
    },
    jobType:{
        type:String
    },
    employmentType:{
        type:String
    },
    requirement: {
        type: String,
    },
    description: {
        type: String,
    },
    photo: [{
        type: String,
    }],
    alt: [{
        type: String,
        default: ''
    }],
    imgTitle: [{
        type: String,
        default: ''
    }],
    
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Career = mongoose.model('Career', CareerSchema);

module.exports = Career;
