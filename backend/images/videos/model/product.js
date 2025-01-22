// models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  photo: [{ type: String }],
  alt: [{ type: String, default: '' }],
  imgtitle: [{ type: String, default: '' }],
  slug: { type: String },
  metatitle:{type:String},
  metadescription:{type:String},
  metakeywords:{type:String},
  metacanonical:{type:String},
  metalanguage:{type:String},
  metaschema:{type:String},
  otherMeta:{type:String},
  status: { type: String, required: true },
  categories: [{ type: String, ref: 'ProductCategory' }],
  subcategories: [{ type: String, ref: 'ProductCategory' }],
  subSubcategories: [{ type: String, ref: 'ProductCategory' }],
  benefits: [{ type: String, ref: 'Benefits' }],
  catalogue:{type:String},
  url: { type: String },
  priority: { type: Number },
  lastmod: { type: Date, default: Date.now },
  changeFreq: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;