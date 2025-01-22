// models/Cards.js
const mongoose = require('mongoose');

const questionAnswerSchema = new mongoose.Schema({
  question: {
    type: String,
   
  },
  answer: {
    type: String,
   
  },
});

const CardsSchema = new mongoose.Schema({
  icon: {
    type: String,
    
  },
  altName: String, // New field
  iconName: String, // New field
  title: {
    type: String,
    
  },
  questionsAndAnswers: [questionAnswerSchema],
});

module.exports = mongoose.model('Cards', CardsSchema);
