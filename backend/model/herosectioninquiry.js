const mongoose = require("mongoose");

const heroSectioninquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    city:{
        type:String,
    },
    service: {
      type: String,
    },
    budget: {
      type: String,
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

const Inquiry = mongoose.model("heroSectioninquiry", heroSectioninquirySchema);

module.exports = Inquiry;
