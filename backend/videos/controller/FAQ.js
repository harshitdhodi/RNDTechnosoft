const FAQ = require("../model/fqa");

const insertFAQ = async (req, res) => {
  try {
    
    const { question, answer, status } = req.body;
  
    
    const faq = new FAQ({
      question, answer, status
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




module.exports = { insertFAQ, getFAQ, updateFAQ, deleteFAQ, getFAQById, countFaq,getFAQWebsite }; 