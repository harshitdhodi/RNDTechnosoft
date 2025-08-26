const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the service
const ServiceSchema = new Schema({
  title: { type: String, required: true },
  details: { type: String, required: true },
  photo:[{ type: String }],
  alt:[{ type: String,default: '' }],
  slug: { type: String },
  metatitle:{type:String},
  metadescription:{type:String},
  metakeywords:{type:String},
  metacanonical:{type:String},
  metalanguage:{type:String},
  metaschema:{type:String},
  otherMeta:{type:String},
  status: { type: String, required: true },
  categories: [{ type: String, ref: 'ServiceCategory' }],
  subcategories: [{ type: String, ref: 'ServiceCategory' }],
  subSubcategories: [{ type: String, ref: 'ServiceCategory' }],
  url: { type: String },
  priority: { type: Number },
  lastmod: { type: Date, default: Date.now },
  changeFreq: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ServiceSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
// Create the model
const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;
 