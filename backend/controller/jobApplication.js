// controllers/jobApplicationController.js
const JobApplication = require('../model/jobApplication');
const path = require('path');
// Create a new job application
exports.createJobApplication = async (req, res) => {
    try {
      // Handle resume file upload and store only the filename (without the path)
      const resumeFileName = req.files && req.files['resume'] ? req.files['resume'][0].filename : null;
  
      // Prepare the data to be saved in the database
      const jobApplicationData = {
        ...req.body, // Body data from the form
        resume: resumeFileName, // Store only the filename without the path
      };
  
      // Convert boolean fields to actual booleans
      jobApplicationData.smoke = jobApplicationData.smoke === 'Yes'; // Convert "Yes"/"No" to true/false
      jobApplicationData.alcohol = jobApplicationData.alcohol === 'Yes'; // Convert "Yes"/"No" to true/false
      jobApplicationData.differentlyAbled = jobApplicationData.differentlyAbled === 'Yes'; // Convert "Yes"/"No" to true/false
      jobApplicationData.policeRecord = jobApplicationData.policeRecord === 'Yes'; // Convert "Yes"/"No" to true/false
  
      // Convert totalExperience to number
      const experienceYears = jobApplicationData.totalExperience.match(/\d+/); // Extract numeric value
      jobApplicationData.totalExperience = experienceYears ? parseInt(experienceYears[0]) : 0; // If a number is found, convert to an integer
  
      // Create the new job application document
      const jobApplication = new JobApplication(jobApplicationData);
      await jobApplication.save();
  
      res.status(201).json({ message: 'Job application created successfully', jobApplication });
    } catch (err) {
      res.status(500).json({ message: 'Error creating job application', error: err.message });
    }
  };
  
  

// Get all job applications
exports.getJobApplications = async (req, res) => {
  try {
    const jobApplications = await JobApplication.find();
    res.status(200).json(jobApplications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching job applications', error: err.message });
  }
};

// Get a single job application by ID
exports.getJobApplicationById = async (req, res) => {
  try {
    const jobApplication = await JobApplication.findById(req.params.id);
    if (!jobApplication) {
      return res.status(404).json({ message: 'Job application not found' });
    }
    res.status(200).json(jobApplication);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching job application', error: err.message });
  }
};

// Update a job application
exports.updateJobApplication = async (req, res) => {
    try {
      // Check if the resume file has been uploaded
      const resumeFilePath = req.files && req.files['resume'] ? path.join('resumes', req.files['resume'][0].filename) : null;
  
      // Prepare the data for updating the job application
      const updatedData = {
        ...req.body, // Body data from the form
        resume: resumeFilePath || req.body.resume // Keep the existing resume path if no new file uploaded
      };
  
      // Find and update the job application by ID
      const updatedJobApplication = await JobApplication.findByIdAndUpdate(req.params.id, updatedData, { new: true });
  
      if (!updatedJobApplication) {
        return res.status(404).json({ message: 'Job application not found' });
      }
  
      res.status(200).json(updatedJobApplication);
    } catch (err) {
      res.status(500).json({ message: 'Error updating job application', error: err.message });
    }
  };

// Delete a job application
exports.deleteJobApplication = async (req, res) => {
  try {
    const deletedJobApplication = await JobApplication.findByIdAndDelete(req.params.id);
    if (!deletedJobApplication) {
      return res.status(404).json({ message: 'Job application not found' });
    }
    res.status(200).json({ message: 'Job application deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting job application', error: err.message });
  }
};
