const mongoose = require('mongoose');

const NewscategorySchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  details:{ type: String },
  photo: { type: String },
  alt:{type:String},
  slug: { type: String },
  metatitle: { type: String },
  metadescription: { type: String },
  metakeywords: { type: String },
  metacanonical: { type: String },
  metalanguage: { type: String },
  metaschema: { type: String },
  otherMeta: { type: String },
  url: { type: String },
  priority: { type: Number },
  lastmod: { type: Date, default: Date.now },
  changeFreq: { type: String },
  component: { type: String, default: 'SubBlogs' }, // Added component field with default value

  subCategories: [{
    category: { type: String },
    details:{ type: String },
    photo: { type: String },
    alt:{type:String},
    
    slug: { type: String },
    metatitle: { type: String },
    metadescription: { type: String },
    metakeywords: { type: String },
    metacanonical: { type: String },
    metalanguage: { type: String },
    metaschema: { type: String },
    otherMeta: { type: String },
    url: { type: String },
    priority: { type: Number },
    lastmod: { type: Date, default: Date.now },
    changeFreq: { type: String },
    component: { type: String, default: 'SubBlogs' }, // Added component field with default value

    subSubCategory: [
      {
        category: { type: String },
        photo: { type: String },
        details:{ type: String },
        alt:{type:String},
        slug: { type: String },
        metatitle: { type: String },
        metadescription: { type: String },
        metakeywords: { type: String },
        metacanonical: { type: String },
        metalanguage: { type: String },
        metaschema: { type: String },
        otherMeta: { type: String },
        url: { type: String },
        priority: { type: Number },
        lastmod: { type: Date, default: Date.now },
        changeFreq: { type: String },
        component: { type: String, default: 'SubBlogs' }, // Added component field with default value

      }
    ]
  }] 
});

module.exports = mongoose.model('NewsCategory', NewscategorySchema);
