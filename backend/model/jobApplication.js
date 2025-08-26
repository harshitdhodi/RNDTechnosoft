// models/JobApplication.js
const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  positionApplied: { type: String, required: true },
  firstName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  resume:{type: String, required: true },
  maritalStatus: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  currentLocation: { type: String, required: true },
  email: { type: String, required: true },
  majorIllness: { type: String, default: '' },
  smoke: { type: Boolean, default: false },
  alcohol: { type: Boolean, default: false },
  differentlyAbled: { type: Boolean, default: false },
  currentOrganisation: { type: String, required: true },
  currentDesignation: { type: String, required: true },
  reportToDesignation: { type: String, required: true },
  reportToName: { type: String, required: true },
  peopleReporting: { type: Number, required: true },
  totalExperience: { type: Number, required: true },
  fixedSalary: { type: Number, required: true },
  bonusIncentive: { type: Number, required: true },
  totalSalary: { type: Number, required: true },
  expectedSalary: { type: Number, required: true },
  noticePeriod: { type: String, required: true },
  status:{type:String, default:"Accept"}
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
