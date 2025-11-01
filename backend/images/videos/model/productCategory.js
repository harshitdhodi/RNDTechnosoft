const mongoose = require('mongoose');

const ProductcategorySchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  photo: { type: String },
  alt: { type: String },
  imgtitle: { type: String },
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
  subCategories: [{
    category: { type: String },
    photo: { type: String },
    alt: { type: String },
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
    subSubCategory: [
      {
        category: { type: String },
        photo: { type: String },
        alt: { type: String },
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
      }
    ]
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProductCategory', ProductcategorySchema);
