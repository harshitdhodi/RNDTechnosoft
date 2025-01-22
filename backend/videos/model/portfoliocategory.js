const mongoose = require('mongoose');

const PortfoliocategorySchema = new mongoose.Schema({
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
  component: { type: String, default: 'MainPortfolio' }, // Added component field with default value
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
    component: { type: String, default: 'SubPortfolio' }, // Added component field with default value
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
        component: { type: String, default: 'SuSubPortfolio' }, // Added component field with default value
        status: { type: String, required: true },

      }
    ]
  }]
});

module.exports = mongoose.models.PortFolioCategory || mongoose.model('PortFolioCategory', PortfoliocategorySchema);

