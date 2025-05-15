const express = require('express');
const router = express.Router();

// Import required models
const Inquiry = require('../model/inquiry');
const Newsletter = require('../model/newsletter');
const PopupInquiry = require('../model/popupinquiry');
const CareerInquiry = require('../model/carrerinquiry');

// Get data from all models and count GPM/SEO
async function getAllData() {
  try {
    // Get all inquiries
    const inquiries = await Inquiry.find();
    const inquiriesCount = await Inquiry.countDocuments();

    // Get all newsletters
    const newsletters = await Newsletter.find();
    const newslettersCount = await Newsletter.countDocuments();

    // Get all popup inquiries
    const popupInquiries = await PopupInquiry.find();
    const popupInquiriesCount = await PopupInquiry.countDocuments();

    // Get all career inquiries
    const careerInquiries = await CareerInquiry.find();
    const careerInquiriesCount = await CareerInquiry.countDocuments();

    // Initialize GPM and SEO counters
    let gpmCount = 0;
    let seoCount = 0;

    // Function to check if an entry has UTM parameters
    const hasUtmParameters = (entry) => {
      return (
        entry.utm_source ||
        entry.utm_medium ||
        entry.utm_campaign ||
        entry.utm_term ||
        entry.utm_content
      );
    };

    // Count GPM and SEO for inquiries
    inquiries.forEach((inquiry) => {
      hasUtmParameters(inquiry) ? gpmCount++ : seoCount++;
    });

    // Count GPM and SEO for newsletters
    newsletters.forEach((newsletter) => {
      hasUtmParameters(newsletter) ? gpmCount++ : seoCount++;
    });

    // Count GPM and SEO for popup inquiries
    popupInquiries.forEach((popupInquiry) => {
      hasUtmParameters(popupInquiry) ? gpmCount++ : seoCount++;
    });

    // Count GPM and SEO for career inquiries
    careerInquiries.forEach((careerInquiry) => {
      hasUtmParameters(careerInquiry) ? gpmCount++ : seoCount++;
    });

    return {
      inquiries,
      inquiriesCount,
      newsletters,
      newslettersCount,
      popupInquiries,
      popupInquiriesCount,
      careerInquiries,
      careerInquiriesCount,
      gpmCount,
      seoCount,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Define a route to fetch all inquiries
router.get('/inquiries', async (req, res) => {
  try {
    const data = await getAllData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inquiries', error: error.message });
  }
});

// Export the router
module.exports = router;