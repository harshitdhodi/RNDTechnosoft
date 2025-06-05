const CaseStudy = require('../model/caseStudy');

// Create Case Study
exports.createCaseStudy = async (req, res) => {
  try {
    const { heading, subHeading, altImg, imgTitle, details, industryCategory } = req.body;

    const photo = req.file ? req.file.filename : null;

    const caseStudy = new CaseStudy({
      heading,
      subHeading,
      photo,
      altImg,
      imgTitle,
      details,
      industryCategory,
    });

    const saved = await caseStudy.save();
    res.status(201).json({ message: 'Case Study created successfully', data: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Case Studies
exports.getAllCaseStudies = async (req, res) => {
  try {
    const caseStudies = await CaseStudy.find()
      .populate({
        path: 'industryCategory',
        select: 'category', // Only return the 'category' field from IndustryCategory
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ data: caseStudies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get by ID
exports.getCaseStudyById = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id).populate('industryCategory');
    if (!caseStudy) return res.status(404).json({ message: 'Case Study not found' });
    res.status(200).json({ data: caseStudy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Case Study
exports.updateCaseStudy = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) {
      updates.photo = req.file.filename;
    }

    const updated = await CaseStudy.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Case Study not found' });

    res.status(200).json({ message: 'Case Study updated', data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Case Study
exports.deleteCaseStudy = async (req, res) => {
  try {
    const deleted = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Case Study not found' });

    res.status(200).json({ message: 'Case Study deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
