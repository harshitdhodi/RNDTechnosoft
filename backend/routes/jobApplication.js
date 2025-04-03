// routes/jobApplicationRoutes.js
const express = require('express');
const router = express.Router();
const jobApplicationController = require('../controller/jobApplication');
const { uploadPhoto } = require('../middleware/fileUpload');

// Create a new job application
router.post('/addJob',uploadPhoto, jobApplicationController.createJobApplication);

// Get all job applications
router.get('/getJob', jobApplicationController.getJobApplications);

// Get a job application by ID
router.get('/getJobById/:id', jobApplicationController.getJobApplicationById);

// Update a job application
router.put('/UpdateJobById/:id',uploadPhoto, jobApplicationController.updateJobApplication);

// Delete a job application
router.delete('/deleteJob/:id', jobApplicationController.deleteJobApplication);

module.exports = router;
