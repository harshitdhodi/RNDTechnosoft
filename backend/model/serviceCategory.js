const mongoose = require("mongoose");

const ServicecategorySchema = new mongoose.Schema({
  category: { type: String, unique: true },
  tag:{type:String},
  description: { type: String },
  photo: { type: String },
  alt: { type: String },
  imgtitle: { type: String },
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
  lastmod: { type: Date, default: Date.now },
  changeFreq: { type: String },
  component: { type: String, default: "MainService" }, // Added component field with default value
  status: { type: String },

  subCategories: [
    {
      category: { type: String },
      tag:{type:String},
      description: { type: String },
      photo: { type: String },
      alt: { type: String },
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
      lastmod: { type: Date, default: Date.now },
      changeFreq: { type: String },
      component: { type: String, default: "SubService" }, // Added component field with default value
      status: { type: String },

      subSubCategory: [
        {
          category: { type: String },
          tag:{type:String},
          description: { type: String },
          photo: { type: String },
          alt: { type: String },
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
          lastmod: { type: Date, default: Date.now },
          changeFreq: { type: String },
          component: { type: String, default: "SubSubService" }, // Added component field with default value
          status: { type: String },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("ServiceCategory", ServicecategorySchema);
