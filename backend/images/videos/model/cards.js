// models/Cards.js
const mongoose = require('mongoose');

const questionAnswerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const CardsSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: false,
  },
  altName: String, // New field
  iconName: String, // New field
  title: {
    type: String,
    required: true,
  },
  questionsAndAnswers: [questionAnswerSchema],
});

module.exports = mongoose.model('Cards', CardsSchema);
