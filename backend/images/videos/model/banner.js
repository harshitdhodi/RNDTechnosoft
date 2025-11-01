const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the banner
const BannerSchema = new Schema({
  section: { type: String, required: true },
  title: { type: String, required: true },
  photo: [{ type: String}],
  alt: [{ type: String, default: '' }],
  imgtitle:[{ type: String, default: '' }],
  details: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  priority: { type: Number, required: true},
  status: { type: String, default: false },
  
});

// Create the model
const Banner = mongoose.model("Banner", BannerSchema);

module.exports = Banner;
