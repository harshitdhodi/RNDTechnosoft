const mongoose = require('mongoose');


const homeAnimationSchema = new mongoose.Schema({
  video: { type: String, required: false }, // Store the path or URL of the video
  photo: { type: String, required: false }, // Store the path or URL of the photo
  photoTitleName: { type: String, required: false },
  photoAltName: { type: String, required: false },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String },
  iconPhoto: [{ type: String, required: false }],
  iconPhotoTitleName: [{ type: String, required: false }], // Changed to an array
  iconPhotoAltName: [{ type: String, required: false }], // Changed to an array
  iconTitle: [{ type: String, required: true }],
  paragraph: { type: String, required: false },
  author: { type: String, required: false },
  authPhoto: { type: String, required: false },
  authPhotoTitleName: { type: String, required: false },
  authPhotoAltName: { type: String, required: false },

}, { timestamps: true });

const HomeAnimation = mongoose.model('HomeAnimation', homeAnimationSchema);

module.exports = HomeAnimation;
