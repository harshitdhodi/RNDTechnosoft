// HomeHero.js
const mongoose = require('mongoose');

const LabelSchema = new mongoose.Schema({
  label: { type: String, required: true }, // text label
  color: { type: String, required: true }, // color of the label
});

const SmallCircleSchema = new mongoose.Schema({
  color: { type: String, required: true }, // color of the small circle
});

const ParagraphSchema = new mongoose.Schema({
  text: { type: String, required: true }, // Paragraph text
});

const HeadingSchema = new mongoose.Schema({
  highlightedWords: { type: [String], required: true }, // Array of words to be highlighted or shown differently
  beforeHighlight: { type: String, required: true }, // Text before highlighting
  afterHighlight: { type: String, required: true }, // Text after highlighting
});

const HomeHeroSchema = new mongoose.Schema({
  labels: [LabelSchema], // array of label names and colors
  smallCircles: [SmallCircleSchema], // array of small circle colors
  heading: { type: HeadingSchema }, // heading with highlighted words
  paragraph: { type: ParagraphSchema}, // paragraph text
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const HomeHero = mongoose.model('HomeHero', HomeHeroSchema);

module.exports = HomeHero;
