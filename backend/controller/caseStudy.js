const IndustrySecData = require('../model/caseStudy');
const AppError = require('../utils/appError.js');
const IndustriesCategory = require("../model/industriescategory");

exports.createIndustrySecData = async (req, res, next) => {
  try {
    const { type, heading, subHeading, category } = req.body;

    // Parse card fields dynamically
    const cardFields = Object.keys(req.body).reduce((acc, key) => {
      const match = key.match(/card\[(\d+)\]\.(.+)/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2];
        if (!acc[index]) acc[index] = {};
        acc[index][field] = req.body[key];
      }
      return acc;
    }, {});

    const cards = Object.entries(cardFields)
      .map(([index, fields]) => ({
        title: fields.title?.trim() || "",
        details: fields.details?.trim() || "",
        photo: "",
        altName: fields.altName?.trim() || "",
        imgTitle: fields.imgTitle?.trim() || "",
        _originalIndex: parseInt(index, 10),
      }))
      .filter(card => card.title || card.details);

    if (req.files) {
      Object.entries(req.files).forEach(([fieldName, fileArray]) => {
        const match = fieldName.match(/card\[(\d+)\]\.photo/);
        if (match && fileArray && fileArray[0]) {
          const originalIndex = parseInt(match[1], 10);
          const cardToUpdate = cards.find(c => c._originalIndex === originalIndex);
          if (cardToUpdate) {
            cardToUpdate.photo = fileArray[0].filename;
          }
        }
      });
    }

    cards.forEach(c => delete c._originalIndex);

    // Validate cards
    const invalidCards = cards.filter(c => !c.title.trim() || !c.details.trim());
    if (invalidCards.length > 0) {
      return next(new AppError("Each card must have a title and details", 400));
    }

    // ✅ New check: Prevent same category + type regardless of heading
    const categoryTypeExists = await IndustrySecData.findOne({
      category,
      type: type.trim(),
    });
    const categoryName = await IndustriesCategory.findById(category);
    if (categoryTypeExists) {
      return next(
        new AppError(
          `An entry with category "${categoryName.category}" and type "${type}" already exists`,
          400
        )
      );
    }

    // Existing duplicate check: category + type + heading
    const existingEntry = await IndustrySecData.findOne({
      heading: heading.trim(),
      category,
      type: type.trim(),
    });
    if (existingEntry) {
      return next(
        new AppError(
          `An entry with heading "${heading.trim()}", category "${existingEntry.category.category}", and type "${type}" already exists`,
          400
        )
      );
    }

    const newEntry = await IndustrySecData.create({
      type: type.trim(),
      heading: heading.trim(),
      subHeading: subHeading?.trim() || "",
      category,
      card: cards,
    });

    res.status(201).json({
      status: "success",
      message: "Industry section data created successfully",
      data: newEntry,
    });
  } catch (error) {
    console.error("Error creating:", error);
    return next(new AppError(`Server error: ${error.message}`, 500));
  }
};


exports.updateIndustrySecData = async (req, res, next) => {
  try {
    const { type, heading, subHeading, category } = req.body;
    const existingEntry = await IndustrySecData.findById(req.params.id);
    if (!existingEntry) {
      return next(new AppError("No entry found with the provided ID", 404));
    }

    // Parse card fields dynamically
    const cardFields = Object.keys(req.body).reduce((acc, key) => {
      const match = key.match(/card\[(\d+)\]\.(.+)/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2];
        if (!acc[index]) acc[index] = {};
        acc[index][field] = req.body[key];
      }
      return acc;
    }, {});

    const cards = Object.entries(cardFields)
      .map(([index, fields]) => {
        const cardIndex = parseInt(index, 10);
        const existingCard = existingEntry.card[cardIndex] || {};
        return {
          title: fields.title?.trim() || "",
          details: fields.details?.trim() || "",
          photo: existingCard.photo || "",
          altName: fields.altName?.trim() || "",
          imgTitle: fields.imgTitle?.trim() || "",
          _originalIndex: cardIndex,
        };
      })
      .filter(c => c.title || c.details); // ✅ Only keep cards with some content

    if (req.files) {
      Object.entries(req.files).forEach(([fieldName, fileArray]) => {
        const match = fieldName.match(/card\[(\d+)\]\.photo/);
        if (match && fileArray && fileArray[0]) {
          const originalIndex = parseInt(match[1], 10);
          const cardToUpdate = cards.find(c => c._originalIndex === originalIndex);
          if (cardToUpdate) {
            cardToUpdate.photo = fileArray[0].filename;
          }
        }
      });
    }

    cards.forEach(c => delete c._originalIndex);

    const invalidCards = cards.filter(c => !c.title.trim() || !c.details.trim());
    if (invalidCards.length > 0) {
      return next(new AppError("Each card must have a title and details", 400));
    }

    const updatedEntry = await IndustrySecData.findByIdAndUpdate(
      req.params.id,
      {
        type: type.trim(),
        heading: heading.trim(),
        subHeading: subHeading?.trim() || "",
        category,
        card: cards,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      message: "Industry section data updated successfully",
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error updating:", error);
    return next(new AppError(`Server error: ${error.message}`, 500));
  }
};
  
exports.getAllIndustrySecData = async (req, res) => {
  try {
    const data = await IndustrySecData.find().populate('category').sort({ createdAt: -1 });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getIndustrySecDataById = async (req, res) => {
  try {
    const data = await IndustrySecData.findById(req.params.id).populate('category');
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteIndustrySecData = async (req, res) => {
  try {
    const deletedData = await IndustrySecData.findByIdAndDelete(req.params.id);
    if (!deletedData) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDataByCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const data = await IndustrySecData.find()
      .populate({
        path: 'category',
        match: { slug }
      })
      .sort({ createdAt: -1 });

    const filteredData = data.filter(item => item.category !== null);

    if (filteredData.length === 0) {
      return res.status(404).json({ message: 'No records found' });
    }

    res.status(200).json({ data: filteredData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};