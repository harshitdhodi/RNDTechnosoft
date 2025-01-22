// mission.model.js
const mongoose = require('mongoose');

const logotypeSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description:{
        type:String,
    },
    photo: [{
        type: String,
    }],
    alt:[{type:String,default:""}],
    imgtitle:[{type:String,default:""}],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Corevalue = mongoose.model('Logotype', logotypeSchema);

module.exports = Corevalue;
