const mongoose = require('mongoose');

const MetaSchema = new mongoose.Schema({
    pageName: { type: String },
    pageSlug:{type:String},
    metaTitle: { type: String },
    photo:{type:String},
    altName:{type:String},
    metaDescription: { type: String },
    metaKeyword: { type: String },
});
 
module.exports = mongoose.model('Meta', MetaSchema);
