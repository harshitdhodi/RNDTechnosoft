const mongoose = require("mongoose");

const PopupInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
    description: {
      type: String,

      minlength: 50, // Minimum of 50 characters
    },
    utm_source: {
      type: String,
      required: false,
    },
    utm_medium: {
      type: String,
      required: false,
    },
    utm_campaign: {
      type: String,
      required: false,
    },
    utm_id: {
      type: String,
      required: false,
    },
    gclid: {
      type: String,
      required: false,
    },
    gcid_source: {
      type: String,
      required: false,
    },
    utm_content: {
      type: String,
      required: false,
    },
    utm_term: {
      type: String,
      required: false,
    },
    ipaddress: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PopupInquiry", PopupInquirySchema);
