
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CounterSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  no: {
    type: Number,
    required: true
  },
  sign:{type:String},
  photo: {
    type: String,
  },
  alt:{type:String},
  imgtitle:{type:String},
  status: {
    type: String,
    enum: ['active', 'inactive'], // or any other status values you need
    default: 'active',
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Counter', CounterSchema);
