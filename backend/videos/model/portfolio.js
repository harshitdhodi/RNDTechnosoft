const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Portfolio
const PortfolioSchema = new Schema({
    title: { type: String, required: true },
    details: { type: String, required: true },
    photo: [{ type: String, required: true }],
    alt: [{ type: String, default: '' }],
    imgtitle: [{ type: String, default: '' }],
    slug: { type: String },
    status: { type: String, required: true },
    categories: [{ type: String, ref: 'PortfolioCategory' }],
    subcategories: [{ type: String, ref: 'PortfolioCategory' }],
    subSubcategories: [{ type: String, ref: 'PortfolioCategory' }],
    servicecategories: [{ type: String, ref: 'ServiceCategory' }],
    servicesubcategories: [{ type: String, ref: 'ServiceCategory' }],
    servicesubSubcategories: [{ type: String, ref: 'ServiceCategory' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

PortfolioSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Portfolio = mongoose.model('Portfolio', PortfolioSchema);

module.exports = Portfolio;