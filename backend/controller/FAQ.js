const FAQ = require("../model/fqa");

const insertFAQ = async (req, res) => {
  try {

    const { question, answer, status, serviceparentCategoryId, servicesubCategoryId, servicesubSubCategoryId,industryparentCategoryId,industrysubCategoryId,industrysubSubCategoryId } = req.body;


    const faq = new FAQ({
      question, answer, status, serviceparentCategoryId, servicesubCategoryId, servicesubSubCategoryId,industryparentCategoryId,industrysubCategoryId,industrysubSubCategoryId
    })

    await faq.save();

    return res.status(201).send(
      {
        message: "your FAQ send successfully",
        faq: faq
      }
    )
  } catch (error) {

    res.status(400).send(error);
  }
}

const getFAQ = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 5;
    const count = await FAQ.countDocuments();
    const faq = await FAQ.find()
      .skip((page - 1) * limit) // Skip records for previous pages
      .limit(limit);

    res.status(200).json({
      data: faq,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit
    });
  } catch (error) {

    res.status(400).send(error);
  }
};

const updateFAQ = async (req, res) => {
  const { id } = req.query; // Assuming id is passed as a query parameter
  const updateFields = req.body;


  try {
    const existingFaq = await FAQ.findById(id)
    if (!existingFaq) {
      return res.status(404).send("FAQ not found");
    }

    // Find FAQ by ID and update
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedFAQ) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.status(200).json({ message: 'FAQ updated successfully', data: updatedFAQ });
  } catch (error) {

    res.status(500).json({ error: 'Server error' });
  }
};


const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.query;
    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) {
      return res.status(404).send({ message: 'FAQ not found' });
    }
    res.send({ message: "FAQ deleted successfully" }).status(200);
  } catch (error) {

    res.status(400).send(error);
  }
}

const getFAQById = async (req, res) => {
  try {
    const { id } = req.query;
    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json({ data: faq });
  } catch (error) {

    res.status(500).json({ message: "Server error" });
  }
}

const countFaq = async (req, res) => {
  try {
    const count = await FAQ.countDocuments();
    res.status(200).json({ total: count });
  } catch (error) {

    res.status(500).json({ message: 'Error counting services' });
  }
};



// website side routes 

const getFAQWebsite = async (req, res) => {
  try {
    const status = "active"; // Filter for active FAQs
    const faq = await FAQ.find({ status }); // Find only active FAQs

    res.status(200).json({
      data: faq
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getFAQBySlug = async (req, res) => {
  try {
    const { slug } = req.query; // Get the slug from the query parameters

    // If the slug is provided, search for FAQs based on the slug
    if (slug) {
      // 1. If slug matches serviceparentCategoryId or industryparentCategoryId, return FAQs where both subCategoryId and subSubCategoryId are empty
      const faqsWithParentMatch = await FAQ.find({
        $or: [
          { serviceparentCategoryId: slug, servicesubCategoryId: '', servicesubSubCategoryId: '' },
          { industryparentCategoryId: slug, industrysubCategoryId: '', industrysubSubCategoryId: '' }
        ]
      });

      if (faqsWithParentMatch.length > 0) {
        return res.status(200).json({ data: faqsWithParentMatch });
      }

      // 2. If slug matches servicesubCategoryId or industrysubCategoryId, return FAQs where subSubCategoryId is empty
      const faqsWithSubCategoryMatch = await FAQ.find({
        $or: [
          { servicesubCategoryId: slug, servicesubSubCategoryId: '' },
          { industrysubCategoryId: slug, industrysubSubCategoryId: '' }
        ]
      });

      if (faqsWithSubCategoryMatch.length > 0) {
        return res.status(200).json({ data: faqsWithSubCategoryMatch });
      }

      // 3. If slug matches servicesubSubCategoryId or industrysubSubCategoryId, return all FAQs where both serviceparentCategoryId and servicesubCategoryId are not empty
      const faqsWithSubSubCategoryMatch = await FAQ.find({
        $or: [
          { servicesubSubCategoryId: slug, serviceparentCategoryId: { $ne: '' }, servicesubCategoryId: { $ne: '' } },
          { industrysubSubCategoryId: slug, industryparentCategoryId: { $ne: '' }, industrysubCategoryId: { $ne: '' } }
        ]
      });

      if (faqsWithSubSubCategoryMatch.length > 0) {
        return res.status(200).json({ data: faqsWithSubSubCategoryMatch });
      }

      // If no matching FAQs are found, return a message
      return res.status(404).json({ message: 'No FAQs found matching the given slug.' });

    } else {
      // If no slug is provided, return FAQs where all three fields are empty
      const faqsWithAllEmptyFields = await FAQ.find({
        serviceparentCategoryId:'',
        servicesubCategoryId: '',
        servicesubSubCategoryId: '',
        industryparentCategoryId: '',
        industrysubCategoryId: '',
        industrysubSubCategoryId: ''
      });
      
      return res.status(200).json({ data: faqsWithAllEmptyFields });
    }
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ message: "Server error" });
  }
};







module.exports = {getFAQBySlug, insertFAQ, getFAQ, updateFAQ, deleteFAQ, getFAQById, countFaq, getFAQWebsite }; 