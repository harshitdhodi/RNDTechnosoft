const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the News
const NewsSchema = new Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    details: { type: String, required: true },
    photo: [{ type: String, required: true }],
    alt: [{ type: String, default: '' }],
    imgtitle: [{ type: String, default: '' }],

    postedBy: { type: String, require: true },
    visits: { type: String, default: "" },
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
    changeFreq:{type:String},
    lastmod: { type: Date, default: Date.now },
    status: { type: String, required: true },
    categories: [{ type: String, ref: 'NewsCategory' }],
    subcategories: [{ type: String, ref: 'NewsCategory' }],
    subSubcategories: [{ type: String, ref: 'NewsCategory' }],
    servicecategories: [{ type: String, ref: 'ServiceCategory' }],
    servicesubcategories: [{ type: String, ref: 'ServiceCategory' }],
    servicesubSubcategories: [{ type: String, ref: 'ServiceCategory' }],
    component: { type: String, default: 'SubSubBlogs' }, // Added component field with default value

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

NewsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const News = mongoose.model('News', NewsSchema);

module.exports = News;