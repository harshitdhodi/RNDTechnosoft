const mongoose = require('mongoose');

const PackagecategorySchema = new mongoose.Schema({
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
  component: { type: String, default: 'MainPackage' }, // Added component field with default value
  status: { type: String, required: true },

  subCategories: [{
    category: { type: String },
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
    component: { type: String, default: 'SubPackage' }, // Added component field with default value
    status: { type: String, required: true },

    subSubCategory: [
      {
        category: { type: String },
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
        component: { type: String, default: 'SuSubPackage' }, // Added component field with default value
        status: { type: String, required: true },

      }
    ]
  }]
});

module.exports = mongoose.model('PackageCategory', PackagecategorySchema);
