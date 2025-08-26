const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sitemapSchema = new Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  changeFreq: {
    type: String,
  },
  lastmod: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  metatitle: { type: String },
  metadescription: { type: String },
  metakeywords: { type: String },
  metacanonical: { type: String },
  metalanguage: { type: String },
  metaschema: { type: String },
  otherMeta: { type: String },
});

const Sitemap = mongoose.model('Sitemap', sitemapSchema);

module.exports = Sitemap;
